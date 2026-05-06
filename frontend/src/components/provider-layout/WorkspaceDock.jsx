import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Building2,
    Briefcase,
    Users,
    Cpu,
    Video,
    ClipboardList,
    Code2,
    LogOut,
    Search,
    Command,
    ChevronRight,
    Bell,
    X,
    Palette
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DOCK_ITEMS = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/provider/dashboard' },
    { id: 'company', label: 'Company', icon: Building2, path: '/provider/company' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/provider/jobs' },
    { id: 'applicants', label: 'Candidates', icon: Users, path: '/provider/applicants' },
    { id: 'ai-tools', label: 'AI Tools', icon: Cpu, path: '/provider/ai-tools' },
    { id: 'interviews', label: 'Interviews', icon: Video, path: '/provider/interviews' },
    { id: 'tests', label: 'Assessments', icon: ClipboardList, path: '/provider/tests' },
    { id: 'coding-tests', label: 'Coding', icon: Code2, path: '/provider/coding-tests' },
    { id: 'themes', label: 'Themes', icon: Palette, path: '/provider/settings/themes' },
];

const WorkspaceDock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true); // Mock unread state for notification bell

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Extract initials for the avatar
    const getInitials = (name) => {
        if (!name) return 'PR';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 pointer-events-none">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-5 py-2.5 flex items-center gap-1.5 pointer-events-auto"
                    style={{ backgroundColor: 'var(--theme-card-bg, rgba(255,255,255,0.7))', border: '1px solid var(--theme-border, rgba(226,232,240,0.6))' }}
                >
                    <div className="flex items-center gap-1 pr-2 mr-1 border-r" style={{ borderColor: 'var(--theme-border, #f1f5f9)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-[10px] tracking-tighter shadow-sm" style={{ backgroundColor: 'var(--theme-primary, #2563eb)' }}>
                            {getInitials(user?.company_name || user?.name || 'HX')}
                        </div>
                    </div>

                    {DOCK_ITEMS.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`relative px-4 py-2 rounded-full flex items-center gap-2.5 transition-all duration-300 group ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="dock-pill"
                                        className="absolute inset-0 rounded-full -z-10 shadow-[0_4px_16px_rgba(37,99,235,0.15)]"
                                        style={{ backgroundColor: 'var(--theme-bg, #ffffff)', border: '1px solid var(--theme-border, #dbeafe)' }}
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className={`text-[11px] font-black uppercase tracking-wider hidden xl:inline ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    <div className="w-px h-6 bg-slate-200 mx-2" />

                    <div className="pl-2 ml-1 border-l border-slate-100 flex items-center gap-2">
                        <div className="cursor-pointer group relative" title={user?.name || 'Recruiter'}>
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-black text-xs group-hover:bg-slate-200 transition-colors">
                                {getInitials(user?.name)}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Global Search Overlay */}
            {/* Global Search Overlay Removed */}

        </>
    );
};

export default WorkspaceDock;
