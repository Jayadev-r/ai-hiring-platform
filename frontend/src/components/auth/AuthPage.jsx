import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import {
    LogIn, UserPlus, Briefcase, Users as UsersIcon,
    Brain, Eye, EyeOff, Sparkles, ArrowRight
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CURSOR GLOW EFFECT (Matches Landing)
───────────────────────────────────────────── */
function CursorGlow() {
    const [pos, setPos] = useState({ x: -500, y: -500 });
    const springX = useSpring(pos.x, { stiffness: 120, damping: 22 });
    const springY = useSpring(pos.y, { stiffness: 120, damping: 22 });

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
                    width: 520,
                    height: 520,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, rgba(99,102,241,0.03) 45%, transparent 70%)',
                }}
            />
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   ANIMATED SVG BACKGROUND GRID (Matches Landing)
───────────────────────────────────────────── */
function AuthBg() {
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
    useEffect(() => {
        const move = (e) => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    const dx = (mouse.x - 0.5) * 28;
    const dy = (mouse.y - 0.5) * 28;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #c7d2fe 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                    transform: `translate(${dx * 0.2}px, ${dy * 0.2}px)`,
                    transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
            />
            {/* Gradient blobs */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full opacity-40 mix-blend-multiply"
                style={{
                    background: 'radial-gradient(ellipse at center, #e0e7ff 0%, transparent 60%)',
                    transform: `translate(${dx * 0.4}px, ${dy * 0.4}px)`,
                    transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
                    filter: 'blur(60px)',
                }}
            />
            <div
                className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full opacity-30 mix-blend-multiply"
                style={{
                    background: 'radial-gradient(ellipse at center, #ddd6fe 0%, transparent 60%)',
                    transform: `translate(${-dx * 0.3}px, ${-dy * 0.3}px)`,
                    transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
                    filter: 'blur(60px)',
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
 * Authentication Page — Light Premium Design
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
            className="landing-light flex bg-neutral-50 text-neutral-900 font-sans relative"
            style={{ height: '100vh', overflow: 'hidden' }}
        >
            <CursorGlow />
            <AuthBg />

            {/* ── LEFT PANEL: Brand Info ── */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col border-r border-neutral-200/60 bg-white/40 backdrop-blur-xl z-10">
                <div className="relative z-10 flex flex-col h-full px-12 py-10">
                    {/* Logo */}
                    <Link to="/landing" className="flex items-center gap-2 w-fit group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight font-heading text-neutral-900">
                            Hire<span className="text-primary-600">X</span>
                        </span>
                    </Link>

                    {/* Main text — centered vertically */}
                    <div className="flex-1 flex flex-col justify-center max-w-md">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-primary-700 text-xs font-semibold mb-5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                                AI-Powered Intelligence
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold font-heading text-neutral-900 leading-[1.15] mb-5 tracking-tight">
                                Unlock your next{' '}
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
                                        opportunity.
                                    </span>
                                </span>
                            </h1>
                            <p className="text-neutral-500 text-base leading-relaxed mb-8">
                                Join the ecosystem where AI seamlessly connects world-class talent with innovative companies. Over 10,000 matches made this month.
                            </p>
                        </motion.div>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex flex-wrap gap-2.5"
                        >
                            {featurePills.map((pill, i) => (
                                <motion.span
                                    key={pill}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08, ease: "easeOut" }}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-600 shadow-sm"
                                >
                                    {pill}
                                </motion.span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom tagline */}
                    <div className="flex items-center gap-4 text-neutral-400 text-sm font-medium">
                        <span>© 2026 HireX</span>
                        <div className="w-1 h-1 rounded-full bg-neutral-300" />
                        <Link to="/landing" className="hover:text-neutral-600 transition-colors flex items-center gap-1">
                            Back to Platform <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL: Auth Form ── */}
            <div className="flex-1 flex items-center justify-center p-5 relative z-10">
                <div className="w-full max-w-[420px]">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-5 lg:hidden justify-center">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-neutral-900 font-bold text-xl font-heading tracking-tight">
                            Hire<span className="text-primary-600">X</span>
                        </span>
                    </div>

                    {/* Glass card form */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="bg-white/80 backdrop-blur-2xl border border-neutral-200 rounded-3xl p-7 shadow-xl shadow-neutral-200/50"
                    >
                        {/* Header */}
                        <div className="mb-5">
                            <h2 className="text-2xl font-bold text-neutral-900 font-heading tracking-tight mb-1">
                                {mode === 'login' ? 'Welcome back' : 'Create account'}
                            </h2>
                            <p className="text-neutral-500 text-sm">
                                {mode === 'login'
                                    ? 'Sign in to access your dashboard'
                                    : 'Join HireX and start hiring intelligently'}
                            </p>
                        </div>

                        {/* Mode Toggle Pills */}
                        <div className="flex bg-neutral-100/80 rounded-xl p-1 border border-neutral-200/60 mb-5">
                            {['login', 'register'].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => toggleMode(m)}
                                    className={`relative flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 capitalize ${
                                        mode === m
                                            ? 'text-primary-700'
                                            : 'text-neutral-500 hover:text-neutral-700'
                                    }`}
                                >
                                    {mode === m && (
                                        <motion.div
                                            layoutId="auth-pill-bg"
                                            className="absolute inset-0 bg-white rounded-lg border border-neutral-200/80 shadow-sm"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
                                    className="mb-4 overflow-hidden"
                                >
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-start gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p>{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
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
                                        <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                                            Full Name
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required={mode === 'register'}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                        Password
                                    </label>
                                    {mode === 'login' && (
                                        <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
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
                                        className="w-full px-4 py-2.5 pr-12 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                                        className="overflow-hidden pt-1"
                                    >
                                        <label className="block text-xs font-semibold text-neutral-600 mb-2 uppercase tracking-wide">
                                            I am joining as
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Job Seeker */}
                                            <label className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                formData.intent === 'job'
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-500/10'
                                                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                                            }`}>
                                                <input type="radio" name="intent" value="job" checked={formData.intent === 'job'} onChange={handleChange} className="sr-only" />
                                                <div className={`p-1.5 rounded-lg ${formData.intent === 'job' ? 'bg-primary-100' : 'bg-neutral-100'}`}>
                                                    <Briefcase className={`w-4 h-4 ${formData.intent === 'job' ? 'text-primary-600' : 'text-neutral-400'}`} />
                                                </div>
                                                <span className="text-xs font-bold">Job Seeker</span>
                                                {formData.intent === 'job' && (
                                                    <div className="absolute top-1.5 right-1.5 text-primary-500">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </label>

                                            {/* Recruiter */}
                                            <label className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                formData.intent === 'employee'
                                                    ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-md shadow-violet-500/10'
                                                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                                            }`}>
                                                <input type="radio" name="intent" value="employee" checked={formData.intent === 'employee'} onChange={handleChange} className="sr-only" />
                                                <div className={`p-1.5 rounded-lg ${formData.intent === 'employee' ? 'bg-violet-100' : 'bg-neutral-100'}`}>
                                                    <UsersIcon className={`w-4 h-4 ${formData.intent === 'employee' ? 'text-violet-600' : 'text-neutral-400'}`} />
                                                </div>
                                                <span className="text-xs font-bold">Recruiter</span>
                                                {formData.intent === 'employee' && (
                                                    <div className="absolute top-1.5 right-1.5 text-violet-500">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
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
                                whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(99, 102, 241, 0.25)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 text-white font-bold text-sm shadow-xl shadow-primary-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                {loading
                                    ? (mode === 'login' ? 'Signing In...' : 'Creating Account...')
                                    : (mode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account')}
                            </motion.button>

                            {/* Divider */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-200" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-4 bg-white/80 text-neutral-400 font-medium">Or continue with</span>
                                </div>
                            </div>

                            {/* Google OAuth — fixed icon size */}
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 text-sm font-semibold shadow-sm hover:border-neutral-300 transition-all duration-200"
                                onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    style={{ width: '18px', height: '18px', flexShrink: 0 }}
                                >
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </motion.button>
                        </form>

                        {/* Mobile back link */}
                        <div className="mt-5 pt-4 border-t border-neutral-100 text-center lg:hidden">
                            <Link to="/landing" className="text-sm text-neutral-500 hover:text-neutral-700 font-medium transition-colors">
                                ← Back to platform
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
