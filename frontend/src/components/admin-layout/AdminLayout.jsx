import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import AdminCommandMenu from './AdminCommandMenu';
import '../../assets/admin.css';
import { LogOut, Clock, Shield } from 'lucide-react';

/**
 * AdminLayout — Professional Executive Edition
 * Clean white, structured sidebar + top-nav layout.
 */
const AdminLayout = ({ children }) => {
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        document.body.classList.add('admin-portal');

        // Restore admin session if the user pressed Back from an impersonated session
        const restoreToken = localStorage.getItem('admin_restore_token');
        const restoreUser = localStorage.getItem('admin_restore_user');
        if (restoreToken && restoreUser) {
            try {
                const restoredUser = JSON.parse(restoreUser);
                if (restoredUser?.role === 'admin') {
                    localStorage.setItem('token', restoreToken);
                    localStorage.setItem('user', restoreUser);
                    localStorage.removeItem('admin_restore_token');
                    localStorage.removeItem('admin_restore_user');
                    // Reload to re-initialise AuthContext with admin credentials
                    window.location.replace('/admin/dashboard');
                    return;
                }
            } catch (_) { }
        }

        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => {
            document.body.classList.remove('admin-portal');
            clearInterval(intervalId);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 shadow-sm border-b">
                {/* Brand / Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600">
                        <Shield size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-[#111827] text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            HireX
                        </span>
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-[#4F46E5] bg-[#4F46E5]/8 px-2 py-0.5 rounded-full border border-[#4F46E5]/20">
                            Admin
                        </span>
                    </div>
                </div>

                {/* Center status */}
                <div className="hidden md:flex items-center gap-2 text-sm text-[#6b7280]">
                    <span className="admin-status-dot"></span>
                    <span className="text-xs font-medium text-[#6b7280]">System Online</span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Time */}
                    <div className="hidden md:flex items-center gap-1.5 text-[#9ca3af] text-xs font-medium">
                        <Clock size={13} />
                        <span>{currentTime}</span>
                    </div>

                    {/* User info */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#4F46E5]/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-[#4F46E5]">
                                {user?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-semibold text-[#111827] leading-tight">
                                {user?.name || 'Admin'}
                            </p>
                            <p className="text-[10px] text-[#9ca3af] leading-tight">
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-[#e5e7ef]"></div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#6b7280] hover:text-[#ef4444] hover:bg-[#ef4444]/5 transition-all duration-150 text-sm font-medium border border-transparent hover:border-[#ef4444]/20"
                        title="Sign Out"
                    >
                        <LogOut size={15} />
                        <span className="hidden md:inline text-xs">Sign Out</span>
                    </button>
                </div>
            </header>

            {/* Command Menu */}
            <AdminCommandMenu />

            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="pt-16 min-h-screen"
            >
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {children}
                </div>
            </motion.main>
        </div>
    );
};

export default AdminLayout;
