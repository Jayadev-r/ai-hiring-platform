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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/provider/dashboard' },
    { id: 'company', label: 'Identity', icon: Building2, path: '/provider/company' },
    { id: 'jobs', label: 'Pipeline', icon: Briefcase, path: '/provider/jobs' },
    { id: 'applicants', label: 'Applicants', icon: Users, path: '/provider/applicants' },
    { id: 'ai-tools', label: 'AI Suite', icon: Cpu, path: '/provider/ai-tools' },
    { id: 'interviews', label: 'Interviews', icon: Video, path: '/provider/interviews' },
    { id: 'tests', label: 'Assessments', icon: ClipboardList, path: '/provider/tests' },
    { id: 'coding-tests', label: 'Arena', icon: Code2, path: '/provider/coding-tests' },
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

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all group relative"
                        title="Search (Ctrl+K)"
                    >
                        <Search className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => setHasUnread(false)}
                        className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all relative"
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        {hasUnread && (
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse border border-white" />
                        )}
                    </button>

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
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
                        >
                            <div className="p-6 flex items-center gap-4 border-b border-slate-100">
                                <Search className="w-6 h-6 text-blue-600" />
                                <input
                                    autoFocus
                                    placeholder="Search positions, candidates, or protocols..."
                                    className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-900 placeholder:text-slate-300"
                                />
                                <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase border border-slate-200">
                                    <Command className="w-3 h-3" /> K
                                </div>
                                <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 bg-slate-50 min-h-[300px]">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Recent Protocols</p>
                                <div className="space-y-1">
                                    {[
                                        { icon: Briefcase, text: 'Frontend Engineer (Global)', type: 'Position' },
                                        { icon: Briefcase, text: 'Senior Backend Architect', type: 'Position' },
                                        { icon: Users, text: 'Jayesh Patel', type: 'Candidate' },
                                        { icon: LayoutDashboard, text: 'Analytics Overview', type: 'Dashboard' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 hover:shadow-sm transition-all cursor-pointer group border border-transparent hover:border-blue-100">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:border-blue-200 group-hover:text-blue-600 shadow-sm transition-colors">
                                                    <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 block">{item.text}</span>
                                                    <span className="text-[10px] font-medium text-slate-400">{item.type}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest hidden sm:block">Jump To</span>
                                                <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="px-6 py-3 bg-white border-t border-slate-100 text-[10px] font-bold text-slate-400 flex items-center justify-end gap-4 uppercase tracking-widest">
                                <span className="flex items-center gap-1">Use <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded">↑</span><span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded">↓</span> to navigate</span>
                                <span className="flex items-center gap-1">Use <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded">Enter</span> to select</span>
                                <span className="flex items-center gap-1">Use <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded">Esc</span> to close</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default WorkspaceDock;
