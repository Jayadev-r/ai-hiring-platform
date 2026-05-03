import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, LogIn, RefreshCw, AlertTriangle, Search, X, Users } from 'lucide-react';
import AdminLayout from '../../components/admin-layout/AdminLayout';
import api from '../../api/axios';
import useDebounce from '../../hooks/useDebounce';

/**
 * UserManagement — Professional Executive Edition
 * Clean white table UI for managing platform users.
 */
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [error, setError] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const fetchUsers = async () => {
        try {
            setIsRefreshing(true);
            setLoading(true);
            const response = await api.get('/admin/users');
            if (response.data?.success) {
                setUsers(response.data.data);
                setError(null);
            }
        } catch (err) {
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleConfirmDelete = async (userId) => {
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            if (response.data?.success) {
                fetchUsers();
                setConfirmDeleteId(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Delete operation failed.');
        }
    };

    const handleImpersonate = async (userId) => {
        try {
            const response = await api.post(`/admin/impersonate/${userId}`);
            if (response.data?.success) {
                const { token, user } = response.data;

                // Save admin token so browser Back button can restore it
                localStorage.setItem('admin_restore_token', localStorage.getItem('token'));
                localStorage.setItem('admin_restore_user', localStorage.getItem('user'));

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                const redirectPath = user.role === 'recruiter' ? '/provider/dashboard' : '/user/dashboard';
                window.location.href = redirectPath;
            }
        } catch (err) {
            setError('Impersonation failed. Please try again.');
        }
    };

    const filteredUsers = useMemo(() =>
        users.filter(u =>
            u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
        ), [users, debouncedSearch]
    );

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-violet-50 text-violet-700 border-violet-200',
            recruiter: 'bg-blue-50 text-blue-700 border-blue-200',
            job_seeker: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
        return styles[role] || 'bg-gray-50 text-gray-600 border-gray-200';
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            User Management
                        </h1>
                        <p className="text-sm text-[#6b7280] mt-1">
                            Manage and monitor all registered users on the platform
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6b7280] bg-white border border-[#e5e7ef] px-3 py-1.5 rounded-lg">
                        <Users size={14} />
                        <span className="font-medium">{filteredUsers.length} users</span>
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

                {/* Search & Refresh Bar */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e7ef] rounded-xl text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
                            aria-label="Search users"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e7ef] rounded-xl text-sm font-medium text-[#374151] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#e5e7ef] overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#f3f4f8] bg-[#f8f9fc]">
                                {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h, i) => (
                                    <th key={h} className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] ${i === 4 ? 'text-right' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <motion.tbody initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-7 h-7 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                                            <span className="text-sm text-[#9ca3af]">Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <p className="text-sm text-[#6b7280]">No users found matching your search.</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <React.Fragment key={user.id}>
                                    <motion.tr
                                        variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
                                        className="border-b border-[#f3f4f8] hover:bg-[#f8f9fc] transition-colors group"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[11px] font-bold text-[#4F46E5]">
                                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#111827]">{user.name}</p>
                                                    <p className="text-[11px] text-[#9ca3af]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getRoleBadge(user.role)}`}>
                                                {user.role?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${user.is_deleted ? 'text-red-600' : 'text-emerald-600'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.is_deleted ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                {user.is_deleted ? 'Deleted' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[#6b7280]">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.role !== 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleImpersonate(user.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors"
                                                            title="Impersonate user"
                                                        >
                                                            <LogIn size={12} />
                                                            Login As
                                                        </button>
                                                        {!user.is_deleted && (
                                                            <button
                                                                onClick={() => setConfirmDeleteId(user.id)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                                                                title="Delete user"
                                                            >
                                                                <Trash2 size={12} />
                                                                Delete
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>

                                    {/* Inline Delete Confirmation */}
                                    <AnimatePresence>
                                        {confirmDeleteId === user.id && (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-red-50 border-x border-red-100"
                                            >
                                                <td colSpan={5} className="px-5 py-4">
                                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3 text-red-700">
                                                            <AlertTriangle size={16} />
                                                            <div>
                                                                <p className="text-sm font-semibold">Confirm account deactivation</p>
                                                                <p className="text-[11px] text-red-500">{user.name} ({user.email}) will be soft-deleted.</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => setConfirmDeleteId(null)}
                                                                className="px-4 py-2 text-sm font-medium text-[#6b7280] hover:text-[#111827] transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleConfirmDelete(user.id)}
                                                                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                                            >
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

                    {/* Table Footer */}
                    {!loading && (
                        <div className="px-5 py-3 border-t border-[#f3f4f8] flex items-center justify-between">
                            <span className="text-[11px] text-[#9ca3af]">
                                Showing {filteredUsers.length} of {users.length} users
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
