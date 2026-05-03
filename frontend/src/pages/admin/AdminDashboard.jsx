import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Activity, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin-layout/AdminLayout';
import AdminMetricCard from '../../components/admin-layout/AdminMetricCard';
import AdminTerminalPanel from '../../components/admin-layout/AdminTerminalPanel';
import AdminSystemChart from '../../components/admin-layout/AdminSystemChart';
import api from '../../api/axios';

/**
 * AdminDashboard — Professional Executive Edition
 * KPI-driven dashboard with a clean white design language.
 */
const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: null, jobs: null, applications: null });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                api.get('/admin/users'),
                api.get('/admin/jobs'),
                api.get('/admin/applications')
            ]);

            const [usersRes, jobsRes, appsRes] = results;
            setStats({
                users: usersRes.status === 'fulfilled' ? (usersRes.value?.data?.data?.length || 0) : null,
                jobs: jobsRes.status === 'fulfilled' ? (jobsRes.value?.data?.count || 0) : null,
                applications: appsRes.status === 'fulfilled' ? (appsRes.value?.data?.count || 0) : null
            });
        } catch (error) {
            console.error('Stats fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-[#6b7280] font-medium">Loading dashboard data...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Dashboard
                        </h1>
                        <p className="text-sm text-[#6b7280] mt-1">
                            Overview of your platform metrics and activity
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchStats}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e5e7ef] bg-white text-sm font-medium text-[#374151] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-150"
                    >
                        <Activity size={14} />
                        Refresh
                    </motion.button>
                </div>

                {/* KPI Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <AdminMetricCard
                        label="Total Users"
                        value={stats.users}
                        icon={Users}
                        accentColor="#4F46E5"
                        status="Active"
                        delay={0.05}
                    />
                    <AdminMetricCard
                        label="Job Listings"
                        value={stats.jobs}
                        icon={Briefcase}
                        accentColor="#0ea5e9"
                        status="Active"
                        delay={0.1}
                    />
                    <AdminMetricCard
                        label="Applications"
                        value={stats.applications}
                        icon={FileText}
                        accentColor="#10b981"
                        status="Active"
                        delay={0.15}
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Manage Users', desc: 'View and moderate all users', path: '/admin/users', color: '#4F46E5' },
                        { label: 'Review Jobs', desc: 'Monitor active job postings', path: '/admin/jobs', color: '#0ea5e9' },
                        { label: 'Applications', desc: 'Track candidate applications', path: '/admin/applications', color: '#10b981' },
                    ].map((item, i) => (
                        <motion.button
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            onClick={() => navigate(item.path)}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#e5e7ef] hover:border-[#d1d5e0] hover:shadow-md transition-all duration-200 group text-left"
                        >
                            <div>
                                <p className="text-sm font-semibold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                                    {item.label}
                                </p>
                                <p className="text-[11px] text-[#9ca3af] mt-0.5">{item.desc}</p>
                            </div>
                            <ArrowRight size={16} className="text-[#d1d5e0] group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all" />
                        </motion.button>
                    ))}
                </div>

                {/* Charts & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <AdminSystemChart title="Platform Traffic (24h)" color="#4F46E5" />
                    </div>
                    <div className="space-y-2">
                        <AdminTerminalPanel />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
