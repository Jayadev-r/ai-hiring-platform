import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Calendar, ExternalLink, Filter } from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import SkeletonCard from '../../components/futuristic/SkeletonCard';
import AnimatedCounter from '../../components/futuristic/AnimatedCounter';
import { getUserApplications } from '../../api/applications';

/* ── Status config ─────────────────────────────────────── */
const STATUSES = {
    applied: { label: 'Applied', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' },
    shortlisted: { label: 'Shortlisted', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
    shortlisted_for_test: { label: 'Test', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
    interview: { label: 'Interview', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
    accepted: { label: 'Accepted', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
    rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

const getStatus = (s) => STATUSES[(s || '').toLowerCase()] || { label: s, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' };

/* ── Page ─────────────────────────────────────────────────── */
const ApplicationTracker = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [summary, setSummary] = useState({ total: 0, applied: 0, shortlisted: 0, shortlisted_for_test: 0, interview: 0, accepted: 0, rejected: 0 });

    useEffect(() => {
        (async () => {
            try {
                const result = await getUserApplications();
                if (result.success) {
                    setApplications(result.applications || []);
                    if (result.summary) setSummary(result.summary);
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        })();
    }, []);

    const filtered = statusFilter === 'all'
        ? applications
        : applications.filter(a => (a.status || '').toLowerCase() === statusFilter);

    const summaryItems = [
        { key: 'total', label: 'Total', filter: 'all', color: 'text-white' },
        { key: 'applied', label: 'Applied', filter: 'applied', color: 'text-sky-400' },
        { key: 'shortlisted', label: 'Shortlisted', filter: 'shortlisted', color: 'text-blue-400' },
        { key: 'shortlisted_for_test', label: 'Test', filter: 'shortlisted_for_test', color: 'text-amber-400' },
        { key: 'interview', label: 'Interview', filter: 'interview', color: 'text-orange-400' },
        { key: 'accepted', label: 'Accepted', filter: 'accepted', color: 'text-green-400' },
        { key: 'rejected', label: 'Rejected', filter: 'rejected', color: 'text-red-400' },
    ];

    return (
        <UserLayout>
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <ClipboardList className="w-6 h-6 text-indigo-500" />
                    <h1 className="font-heading text-4xl font-bold text-slate-900">Application Tracker</h1>
                </div>
                <p className="text-slate-600 mt-1 font-medium">Track all your job applications in one place</p>
            </motion.div>

            {/* Metric pills */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
                {summaryItems.map(({ key, label, filter, color }, i) => (
                    <motion.button
                        key={key}
                        onClick={() => setStatusFilter(filter)}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`glass-card p-3 text-center transition-all ${statusFilter === filter ? 'border-slate-300 bg-white/50' : 'hover:bg-slate-50'}`}
                    >
                        <AnimatedCounter
                            value={loading ? 0 : (summary[key] || 0)}
                            className={`${color === 'text-white' ? 'text-slate-900' : color} font-heading text-xl font-bold block`}
                        />
                        <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">{label}</p>
                    </motion.button>
                ))}
            </div>

            {/* Filter bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <GlassCard padding="sm" animate={false} className="mb-5">
                    <div className="flex items-center gap-3 px-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="glass-input px-3 py-1.5 text-sm"
                        >
                            <option value="all">All Applications</option>
                            {Object.entries(STATUSES).map(([v, s]) => (
                                <option key={v} value={v}>{s.label}</option>
                            ))}
                        </select>
                        <span className="ml-auto text-xs text-slate-600">
                            {filtered.length} of {applications.length}
                        </span>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Applications list */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} height="h-8" lines={1} />)}
                </div>
            ) : filtered.length === 0 ? (
                <GlassCard padding="lg" className="text-center py-16">
                    <ClipboardList className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No applications found</h3>
                    <p className="text-slate-600 font-medium">Start applying to jobs to see them here</p>
                </GlassCard>
            ) : (
                <div className="space-y-3">
                    {filtered.map((app, i) => {
                        const st = getStatus(app.status);
                        return (
                            <motion.div
                                key={app.application_id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.035 }}
                            >
                                <GlassCard hover glow="purple" padding="md" animate={false}>
                                    <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                                        {/* Company logo / initial */}
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 border border-slate-200 flex items-center justify-center font-heading font-bold text-indigo-700 text-sm shrink-0">
                                            {app.company_logo
                                                ? <img src={app.company_logo} alt={app.company_name} className="w-full h-full object-cover rounded-xl" />
                                                : app.company_name?.charAt(0) || 'C'
                                            }
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-heading font-bold text-slate-900 text-sm truncate">{app.job_title}</h3>
                                            <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{app.company_name}</p>
                                        </div>

                                        {/* Status badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.border} border ${st.color} shrink-0`}>
                                            {st.label}
                                        </span>

                                        {/* Date */}
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 shrink-0">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(app.applied_at).toLocaleDateString()}
                                        </div>

                                        {/* View */}
                                        <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-400 transition-colors shrink-0">
                                            <ExternalLink className="w-3.5 h-3.5" /> View
                                        </button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </UserLayout>
    );
};

export default ApplicationTracker;
