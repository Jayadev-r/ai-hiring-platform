import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Command, X, ChevronRight } from 'lucide-react';

/**
 * AdminCommandMenu — Professional Edition
 * A clean bottom-left navigation launcher.
 */
const AdminCommandMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const triggerRef = useRef(null);

    const commands = {
        '1': { label: 'Dashboard', desc: 'Overview & metrics', path: '/admin/dashboard', icon: LayoutDashboard },
        '2': { label: 'Users', desc: 'Manage platform users', path: '/admin/users', icon: Users },
        '3': { label: 'Jobs', desc: 'Monitor job listings', path: '/admin/jobs', icon: Briefcase },
        '4': { label: 'Applications', desc: 'Track applications', path: '/admin/applications', icon: FileText },
    };

    const executeCommand = (key) => {
        const cmd = commands[key];
        if (!cmd) return;
        navigate(cmd.path);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (isOpen) {
                if (e.key === 'Escape') {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                } else if (commands[e.key]) {
                    e.preventDefault();
                    executeCommand(e.key);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isOpen]);

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(true)}
                aria-label="Open Navigation Menu"
                aria-haspopup="dialog"
                style={{ zIndex: 60 }}
                className="fixed bottom-6 left-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] text-white shadow-lg hover:bg-[#4338ca] transition-all duration-150 text-sm font-semibold"
            >
                <Command size={15} />
                <span>Menu</span>
            </button>

            {/* Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100]"
                            aria-hidden="true"
                        />

                        {/* Menu Window */}
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Admin Navigation Menu"
                            initial={{ opacity: 0, scale: 0.97, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 10 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            className="fixed bottom-20 left-6 w-[300px] bg-white border border-[#e5e7ef] rounded-2xl shadow-xl overflow-hidden z-[101]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7ef]">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-[#4F46E5] flex items-center justify-center">
                                        <Command size={12} className="text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#111827]">Navigation</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f8] transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Navigation Items */}
                            <div className="p-2">
                                {Object.entries(commands).map(([key, cmd]) => {
                                    const IconComp = cmd.icon;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => executeCommand(key)}
                                            className="w-full px-3 py-3 flex items-center gap-3 rounded-xl text-left hover:bg-[#f3f4f8] transition-colors group"
                                            aria-label={`${cmd.label} — ${cmd.desc}`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/8 border border-[#4F46E5]/15 flex items-center justify-center flex-shrink-0">
                                                <IconComp size={15} className="text-[#4F46E5]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#111827] group-hover:text-[#4F46E5] transition-colors leading-tight">
                                                    {cmd.label}
                                                </p>
                                                <p className="text-[11px] text-[#9ca3af] leading-tight mt-0.5">
                                                    {cmd.desc}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <kbd className="text-[9px] font-mono bg-[#f3f4f8] border border-[#e5e7ef] text-[#9ca3af] rounded px-1.5 py-0.5">{key}</kbd>
                                                <ChevronRight size={13} className="text-[#d1d5e0] group-hover:text-[#4F46E5] transition-colors" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-[#f3f4f8]">
                                <p className="text-[10px] text-[#9ca3af] text-center">
                                    Press number keys to navigate quickly
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminCommandMenu;
