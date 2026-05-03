import express from 'express';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import {
    isValidEmail,
    validateRequired,
    isValidPassword,
    isValidIntent,
    mapIntentToRole
} from '../utils/validation.js';
import { getCache, setCache, deleteCache, cacheKeys, TTL } from '../utils/cache.js';

// ── Session Cache Warmup ──────────────────────────────────────────────────────
/**
 * Preloads all user-related data into Redis immediately after login.
 * Runs as a fire-and-forget background task — the HTTP response is
 * already sent before this function completes.
 *
 * This ensures that when the user navigates any panel, data is already
 * cached and API responses are near-instant (~5ms).
 */
async function warmupSessionCache(userId, role) {
    try {
        const { query } = await import('../config/db.js');
        console.log(`[REDIS] Warming up cache for user ${userId} (role: ${role})...`);

        // Always cache the user profile
        const userResult = await query(
            'SELECT id, email, role, is_verified, name, created_at FROM credentials WHERE id = $1',
            [userId]
        );
        if (userResult.rows.length > 0) {
            await setCache(cacheKeys.user(userId), userResult.rows[0], TTL.USER);
        }

        // Recruiter-specific data
        if (role === 'recruiter') {
            // Fetch company
            const companyResult = await query(
                'SELECT * FROM companies WHERE created_by = $1',
                [userId]
            );
            const company = companyResult.rows[0] || null;

            // Convert binary logo to base64 for safe JSON serialisation
            if (company?.logo) {
                company.logo = `data:image/jpeg;base64,${company.logo.toString('base64')}`;
            }
            await setCache(cacheKeys.company(userId), company, TTL.COMPANY);

            if (company) {
                // Fetch recruiter jobs
                const jobsResult = await query(
                    `SELECT job_id, job_title, department, job_type, experience_level,
                            location, status, created_at, updated_at,
                            require_education, require_skills, required_skills, required_education
                     FROM job_postings WHERE company_id = $1 ORDER BY created_at DESC`,
                    [company.id]
                );
                await setCache(cacheKeys.recruiterJobs(userId), jobsResult.rows, TTL.RECRUITER_JOBS);

                // Fetch recruiter applications
                const appsResult = await query(
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
                );
                await setCache(cacheKeys.recruiterApplications(userId), appsResult.rows, TTL.APPLICATIONS);
            }
        }

        console.log(`[REDIS] Cache warmup complete for user ${userId}`);
    } catch (err) {
        // Warmup failure must NEVER affect the user-facing response
        console.error(`[REDIS] Cache warmup failed for user ${userId}:`, err.message);
    }
}

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 * @body    { name, email, password, intent }
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, intent } = req.body;

        // Validate required fields
        const requiredCheck = validateRequired(
            { name, email, password, intent },
            ['name', 'email', 'password', 'intent']
        );
        if (!requiredCheck.valid) {
            return res.status(400).json({
                success: false,
                message: requiredCheck.message
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate password strength
        const passwordCheck = isValidPassword(password);
        if (!passwordCheck.valid) {
            return res.status(400).json({
                success: false,
                message: passwordCheck.message
            });
        }

        // Validate intent
        if (!isValidIntent(intent)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid intent. Must be "job" or "employee"'
            });
        }

        // Map intent to role
        const role = mapIntentToRole(intent);
        const normalizedEmail = email.toLowerCase();

        // Import PostgreSQL pool and bcrypt
        const { query } = await import('../config/db.js');
        const bcrypt = await import('bcryptjs');

        // Check if user already exists
        const checkUserQuery = `
            SELECT id FROM credentials WHERE email = $1
        `;
        const { rows: existingRows } = await query(checkUserQuery, [normalizedEmail]);

        if (existingRows.length > 0) {
            throw new Error('Email already exists');
        }

        // Hash password with bcrypt (salt rounds: 10)
        const passwordHash = await bcrypt.default.hash(password, 10);

        // Insert new user (parameterized query prevents SQL injection)
        const insertQuery = `
            INSERT INTO credentials (email, password_hash, role, is_verified, name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, role, is_verified, name, created_at
        `;

        const { rows: insertedRows } = await query(insertQuery, [
            normalizedEmail,
            passwordHash,
            role,
            false,
            name
        ]);

        const user = insertedRows[0];

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.message === 'Email already exists') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists. Please use a different email or log in.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login existing user - Validates credentials and returns user with role
 * @access  Public
 * @body    { email, password }
 * 
 * SECURITY IMPLEMENTATION:
 * - Direct PostgreSQL access (no Supabase REST API)
 * - Parameterized queries prevent SQL injection
 * - bcrypt password hashing
 * - Password hash never exposed in response
 * - Returns user role for frontend routing
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        const requiredCheck = validateRequired(
            { email, password },
            ['email', 'password']
        );
        if (!requiredCheck.valid) {
            return res.status(400).json({
                success: false,
                message: requiredCheck.message
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Import PostgreSQL pool and bcrypt
        const { query } = await import('../config/db.js');
        const bcrypt = await import('bcryptjs');

        // Check if user exists (parameterized query)
        const checkUserQuery = `
            SELECT id, email, password_hash, role, is_verified, name, created_at
            FROM credentials
            WHERE email = $1
        `;

        const { rows } = await query(checkUserQuery, [normalizedEmail]);
        const existingUser = rows[0];

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.default.compare(password, existingUser.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Remove password_hash from response (SECURITY: Never expose password hash)
        const { password_hash, ...sanitizedUser } = existingUser;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: sanitizedUser
        });

        // ── Session Cache Warmup (fire-and-forget) ────────────────────────────
        // Response is already sent. Preload all dashboard data into Redis so
        // every subsequent API call returns instantly from cache.
        warmupSessionCache(existingUser.id, existingUser.role).catch(console.error);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info from PostgreSQL
 * @access  Private (requires JWT)
 */
router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cacheKey = cacheKeys.user(userId);

        // ── 1. Check Redis first ──────────────────────────────────────────────
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.json({ success: true, user: cached });
        }

        // ── 2. Cache miss → query PostgreSQL ─────────────────────────────────
        const { query } = await import('../config/db.js');

        const getUserQuery = `
            SELECT id, email, role, is_verified, name, created_at
            FROM credentials
            WHERE id = $1
        `;

        const { rows } = await query(getUserQuery, [userId]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // ── 3. Store in Redis for subsequent calls ────────────────────────────
        await setCache(cacheKey, user, TTL.USER);

        res.json({ success: true, user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});


// ==========================================
// Google OAuth Routes
// ==========================================

import passport from '../config/passport.js';

// Initiate Google Login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

// Google Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        try {
            // Generate JWT for the authenticated user
            const user = req.user;
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            // Redirect to frontend with token
            // Ensure FRONTEND_URL is set in .env
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/oauth-success?token=${token}`);

        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
        }
    }
);

export default router;
