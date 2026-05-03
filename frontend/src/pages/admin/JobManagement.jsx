import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RefreshCw, AlertTriangle, Power, Search, X, Briefcase } from 'lucide-react';
import AdminLayout from '../../components/admin-layout/AdminLayout';
import api from '../../api/axios';
import useDebounce from '../../hooks/useDebounce';

/**
 * JobManagement — Professional Executive Edition
 * Clean white table UI for monitoring and managing all job postings.
 */
const JobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [error, setError] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const fetchJobs = async () => {
        try {
            setIsRefreshing(true);
            setLoading(true);
            const response = await api.get('/admin/jobs');
            if (response.data?.success) {
                setJobs(response.data.data || []);
                setError(null);
            }
        } catch (err) {
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleConfirmDelete = async (jobId) => {
        try {
            const response = await api.delete(`/admin/jobs/${jobId}`);
            if (response.data?.success) {
                fetchJobs();
                setConfirmDeleteId(null);
            }
        } catch (err) {
            setError('Failed to delete job posting. Please try again.');
        }
    };

    const handleToggleStatus = async (jobId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'closed' : 'active';
            const response = await api.patch(`/admin/jobs/${jobId}/status`, { status: newStatus });
            if (response.data?.success) fetchJobs();
        } catch (err) {
            setError('Failed to update job status.');
        }
    };

    const filteredJobs = useMemo(() =>
        jobs.filter(j =>
            j.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            j.company?.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            j.location?.toLowerCase().includes(debouncedSearch.toLowerCase())
        ), [jobs, debouncedSearch]
    );

    const getStatusBadge = (status) => {
        return status === 'active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-amber-50 text-amber-700 border-amber-200';
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Job Management
                        </h1>
                        <p className="text-sm text-[#6b7280] mt-1">
                            Monitor and moderate all job postings on the platform
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6b7280] bg-white border border-[#e5e7ef] px-3 py-1.5 rounded-lg">
                        <Briefcase size={14} />
                        <span className="font-medium">{filteredJobs.length} jobs</span>
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
                            placeholder="Search by title, company, or location..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e7ef] rounded-xl text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchJobs}
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
                                {['Title', 'Company', 'Status', 'Posted', 'Actions'].map((h, i) => (
                                    <th key={h} className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] ${i === 4 ? 'text-right' : ''}`}>
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
                                        <span className="text-sm text-[#9ca3af]">Loading jobs...</span>
                                    </div>
                                </td></tr>
                            ) : filteredJobs.length === 0 ? (
                                <tr><td colSpan={5} className="py-16 text-center text-sm text-[#6b7280]">No jobs found.</td></tr>
                            ) : filteredJobs.map((job) => (
                                <React.Fragment key={job.id}>
                                    <motion.tr
                                        variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
                                        className="border-b border-[#f3f4f8] hover:bg-[#f8f9fc] transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-[#111827]">{job.title}</p>
                                                <p className="text-[11px] text-[#9ca3af]">{job.location} · {job.job_type}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-[#374151]">{job.company_name || 'Unknown'}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getStatusBadge(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[#6b7280]">
                                            {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(job.id, job.status)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                                                    title="Toggle status"
                                                >
                                                    <Power size={12} />
                                                    Toggle
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(job.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>

                                    <AnimatePresence>
                                        {confirmDeleteId === job.id && (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-red-50 border-x border-red-100"
                                            >
                                                <td colSpan={5} className="px-5 py-4">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3 text-red-700">
                                                            <AlertTriangle size={16} />
                                                            <p className="text-sm font-semibold">Delete "{job.title}"?</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-sm font-medium text-[#6b7280] hover:text-[#111827] transition-colors">
                                                                Cancel
                                                            </button>
                                                            <button onClick={() => handleConfirmDelete(job.id)} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
                                                                Confirm Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </motion.tbody>
                    </table>

                    {!loading && (
                        <div className="px-5 py-3 border-t border-[#f3f4f8]">
                            <span className="text-[11px] text-[#9ca3af]">Showing {filteredJobs.length} of {jobs.length} jobs</span>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default JobManagement;
