import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    Users,
    Target,
    Clock,
    Plus,
    Calendar,
    ArrowRight,
    Activity,
    ShieldCheck,
    Zap,
    ChevronRight,
    Sparkles,
    MoreHorizontal
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProviderLayout } from '../../components/provider-layout';
import {
    MetricCard,
    StatusBadge,
    TopProgressBar,
    SkeletonCard
} from '../../components/provider-ui';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

/**
 * Advanced Recruitment Command Center
 * High-fidelity dashboard for executive recruitment oversight.
 */
const ProviderDashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard/provider/stats');
                if (response.data.success) {
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error('Data synchronization failed');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = dashboardData?.stats;
    const recentJobs = dashboardData?.recentJobs || [];
    const applicationTrendData = dashboardData?.applicationTrendData || [];

    // Animation Configurations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    const floatVariants = {
        hidden: { y: 16, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    if (loading && !dashboardData) {
        return (
            <ProviderLayout>
                <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
                            <div className="h-4 w-48 bg-slate-100 animate-pulse rounded-lg" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} className="h-32" />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SkeletonCard className="h-80" />
                        <SkeletonCard className="h-80" />
                    </div>
                </div>
            </ProviderLayout>
        );
    }

    // Dynamic metrics calculations (simulated velocity/trends based on payload existence)
    const applicantTrend = stats?.applicants > 20 ? 14.2 : 2.1;
    const jobsTrend = stats?.jobsPosted > 5 ? 8.4 : 0;
    const shortlistTrend = stats?.shortlisted > 5 ? 12.5 : null;

    return (
        <ProviderLayout>
            <TopProgressBar loading={loading} />

            <div className="provider-mesh-bg min-h-screen -mt-20 pt-20 px-6 pb-12 relative overflow-hidden">
                <div className="max-w-[1600px] mx-auto relative z-10">
                    {/* Executive Header */}
                    <motion.div variants={floatVariants} initial="hidden" animate="visible" className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Pulse: Optimized</span>
                                </div>
                                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 flex items-center gap-1.5 shadow-sm">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Shield Active</span>
                                </div>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                {user?.company_name || user?.name || 'Command'} <span className="text-blue-600">Center</span>
                            </h1>
                            <p className="text-sm font-medium text-slate-400 mt-2">Executive oversight of company architecture and talent acquisition.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session Protocol</div>
                                    <div className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/provider/jobs')}
                                className="provider-btn-primary h-14 px-8 rounded-2xl flex items-center gap-3 shadow-[0_4px_16px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] group"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-black uppercase text-xs tracking-widest">Post Position</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Primary Metrics Layer */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
                    >
                        <motion.div variants={itemVariants} className="h-full">
                            <MetricCard
                                title="Talent Pool"
                                value={stats?.applicants || 0}
                                icon={Users}
                                trend={applicantTrend}
                                trendLabel="Velocity"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants} className="h-full">
                            <MetricCard
                                title="Active Roles"
                                value={stats?.jobsPosted || 0}
                                icon={Briefcase}
                                trend={jobsTrend}
                                trendLabel="Expansion"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants} className="h-full">
                            <MetricCard
                                title="Shortlisted"
                                value={stats?.shortlisted || 0}
                                icon={Target}
                                trend={shortlistTrend}
                                trendLabel="Precision"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants} className="h-full">
                            <MetricCard
                                title="Interviews"
                                value={stats?.interviewed || 0}
                                icon={Clock}
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12"
                    >
                        {/* The Pulse Chart: High Fidelity Analytics */}
                        <motion.div variants={itemVariants} className="xl:col-span-8 provider-panel p-8 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-[0.05em]">Acquisition Dynamics</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time candidate influx tracking</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-blue-100">30 Days</button>
                                    <button className="px-4 py-2 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">90 Days</button>
                                </div>
                            </div>
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={applicationTrendData}>
                                        <defs>
                                            <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono' }}
                                            dy={15}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: '#fff' }}
                                            labelStyle={{ fontFamily: 'Inter', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}
                                            itemStyle={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: '#0f172a' }}
                                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="apps"
                                            stroke="#2563eb"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#pulseGradient)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                                            animationDuration={2500}
                                            animationEasing="ease-out"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Secondary Metrics & Quick Actions */}
                        <motion.div variants={itemVariants} className="xl:col-span-4 space-y-6">
                            <div className="provider-panel p-8 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 blur-[60px] opacity-20 animate-[pulseRing_4s_infinite]" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 relative z-10">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                    AI Copilot Insights
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer group/insight"
                                        style={{ backgroundColor: 'var(--theme-hover, rgba(0,0,0,0.02))', borderColor: 'var(--theme-border)' }}>
                                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 group-hover/insight:scale-110 transition-transform">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black tracking-tight text-slate-900 leading-none mb-1.5">Rank Delta Detected</div>
                                            <div className="text-[10px] text-slate-500 font-medium leading-relaxed">{stats?.shortlisted > 0 ? `${stats.shortlisted} candidates heavily match requirements.` : 'Auto-ranking analyzing candidates...'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer group/insight"
                                        style={{ backgroundColor: 'var(--theme-hover, rgba(0,0,0,0.02))', borderColor: 'var(--theme-border)' }}>
                                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover/insight:scale-110 transition-transform">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black tracking-tight text-slate-900 leading-none mb-1.5">System Status</div>
                                            <div className="text-[10px] text-slate-500 font-medium leading-relaxed">Agentic scanning enabled for active positions.</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/provider/ai-tools')}
                                        className="w-full mt-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors group/btn border shadow-sm hover:shadow-md"
                                        style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-primary)', borderColor: 'var(--theme-border)' }}
                                    >
                                        Launch AI Studio <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="provider-panel p-8 shadow-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Recruitment Velocity</h3>
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between text-[11px] font-black text-slate-900 mb-2 uppercase tracking-tighter">
                                            <span>Conversion Rate</span>
                                            <span className="text-blue-600 font-mono text-xs">{applicantTrend ? `${(stats?.shortlisted / stats?.applicants * 100 || 0).toFixed(1)}%` : '0%'}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${Math.min((stats?.shortlisted / stats?.applicants * 100 || 0), 100)}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-blue-600 rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-black text-slate-900 mb-2 uppercase tracking-tighter">
                                            <span>System Capacity</span>
                                            <span className="text-emerald-600 font-mono text-xs">Optimal</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '85%' }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                                                className="h-full bg-emerald-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Tactical Pipelines Layer */}
                    <motion.div variants={floatVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-[0.05em]">Active Pipelines</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mission critical job listings</p>
                            </div>
                            <Link to="/provider/jobs" className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform bg-blue-50 px-4 py-2 rounded-xl">
                                Full Portfolio <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="provider-panel shadow-sm overflow-hidden bg-white border-slate-200">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Position & Metadata</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicants</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Status</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentJobs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-16 text-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                    <Briefcase className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-900">No active pipelines</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Create a position to begin tracking</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        recentJobs.slice(0, 5).map((job) => (
                                            <tr key={job.job_id} className="hover:bg-blue-50/30 transition-all group border-l-2 border-l-transparent hover:border-l-blue-500 cursor-pointer" onClick={() => navigate('/provider/jobs')}>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:shadow-sm transition-all border border-slate-100 group-hover:border-blue-100">
                                                            <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 text-sm tracking-tight capitalize group-hover:text-blue-600 transition-colors">{job.job_title}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.05em] mt-0.5">{job.department || 'General'} • {job.experience_level || 'Open'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-sm font-black text-slate-900 font-mono">{job.applicant_count || 0}</div>
                                                        <div className="flex -space-x-2">
                                                            {[...Array(Math.min(3, job.applicant_count || 0))].map((_, i) => (
                                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <StatusBadge status={job.status} />
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100/50 transition-all transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ripple-effect">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ProviderLayout>
    );
};

export default ProviderDashboard;
