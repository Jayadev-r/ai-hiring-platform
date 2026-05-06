import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Target, Eye, Calendar, ArrowRight, Sparkles, User, Briefcase, CheckCircle } from 'lucide-react';

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
import { getUserApplications } from '../../api/applications';
import { getCandidateInterviews } from '../../services/interviewService';

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
const JobItem = ({ job, onApply, isApplied }) => {
    const skills = (job.required_skills || '').split(',').slice(0, 3);
    const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name || 'Company')}&background=e0e7ff&color=4338ca&bold=true`;
    const logoUrl = job.company_logo || fallbackLogo;

    return (
        <motion.div whileHover={{ y: -4 }} className="h-full">
            <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="p-5 flex-1 flex flex-col">
                    {/* Header: Logo and Title */}
                    <div className="flex items-start gap-4 mb-4">
                        <img 
                            src={logoUrl} 
                            alt={job.company_name} 
                            onError={(e) => { e.target.src = fallbackLogo; }}
                            className="w-12 h-12 rounded-lg border border-slate-100 object-cover bg-white shadow-sm flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {job.job_title}
                            </h3>
                            <div className="text-sm font-medium text-slate-500 truncate mt-0.5">
                                {job.company_name}
                            </div>
                        </div>
                    </div>

                    {/* Meta tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {job.location && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold">
                                <Target className="w-3.5 h-3.5 text-slate-400" />
                                {job.location}
                            </span>
                        )}
                        {job.job_type && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
                                {job.job_type}
                            </span>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {skills.filter(Boolean).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                                {s.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
                    {job.salary_min ? (
                        <div className="text-xs font-bold text-slate-700">
                            ₹{job.salary_min / 1000}k+ <span className="text-[10px] text-slate-500 font-normal">/yr</span>
                        </div>
                    ) : (
                        <div className="text-xs font-medium text-slate-500">Salary Undisclosed</div>
                    )}
                    {isApplied ? (
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5" /> Applied
                        </div>
                    ) : (
                        <button 
                            onClick={() => onApply(job)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            Apply Now
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
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
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [userApplications, setUserApplications] = useState([]);

    const fetchApplications = async () => {
        try {
            const res = await getUserApplications();
            if (res.success) setUserApplications(res.applications || []);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        (async () => {
            try {
                const [statsData, jobsData, interviewsData] = await Promise.all([
                    getDashboardStats().catch(() => ({})),
                    getJobs({ status: 'Open' }).catch(() => ({})),
                    getCandidateInterviews().catch(() => ({}))
                ]);
                if (statsData?.success) setStats(statsData.data);
                if (jobsData?.success && Array.isArray(jobsData.data)) setJobs(jobsData.data);
                if (interviewsData?.success && Array.isArray(interviewsData.data)) setInterviews(interviewsData.data);
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            } finally {
                setLoading(false);
            }
        })();
        fetchApplications();
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

            {/* ── Upcoming Interviews ────────────────── */}
            {interviews.filter(i => i.status === 'scheduled' || i.status === 'in_progress').length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <h2 className="font-heading font-bold text-slate-900 text-xl tracking-tight">Your Upcoming Interviews</h2>
                        </div>
                        <button onClick={() => navigate('/user/interviews')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {interviews.filter(i => i.status === 'scheduled' || i.status === 'in_progress').slice(0, 3).map((interview, idx) => (
                            <motion.div key={interview.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                                <GlassCard hover glow="amber" padding="md" className="h-full flex flex-col">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2 max-w-[70%]">
                                            <Briefcase className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                            <h3 className="font-heading font-semibold text-slate-900 text-sm truncate">{interview.job_title}</h3>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-600 border border-green-200">
                                            {interview.status === 'in_progress' ? 'Live Now' : 'Scheduled'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mb-4">{interview.company_name}</div>
                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <div className="text-[10px] text-slate-400 font-semibold uppercase">Date</div>
                                            <div className="text-xs font-bold text-slate-700">{new Date(interview.interview_date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <div className="text-[10px] text-slate-400 font-semibold uppercase">Time</div>
                                            <div className="text-xs font-bold text-slate-700">{interview.start_time?.substring(0,5)}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate('/user/interviews')} className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors">
                                        Join Session
                                    </button>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Recommended Jobs ───────────── */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-heading font-bold text-slate-900 text-2xl tracking-tight leading-none">Recommended Jobs</h2>
                            <p className="text-xs text-slate-500 mt-1 font-medium">AI-powered matches based on your profile</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{jobs.length} Available</span>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} height="h-20" lines={2} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {jobs.slice(0, 8).map((job, idx) => (
                            <motion.div
                                key={job.job_id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + idx * 0.04 }}
                            >
                                <JobItem
                                    job={job}
                                    isApplied={userApplications.some(a => a.job_id === job.job_id)}
                                    onApply={(j) => { setSelectedJob(j); setIsApplyModalOpen(true); }}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Apply modal – preserved */}
            <JobApplyModal
                isOpen={isApplyModalOpen}
                onClose={() => { setIsApplyModalOpen(false); fetchApplications(); }}
                job={selectedJob}
            />
        </UserLayout>
    );
};

export default UserDashboard;
