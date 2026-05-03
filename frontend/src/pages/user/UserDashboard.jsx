import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Target, Eye, Calendar, ArrowRight, Sparkles, User, Briefcase } from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import TiltCard from '../../components/futuristic/TiltCard';
import AnimatedCounter from '../../components/futuristic/AnimatedCounter';
import MatchScoreRing from '../../components/futuristic/MatchScoreRing';
import AILoader from '../../components/futuristic/AILoader';
import SkeletonCard from '../../components/futuristic/SkeletonCard';
import JobApplyModal from '../../components/shared/JobApplyModal';
import useAuthUser from '../../hooks/useAuthUser';

import { getDashboardStats } from '../../api/users';
import { getJobs } from '../../api/jobs';

/* ── Metric card config ──────────────────────────────────── */
const METRICS = [
    { key: 'applicationsSent', label: 'Applications Sent', icon: Send, glow: 'blue' },
    { key: 'matchesFound', label: 'Matches Found', icon: Target, glow: 'green' },
    { key: 'profileViews', label: 'Profile Views', icon: Eye, glow: 'purple' },
    { key: 'interviewsScheduled', label: 'Interviews', icon: Calendar, glow: 'amber' },
];

const glowColors = {
    blue: 'text-indigo-500',
    green: 'text-emerald-500',
    purple: 'text-purple-500',
    amber: 'text-amber-500',
};

/* ── Job card ────────────────────────────────────────────── */
const JobItem = ({ job, onApply }) => {
    const skills = (job.required_skills || '').split(',').slice(0, 3);
    return (
        <TiltCard className="group h-full">
            <GlassCard hover glow="blue" padding="md" animate={false} className="h-full flex flex-col">
                {/* Company row */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-200 flex items-center justify-center font-heading font-bold text-indigo-700 text-sm shadow-sm">
                        {job.company_name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 truncate font-medium">{job.company_name}</p>
                        <h3 className="text-sm font-heading font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {job.job_title}
                        </h3>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                    {skills.filter(Boolean).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-600">
                            {s.trim()}
                        </span>
                    ))}
                    {job.location && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700">
                            {job.location}
                        </span>
                    )}
                </div>

                {/* Apply button */}
                <button
                    onClick={() => onApply(job)}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 w-full py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors shadow-sm"
                >
                    Apply Now
                </button>
            </GlassCard>
        </TiltCard>
    );
};

/* ── Page ────────────────────────────────────────────────── */
const UserDashboard = () => {
    const { name } = useAuthUser();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        applicationsSent: 0, matchesFound: 0,
        profileViews: 0, interviewsScheduled: 0, profileCompletion: 0,
    });
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [statsData, jobsData] = await Promise.all([
                    getDashboardStats(),
                    getJobs({ status: 'Open' }),
                ]);
                if (statsData.success) setStats(statsData.data);
                if (jobsData.success && Array.isArray(jobsData.data)) setJobs(jobsData.data);
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <UserLayout>
            {/* ── Greeting ───────────────────────────── */}
            <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <p className="text-indigo-600 text-sm font-bold mb-1 font-mono-hirex tracking-widest uppercase">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h1 className="font-heading text-4xl font-bold text-slate-900 tracking-tight">
                    Welcome back,{' '}
                    <span className="text-indigo-600">{name}</span>! 👋
                </h1>
                <p className="text-slate-600 mt-2 font-medium">Here's what's happening with your job search today.</p>
            </motion.div>

            {/* ── Metrics ────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {METRICS.map(({ key, label, icon: Icon, glow }, i) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                        <GlassCard hover glow={glow} padding="md" animate={false}>
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-xl bg-slate-50 border border-slate-100 ${glowColors[glow]} shadow-sm`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <AnimatedCounter
                                value={loading ? 0 : (stats[key] || 0)}
                                className={`font-heading text-4xl font-extrabold ${glowColors[glow]} block`}
                            />
                            <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">{label}</p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* ── Profile completion + Jobs ───────────── */}
            <div className="grid lg:grid-cols-[280px_1fr] gap-6 mb-8">
                {/* Profile ring */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <GlassCard padding="lg" className="text-center py-16">
                        <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No recommended jobs yet</h3>
                        <p className="text-slate-600 font-medium mb-6">Complete your profile to get AI-curated matches.</p>
                        <button
                            onClick={() => navigate('/user/job-discovery')}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                            Browse All Jobs
                        </button>
                    </GlassCard>
                </motion.div>

                {/* Recommended jobs */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <h2 className="font-heading font-bold text-slate-900 text-xl tracking-tight">Recommended Jobs</h2>
                        </div>
                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{jobs.length} available</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => <SkeletonCard key={i} height="h-20" lines={2} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {jobs.slice(0, 6).map((job, idx) => (
                                <motion.div
                                    key={job.job_id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.06 }}
                                >
                                    <JobItem
                                        job={job}
                                        onApply={(j) => { setSelectedJob(j); setIsApplyModalOpen(true); }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Apply modal – preserved */}
            <JobApplyModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                job={selectedJob}
            />
        </UserLayout>
    );
};

export default UserDashboard;
