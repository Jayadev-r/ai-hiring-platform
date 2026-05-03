import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, Search, X, FileText, User, Briefcase } from 'lucide-react';
import AdminLayout from '../../components/admin-layout/AdminLayout';
import api from '../../api/axios';
import useDebounce from '../../hooks/useDebounce';

/**
 * ApplicationManagement — Professional Executive Edition
 * Clean white table UI for tracking all candidate applications.
 */
const ApplicationManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const fetchApplications = async () => {
        try {
            setIsRefreshing(true);
            setLoading(true);
            const response = await api.get('/admin/applications');
            if (response.data?.success) {
                setApplications(response.data.data || []);
                setError(null);
            }
        } catch (err) {
            setError('Failed to load applications. Please try again.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    const filteredApplications = useMemo(() =>
        applications.filter(a =>
            a.candidate_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            a.job_title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            a.status?.toLowerCase().includes(debouncedSearch.toLowerCase())
        ), [applications, debouncedSearch]
    );

    const getStatusBadge = (status) => {
        const statusMap = {
            accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            rejected: 'bg-red-50 text-red-700 border-red-200',
            pending: 'bg-blue-50 text-blue-700 border-blue-200',
            shortlisted: 'bg-violet-50 text-violet-700 border-violet-200',
        };
        return statusMap[status] || 'bg-gray-50 text-gray-600 border-gray-200';
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Applications
                        </h1>
                        <p className="text-sm text-[#6b7280] mt-1">
                            Track and review all candidate applications across the platform
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6b7280] bg-white border border-[#e5e7ef] px-3 py-1.5 rounded-lg">
                        <FileText size={14} />
                        <span className="font-medium">{filteredApplications.length} applications</span>
                    </div>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                        >
                            <AlertTriangle size={16} className="flex-shrink-0" />
                            <span className="text-sm flex-1">{error}</span>
                            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                                <X size={15} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Search & Refresh */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by candidate, job, or status..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e7ef] rounded-xl text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchApplications}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e7ef] rounded-xl text-sm font-medium text-[#374151] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-[#e5e7ef] overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#f3f4f8] bg-[#f8f9fc]">
                                {['Candidate', 'Job Title', 'Company', 'Status', 'Applied'].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <motion.tbody initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
                            {loading ? (
                                <tr><td colSpan={5} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-7 h-7 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm text-[#9ca3af]">Loading applications...</span>
                                    </div>
                                </td></tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr><td colSpan={5} className="py-16 text-center text-sm text-[#6b7280]">No applications found.</td></tr>
                            ) : filteredApplications.map((app) => (
                                <motion.tr
                                    key={app.id}
                                    variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
                                    className="border-b border-[#f3f4f8] hover:bg-[#f8f9fc] transition-colors"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[11px] font-bold text-emerald-600">
                                                    {(app.candidate_name || 'A').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#111827]">{app.candidate_name || 'Anonymous'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm text-[#374151] font-medium">{app.job_title || 'Unknown'}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm text-[#6b7280]">{app.company_name || 'Unknown'}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getStatusBadge(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-[#6b7280]">
                                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>

                    {!loading && (
                        <div className="px-5 py-3 border-t border-[#f3f4f8]">
                            <span className="text-[11px] text-[#9ca3af]">Showing {filteredApplications.length} of {applications.length} applications</span>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ApplicationManagement;
