import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    LayoutDashboard, User, Search, Globe, Zap,
    ClipboardList, Video, FileText, Code2, X, Menu, LogOut, Palette
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard, color: '#06b6d4' },
    { label: 'Profile', path: '/user/profile', icon: User, color: '#9333ea' },
    { label: 'Job Discovery', path: '/user/jobs', icon: Search, color: '#3b82f6' },
    { label: 'Jobs in India', path: '/user/jobs-india', icon: Globe, color: '#22c55e' },
    { label: 'AI Actions', path: '/user/ai-actions', icon: Zap, color: '#f59e0b' },
    { label: 'Applications', path: '/user/applications', icon: ClipboardList, color: '#ec4899' },
    { label: 'Interviews', path: '/user/interviews', icon: Video, color: '#8b5cf6' },
    { label: 'Tests', path: '/user/tests', icon: FileText, color: '#14b8a6' },
    { label: 'Coding Tests', path: '/user/coding-tests', icon: Code2, color: '#f97316' },
    { label: 'Themes', path: '/user/settings/themes', icon: Palette, color: '#a855f7' },
    { label: 'Log Out', path: '/logout', icon: LogOut, action: 'logout', color: '#ef4444' },
];

/**
 * RadialNav – Floating BOTTOM-LEFT navigation orb.
 * Arc sweeps upward and to the right when open.
 */
const RadialNav = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const shouldReduce = useReducedMotion();

    const handleNav = (item) => {
        if (item.action === 'logout') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } else {
            navigate(item.path);
        }
        setOpen(false);
    };

    // Stack items vertically to prevent overlapping and make them easily accessible
    const getItemPosition = (index, total) => {
        return { x: 0, y: 74 + (total - 1 - index) * 56 };
    };

    return (
        <div className="fixed bottom-6 left-6 z-[200]">
            {/* Backdrop */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Nav item orbs */}
            <AnimatePresence>
                {open && NAV_ITEMS.map((item, i) => {
                    const { x, y } = getItemPosition(i, NAV_ITEMS.length);
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);

                    return (
                        <motion.button
                            key={item.path}
                            className="absolute flex items-center justify-center rounded-full w-11 h-11 bottom-0 left-0 group"
                            style={{
                                background: isActive ? item.color : 'rgba(255,255,255,0.85)',
                                border: `1.5px solid ${isActive ? item.color : 'rgba(148, 163, 184, 0.3)'}`,
                                backdropFilter: 'blur(10px)',
                                boxShadow: isActive ? `0 4px 16px ${item.color}66` : '0 4px 12px rgba(15,23,42,0.08)',
                            }}
                            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                            animate={{ x: x, y: -y, opacity: 1, scale: 1 }}
                            exit={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                            transition={shouldReduce
                                ? { duration: 0 }
                                : { type: 'spring', stiffness: 350, damping: 22, delay: i * 0.04 }
                            }
                            onClick={() => handleNav(item)}
                            title={item.label}
                            aria-label={item.label}
                        >
                            <Icon className="w-4 h-4" style={{ color: isActive ? '#fff' : item.color }} />

                            {/* Tooltip — appears to the right */}
                            <span className="pointer-events-none absolute left-12 whitespace-nowrap bg-indigo-600 px-3 py-1.5 rounded-[10px] text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                                {item.label}
                            </span>
                        </motion.button>
                    );
                })}
            </AnimatePresence>

            {/* Main orb toggle */}
            <motion.button
                onClick={() => setOpen((o) => !o)}
                className="w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden"
                style={{
                    background: open
                        ? 'linear-gradient(135deg, #0891b2, #9333ea)'
                        : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    boxShadow: open
                        ? '0 0 32px rgba(147,51,234,0.5), 0 0 12px rgba(6,182,212,0.3)'
                        : '0 0 24px rgba(6,182,212,0.45)',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                }}
                whileHover={shouldReduce ? {} : { scale: 1.08 }}
                whileTap={shouldReduce ? {} : { scale: 0.94 }}
                animate={shouldReduce ? {} : { rotate: open ? 45 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                aria-label={open ? 'Close navigation' : 'Open navigation'}
            >
                <AnimatePresence mode="wait">
                    {open
                        ? <motion.span key="x" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}><X className="w-5 h-5 text-white" /></motion.span>
                        : <motion.span key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Menu className="w-5 h-5 text-white" /></motion.span>
                    }
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default RadialNav;
