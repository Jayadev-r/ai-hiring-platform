import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';
import { getCache, setCache, cacheKeys, TTL } from '../utils/cache.js';

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Returns dashboard metrics for the logged-in job seeker
 */
router.get('/stats', auth, async (req, res) => {
    try {
        const { userId, email } = req.user;

        // Use user_id for robust lookup of candidate profile
        const candidateRes = await pool.query('SELECT id, experience_years, profile_description, skills, resume_url FROM candidates WHERE user_id = $1', [userId]);

        if (candidateRes.rows.length === 0) {
            // New user or no profile created yet: return zero stats instead of 404 to avoid dashboard crash
            return res.json({
                success: true,
                data: {
                    applicationsSent: 0,
                    matchesFound: 0,
                    profileViews: 0,
                    interviewsScheduled: 0,
                    profileCompletion: 0 // Prompt user to complete profile
                }
            });
        }

        const candidate = candidateRes.rows[0];

        // Calculate Profile Completion
        let completionScore = 20; // 20% Base score for basic info / account creation

        if (candidate.profile_description && candidate.profile_description.trim().length > 0) {
            completionScore += 20;
        }

        if (candidate.skills && candidate.skills.length > 0) {
            completionScore += 20;
        }

        // Check if they have added education OR experience
        const expCheck = await pool.query('SELECT 1 FROM candidate_experience WHERE candidate_id = $1 LIMIT 1', [candidate.id]);
        const eduCheck = await pool.query('SELECT 1 FROM candidate_education WHERE candidate_id = $1 LIMIT 1', [candidate.id]);
        if (expCheck.rows.length > 0 || eduCheck.rows.length > 0) {
            completionScore += 20;
        }

        // Check if they have uploaded a resume
        const resumeCheck = await pool.query('SELECT 1 FROM candidate_resumes WHERE candidate_id = $1 LIMIT 1', [candidate.id]);
        if (resumeCheck.rows.length > 0 || candidate.resume_url) {
            completionScore += 20;
        }

        // Matches: Approximate "matches" by finding jobs that have at least one of the user's skills
        let matchesCount = 0;
        if (candidate.skills && candidate.skills.length > 0) {
            matchesCount = 0; // Keeping 0 as placeholder for now
        }

        // Calculate Applications Sent
        const appsRes = await pool.query('SELECT COUNT(*) FROM job_applications WHERE candidate_id = $1', [candidate.id]);
        const appsCount = parseInt(appsRes.rows[0].count);
        console.log(`[Dashboard] User ${email} (Candidate ID: ${candidate.id}) - Applications found: ${appsCount}`);

        res.json({
            success: true,
            data: {
                applicationsSent: appsCount,
                matchesFound: matchesCount,
                profileViews: 0,
                interviewsScheduled: 0,
                profileCompletion: completionScore
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/dashboard/activity
 * Returns recent activity for the logged-in user
 */
router.get('/activity', auth, async (req, res) => {
    // Return empty list as we don't have activity tracking
    res.json({ success: true, data: [] });
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper: fetch all provider dashboard data from PostgreSQL
// Used by both the individual stats endpoint and the aggregated endpoint.
// ─────────────────────────────────────────────────────────────────────────────
async function fetchProviderDashboardFromDB(userId, userEmail) {
    // 1. Fetch Company Details
    const companyQuery = `
        SELECT id, name, logo, location, industry, website_url 
        FROM companies 
        WHERE created_by = $1
    `;
    const { rows: companyRows } = await pool.query(companyQuery, [userId]);
    const company = companyRows[0] || null;

    let stats = { jobsPosted: 0, applicants: 0, shortlisted: 0, interviewed: 0 };
    let recentJobs = [];
    let jobsPostedData = [];
    let applicationTrendData = [];

    if (company) {
        if (company.logo) {
            company.logo = `data:image/jpeg;base64,${company.logo.toString('base64')}`;
        }

        // Jobs count
        const jobsCountRes = await pool.query('SELECT COUNT(*) FROM job_postings WHERE company_id = $1', [company.id]);
        stats.jobsPosted = parseInt(jobsCountRes.rows[0].count);

        // Applicants count + shortlisted + interviewed
        const appsCountQuery = `
            SELECT COUNT(ja.id) as total,
                   SUM(CASE WHEN ja.status IN ('shortlisted', 'shortlisted_for_test') THEN 1 ELSE 0 END) as shortlisted_count,
                   SUM(CASE WHEN ja.status = 'interview' THEN 1 ELSE 0 END) as interviewed_count
            FROM job_applications ja
            JOIN job_postings jp ON ja.job_id = jp.job_id
            WHERE jp.company_id = $1
        `;
        const appsCountRes = await pool.query(appsCountQuery, [company.id]);
        stats.applicants = parseInt(appsCountRes.rows[0].total) || 0;
        stats.shortlisted = parseInt(appsCountRes.rows[0].shortlisted_count) || 0;
        stats.interviewed = parseInt(appsCountRes.rows[0].interviewed_count) || 0;

        // Recent Jobs (last 5)
        const recentJobsQuery = `
            SELECT job_id, job_title, status, created_at,
                   (SELECT COUNT(*) FROM job_applications WHERE job_id = jp.job_id) as applicant_count
            FROM job_postings jp
            WHERE company_id = $1
            ORDER BY created_at DESC
            LIMIT 5
        `;
        const { rows: jobsRows } = await pool.query(recentJobsQuery, [company.id]);
        recentJobs = jobsRows;

        // Jobs Posted by Month (last 6)
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            jobsPostedData.push({
                name: d.toLocaleString('en-US', { month: 'short' }),
                jobs: 0, month: d.getMonth() + 1, year: d.getFullYear()
            });
        }
        const jobsCountResByMonth = await pool.query(`
            SELECT EXTRACT(MONTH FROM created_at) as month, EXTRACT(YEAR FROM created_at) as year, COUNT(*) as count 
            FROM job_postings 
            WHERE company_id = $1 AND created_at >= NOW() - INTERVAL '6 months'
            GROUP BY EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
        `, [company.id]);
        jobsCountResByMonth.rows.forEach(row => {
            const item = jobsPostedData.find(d => d.month === parseInt(row.month) && d.year === parseInt(row.year));
            if (item) item.jobs = parseInt(row.count);
        });

        // Application Trends (last 7 days)
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            applicationTrendData.push({
                name: d.toLocaleString('en-US', { weekday: 'short' }),
                apps: 0,
                dateStr: d.toISOString().split('T')[0]
            });
        }
        const appsTrendRes = await pool.query(`
            SELECT TO_CHAR(ja.applied_at, 'YYYY-MM-DD') as date_str, COUNT(*) as count
            FROM job_applications ja
            JOIN job_postings jp ON ja.job_id = jp.job_id
            WHERE jp.company_id = $1 AND ja.applied_at >= NOW() - INTERVAL '7 days'
            GROUP BY TO_CHAR(ja.applied_at, 'YYYY-MM-DD')
        `, [company.id]);
        appsTrendRes.rows.forEach(row => {
            const item = applicationTrendData.find(d => d.dateStr === row.date_str);
            if (item) item.apps = parseInt(row.count);
        });
    }

    return {
        company,
        user: { email: userEmail },
        stats,
        recentJobs,
        jobsPostedData,
        applicationTrendData
    };
}

/**
 * GET /api/dashboard/provider/stats
 * Returns dashboard data for the logged-in RECRUITER (with Redis caching)
 */
router.get('/provider/stats', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cacheKey = cacheKeys.providerDashboard(userId);

        // ── 1. Check Redis first ──────────────────────────────────────────────
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.json({ success: true, ...cached });
        }

        // ── 2. Cache miss → query PostgreSQL ─────────────────────────────────
        const data = await fetchProviderDashboardFromDB(userId, req.user.email);

        // ── 3. Store result in Redis ──────────────────────────────────────────
        await setCache(cacheKey, data, TTL.DASHBOARD);

        res.json({ success: true, ...data });

    } catch (error) {
        console.error('Error fetching provider stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/dashboard/provider
 * Aggregated dashboard endpoint — replaces 5 separate frontend API calls.
 *
 * Returns:
 *   { user, company, stats, jobs, applications }
 *
 * Cache key: dashboard:provider:{userId}   TTL: 60s
 *
 * After session cache warmup (login), this returns entirely from Redis
 * with ~5ms response time.
 */
router.get('/provider', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cacheKey = cacheKeys.providerDashboard(userId);

        // ── 1. Check Redis first ──────────────────────────────────────────────
        const cached = await getCache(cacheKey);
        if (cached) {
            // Enrich with jobs and applications from their own cache keys
            const [jobs, applications] = await Promise.all([
                getCache(cacheKeys.recruiterJobs(userId)),
                getCache(cacheKeys.recruiterApplications(userId)),
            ]);

            return res.json({
                success: true,
                user: cached.user,
                company: cached.company,
                stats: cached.stats,
                recentJobs: cached.recentJobs,
                jobsPostedData: cached.jobsPostedData,
                applicationTrendData: cached.applicationTrendData,
                jobs: jobs || [],
                applications: applications || [],
            });
        }

        // ── 2. Cache miss → run all queries in parallel ───────────────────────
        const [dashboardData, jobsResult, appsResult] = await Promise.all([
            fetchProviderDashboardFromDB(userId, req.user.email),
            pool.query(
                `SELECT job_id, job_title, department, job_type, experience_level,
                        location, status, created_at, updated_at,
                        require_education, require_skills, required_skills, required_education
                 FROM job_postings
                 WHERE company_id = (SELECT id FROM companies WHERE created_by = $1)
                 ORDER BY created_at DESC`,
                [userId]
            ),
            pool.query(
                `SELECT ja.id, ja.status, ja.applied_at, ja.job_id, ja.resume_name, ja.resume_id,
                        jp.job_title, c.name as candidate_name, c.email as candidate_email,
                        c.experience_years as experience, c.skills, comp.created_by as company_owner
                 FROM job_applications ja
                 LEFT JOIN job_postings jp ON ja.job_id = jp.job_id
                 LEFT JOIN companies comp ON jp.company_id = comp.id
                 LEFT JOIN candidates c ON ja.candidate_id = c.id
                 WHERE comp.created_by = $1
                 ORDER BY ja.applied_at DESC`,
                [userId]
            ),
        ]);

        const jobs = jobsResult.rows;
        const applications = appsResult.rows;

        // ── 3. Store results in Redis ─────────────────────────────────────────
        await Promise.all([
            setCache(cacheKey, dashboardData, TTL.DASHBOARD),
            setCache(cacheKeys.recruiterJobs(userId), jobs, TTL.RECRUITER_JOBS),
            setCache(cacheKeys.recruiterApplications(userId), applications, TTL.APPLICATIONS),
        ]);

        res.json({
            success: true,
            user: dashboardData.user,
            company: dashboardData.company,
            stats: dashboardData.stats,
            recentJobs: dashboardData.recentJobs,
            jobsPostedData: dashboardData.jobsPostedData,
            applicationTrendData: dashboardData.applicationTrendData,
            jobs,
            applications,
        });

    } catch (error) {
        console.error('Error fetching aggregated provider dashboard:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
