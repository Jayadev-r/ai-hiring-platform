import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import {
    LogIn, UserPlus, Briefcase, Users as UsersIcon,
    Brain, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle
} from 'lucide-react';

/* ─────────────────────────────────────────────
   VIBRANT CURSOR GLOW (Matches Landing)
───────────────────────────────────────────── */
function CursorGlow() {
    const [pos, setPos] = useState({ x: -500, y: -500 });
    const springX = useSpring(pos.x, { stiffness: 120, damping: 25 });
    const springY = useSpring(pos.y, { stiffness: 120, damping: 25 });

    useEffect(() => {
        const move = (e) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return (
        <motion.div className="pointer-events-none fixed z-0 inset-0" aria-hidden>
            <motion.div
                className="absolute"
                style={{
                    left: springX,
                    top: springY,
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(56,189,248,0.05) 45%, transparent 70%)',
                    pointerEvents: 'none',
                    mixBlendMode: 'screen'
                }}
            />
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   CINEMATIC VIBRANT BACKGROUND (Matches Landing)
───────────────────────────────────────────── */
function AuthBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-gradient-to-b from-[#f0f4ff] via-[#fdf2f8] to-[#f0fdfa]">
            {/* Dynamic Mesh Background Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #818cf8 1px, transparent 1px),
                        linear-gradient(to bottom, #818cf8 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    perspective: '1000px',
                    transform: 'rotateX(60deg) scale(2.5) translateY(-20%)',
                    transformOrigin: 'top center'
                }}
            />

            {/* Massive Cinematic Light Orbs */}
            <motion.div
                animate={{ 
                    scale: [1, 1.4, 1], 
                    rotate: [0, 90, 0],
                    x: ['-20%', '20%', '-20%'],
                    y: ['-10%', '20%', '-10%']
                }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full opacity-[0.4]"
                style={{
                    background: 'radial-gradient(ellipse at center, #818cf8 0%, #c084fc 40%, transparent 70%)',
                    filter: 'blur(90px)',
                    mixBlendMode: 'multiply'
                }}
            />
            <motion.div
                animate={{ 
                    scale: [1, 1.5, 1], 
                    rotate: [0, -90, 0],
                    x: ['10%', '-30%', '10%'],
                    y: ['20%', '-20%', '20%']
                }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-[-10%] right-[-10%] w-[90%] h-[90%] rounded-full opacity-[0.35]"
                style={{
                    background: 'radial-gradient(ellipse at center, #38bdf8 0%, #34d399 40%, transparent 70%)',
                    filter: 'blur(100px)',
                    mixBlendMode: 'multiply'
                }}
            />
            <motion.div
                animate={{ 
                    scale: [1, 1.2, 1], 
                    x: ['-10%', '40%', '-10%'],
                    y: ['30%', '-30%', '30%']
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[30%] left-[20%] w-[60%] h-[60%] rounded-full opacity-[0.3]"
                style={{
                    background: 'radial-gradient(ellipse at center, #fb7185 0%, #f472b6 50%, transparent 70%)',
                    filter: 'blur(80px)',
                    mixBlendMode: 'multiply'
                }}
            />
        </div>
    );
}

const featurePills = [
    'AI Resume Analysis',
    'Smart Candidate Ranking',
    'Auto-Shortlisting Engine',
    'Intelligent Recommendations',
];

/**
 * Authentication Page — Vibrant Cinematic Light Design
 */
const AuthPage = () => {
    const navigate = useNavigate();
    const { login, register, isAuthenticated, user } = useAuth();

    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', intent: 'job' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated && user) {
        const redirectPath = user.role === 'job_seeker' ? '/user/dashboard' : '/provider/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let userData;
            if (mode === 'register') {
                userData = await register(formData.name, formData.email, formData.password, formData.intent);
            } else {
                userData = await login(formData.email, formData.password);
            }
            let redirectPath = '/user/dashboard';
            if (userData.role === 'recruiter') redirectPath = '/provider/dashboard';
            else if (userData.role === 'admin') redirectPath = '/admin/dashboard';
            navigate(redirectPath, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = (m) => {
        setMode(m);
        setError('');
        setFormData({ name: '', email: '', password: '', intent: 'job' });
    };

    return (
        <div
            className="flex bg-slate-50 text-slate-900 font-sans relative selection:bg-indigo-200 selection:text-indigo-900"
            style={{ height: '100vh', overflow: 'hidden' }}
        >
            <CursorGlow />
            <AuthBg />

            {/* ── LEFT PANEL: Brand Info ── */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col border-r border-white/40 bg-white/40 backdrop-blur-3xl z-10 shadow-[8px_0_40px_rgba(0,0,0,0.02)]">
                <div className="relative z-10 flex flex-col h-full px-12 py-10">
                    {/* Logo */}
                    <Link to="/landing" className="flex items-center gap-3 w-fit group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-black text-2xl text-slate-900 tracking-tight">
                            Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-500">X</span>
                        </span>
                    </Link>

                    {/* Main text — centered vertically */}
                    <div className="flex-1 flex flex-col justify-center max-w-[480px]">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/50 bg-white/60 backdrop-blur-md text-indigo-700 text-xs font-bold mb-6 shadow-sm shadow-indigo-900/5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                AI-Powered Intelligence
                            </div>
                            <h1 className="text-5xl xl:text-[4rem] font-black font-heading text-slate-900 leading-[1.05] mb-6 tracking-tight drop-shadow-sm">
                                Unlock your
                                <br />
                                <span className="relative inline-block mt-3">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500">
                                        opportunity.
                                    </span>
                                    <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 opacity-30 z-0"></span>
                                </span>
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                                Join the ecosystem where AI seamlessly connects world-class talent with innovative companies. Over 10,000 matches made this month.
                            </p>
                        </motion.div>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex flex-wrap gap-3"
                        >
                            {featurePills.map((pill, i) => (
                                <motion.span
                                    key={pill}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08, ease: "easeOut" }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/60 backdrop-blur-md border border-white/50 text-slate-600 shadow-sm shadow-slate-200/50"
                                >
                                    {pill}
                                </motion.span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom tagline */}
                    <div className="flex items-center gap-4 text-slate-400 text-sm font-semibold">
                        <span>© 2026 HireX</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <Link to="/landing" className="hover:text-indigo-600 transition-colors flex items-center gap-1 group">
                            Back to Platform <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL: Auth Form ── */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10 overflow-y-auto">
                <div className="w-full max-w-[440px] py-10">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-slate-900 font-black text-2xl font-heading tracking-tight">
                            Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-500">X</span>
                        </span>
                    </div>

                    {/* Glass card form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
                    >
                        {/* Subtle internal glow */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-50 rounded-full blur-[80px] opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/3" />
                        
                        <div className="relative z-10">
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-slate-900 font-heading tracking-tight mb-2">
                                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium">
                                    {mode === 'login'
                                        ? 'Sign in to access your dashboard'
                                        : 'Join HireX and start hiring intelligently'}
                                </p>
                            </div>

                            {/* Mode Toggle Pills */}
                            <div className="flex bg-slate-100/80 rounded-xl p-1.5 border border-slate-200/60 mb-8 backdrop-blur-sm">
                                {['login', 'register'].map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => toggleMode(m)}
                                        className={`relative flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 capitalize ${
                                            mode === m
                                                ? 'text-indigo-700'
                                                : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {mode === m && (
                                            <motion.div
                                                layoutId="auth-pill-bg"
                                                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50"
                                                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                            />
                                        )}
                                        <span className="relative z-10">{m === 'login' ? 'Sign In' : 'Sign Up'}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Error Alert */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6 overflow-hidden"
                                    >
                                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-start gap-3">
                                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p>{error}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                {/* Name (register only) */}
                                <AnimatePresence initial={false}>
                                    {mode === 'register' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                                Full Name
                                            </label>
                                            <input
                                                name="name"
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required={mode === 'register'}
                                                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                        Email Address
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            Password
                                        </label>
                                        {mode === 'login' && (
                                            <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                                Forgot password?
                                            </a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 pr-12 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Intent (register only) */}
                                <AnimatePresence initial={false}>
                                    {mode === 'register' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden pt-2"
                                        >
                                            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">
                                                I am joining as
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Job Seeker */}
                                                <label className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                                    formData.intent === 'job'
                                                        ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-lg shadow-indigo-500/10'
                                                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                                }`}>
                                                    <input type="radio" name="intent" value="job" checked={formData.intent === 'job'} onChange={handleChange} className="sr-only" />
                                                    <div className={`p-2 rounded-xl transition-colors ${formData.intent === 'job' ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                                        <Briefcase className={`w-5 h-5 ${formData.intent === 'job' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                    </div>
                                                    <span className="text-sm font-black">Job Seeker</span>
                                                    {formData.intent === 'job' && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                        </motion.div>
                                                    )}
                                                </label>

                                                {/* Recruiter */}
                                                <label className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                                    formData.intent === 'employee'
                                                        ? 'border-fuchsia-500 bg-fuchsia-50/50 text-fuchsia-700 shadow-lg shadow-fuchsia-500/10'
                                                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                                }`}>
                                                    <input type="radio" name="intent" value="employee" checked={formData.intent === 'employee'} onChange={handleChange} className="sr-only" />
                                                    <div className={`p-2 rounded-xl transition-colors ${formData.intent === 'employee' ? 'bg-fuchsia-100' : 'bg-slate-100'}`}>
                                                        <UsersIcon className={`w-5 h-5 ${formData.intent === 'employee' ? 'text-fuchsia-600' : 'text-slate-400'}`} />
                                                    </div>
                                                    <span className="text-sm font-black">Recruiter</span>
                                                    {formData.intent === 'employee' && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-fuchsia-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                        </motion.div>
                                                    )}
                                                </label>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(99,102,241,0.5)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white font-bold text-base shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                    {loading
                                        ? (mode === 'login' ? 'Signing In...' : 'Creating Account...')
                                        : (mode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account')}
                                </motion.button>

                                {/* Divider */}
                                <div className="relative my-6 pt-2">
                                    <div className="absolute inset-0 flex items-center pt-2">
                                        <div className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">Or continue with</span>
                                    </div>
                                </div>

                                {/* Google OAuth */}
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 text-sm font-bold shadow-sm hover:border-slate-300 transition-all duration-300"
                                    onClick={() => {
                                        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000';
                                        window.location.href = `${baseUrl}/api/auth/google`;
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
