import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import {
    Brain, Zap, Target, Users, FileText, Search,
    Shield, BarChart3, Sparkles, ChevronRight,
    ArrowRight, CheckCircle, Star, Cpu, Network,
    GitBranch, ScanLine, TrendingUp, Layers, Bot, Briefcase
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CURSOR GLOW EFFECT
   A soft radial spotlight that follows the mouse
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
        <motion.div
            className="pointer-events-none fixed z-0 inset-0"
            aria-hidden
        >
            <motion.div
                className="absolute"
                style={{
                    left: springX,
                    top: springY,
                    transform: 'translate(-50%, -50%)',
                    width: 520,
                    height: 520,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.09) 0%, rgba(99,102,241,0.04) 45%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   ANIMATED SVG BACKGROUND GRID
   Decorative dot-grid that reacts to cursor
───────────────────────────────────────────── */
function HeroBg() {
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
    useEffect(() => {
        const move = (e) => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    const dx = (mouse.x - 0.5) * 28;
    const dy = (mouse.y - 0.5) * 28;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #c7d2fe 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                    transform: `translate(${dx * 0.2}px, ${dy * 0.2}px)`,
                    transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
            />
            {/* Gradient mesh blobs — parallax */}
            <div
                className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] rounded-full opacity-30"
                style={{
                    background: 'radial-gradient(ellipse at center, #e0e7ff 0%, transparent 70%)',
                    transform: `translate(${dx * 0.5}px, ${dy * 0.5}px)`,
                    transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
                    filter: 'blur(48px)',
                }}
            />
            <div
                className="absolute bottom-0 right-0 w-[60%] h-[50%] rounded-full opacity-25"
                style={{
                    background: 'radial-gradient(ellipse at center, #ddd6fe 0%, transparent 70%)',
                    transform: `translate(${-dx * 0.4}px, ${-dy * 0.4}px)`,
                    transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
                    filter: 'blur(60px)',
                }}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────
   SCROLL-REVEAL WRAPPER
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 48 : direction === 'down' ? -48 : 0,
            x: direction === 'left' ? 48 : direction === 'right' ? -48 : 0,
            scale: direction === 'scale' ? 0.93 : 1,
        },
        visible: { opacity: 1, y: 0, x: 0, scale: 1 },
    };
    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   HIGHLIGHT UNDERLINE SPAN
───────────────────────────────────────────── */
function Highlight({ children, color = 'primary' }) {
    const colors = {
        primary: 'from-primary-500 to-primary-400',
        violet: 'from-violet-500 to-purple-400',
        cyan: 'from-cyan-500 to-blue-400',
    };
    return (
        <span className="relative inline-block">
            {children}
            <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r ${colors[color]} origin-left`}
            />
        </span>
    );
}

/* ─────────────────────────────────────────────
   3-D TILT CARD
───────────────────────────────────────────── */
function TiltCard({ children, className = '' }) {
    const ref = useRef(null);
    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        ref.current.style.transform = `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(6px)`;
    };
    const handleMouseLeave = () => {
        if (!ref.current) return;
        ref.current.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };
    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-200 ease-out ${className}`}
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const workflowSteps = [
    { num: '01', icon: FileText, title: 'Upload Resume', desc: 'Candidate uploads their resume with zero friction — any format.' },
    { num: '02', icon: Brain, title: 'AI Analyzes Skills', desc: 'Deep NLP parsing extracts true skills and hidden potential.' },
    { num: '03', icon: Target, title: 'Job Evaluation', desc: 'AI evaluates thousands of job descriptions in real time.' },
    { num: '04', icon: BarChart3, title: 'Smart Ranking', desc: 'Candidates ranked by multi-dimensional match score.' },
    { num: '05', icon: Users, title: 'Perfect Match', desc: 'Recruiters discover pre-ranked, verified top candidates.' },
];

const intelligenceFeatures = [
    { icon: ScanLine, title: 'AI Resume Analysis', desc: 'Deep semantic parsing extracts skills and experience beyond surface keywords.', accent: 'bg-primary-50 text-primary-600', border: 'hover:border-primary-200' },
    { icon: BarChart3, title: 'Smart Candidate Ranking', desc: 'Proprietary scoring algorithms rank candidates by multi-dimensional fit scores.', accent: 'bg-violet-50 text-violet-600', border: 'hover:border-violet-200' },
    { icon: GitBranch, title: 'Automated Skill Matching', desc: 'Graph-based skill matching identifies lateral skills across roles.', accent: 'bg-cyan-50 text-cyan-600', border: 'hover:border-cyan-200' },
    { icon: Search, title: 'AI Talent Discovery', desc: 'Proactively surface passive candidates who match your requirements.', accent: 'bg-rose-50 text-rose-600', border: 'hover:border-rose-200' },
    { icon: Sparkles, title: 'Intelligent Recommendations', desc: 'Continuously learns from hiring decisions to improve over time.', accent: 'bg-amber-50 text-amber-600', border: 'hover:border-amber-200' },
];

const seekerFeatures = ['AI-matched job opportunities', 'Smart resume optimization', 'Auto-apply agent', 'Real-time match scores'];
const providerFeatures = ['Intelligent candidate ranking', 'Fraud & anomaly detection', 'Auto-shortlisting engine', 'Hiring pipeline analytics'];

const capabilities = [
    { icon: Cpu, title: 'Intelligent Resume Parsing', desc: 'NLP-powered parsing from any resume format.' },
    { icon: Brain, title: 'AI Skill Extraction', desc: 'Identifies implicit skills beyond surface-level keywords.' },
    { icon: Network, title: 'Smart Job Matching', desc: 'Vector semantics match candidates to job descriptions.' },
    { icon: Zap, title: 'Real-time Discovery', desc: 'Live ranking updates as new data enters the system.' },
    { icon: Shield, title: 'Automated Intelligence', desc: 'Autonomous workflows reduce manual screening by 10×.' },
    { icon: TrendingUp, title: 'Predictive Analytics', desc: 'Forecast hiring success before making any offer.' },
    { icon: Bot, title: 'Auto-Apply Agent', desc: 'AI agent applies to matching roles on behalf of candidates.' },
    { icon: Star, title: 'Continuous Learning', desc: 'Models retrain on your data to improve with every hire.' },
];

const stats = [
    { value: '10×', label: 'Faster Hiring', color: 'text-primary-600' },
    { value: '95%', label: 'Match Accuracy', color: 'text-violet-600' },
    { value: '< 2s', label: 'AI Analysis Time', color: 'text-cyan-600' },
    { value: '100%', label: 'Automated', color: 'text-primary-600' },
];

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function LandingNav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);
    return (
        <motion.nav
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-neutral-200/70 shadow-sm'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-md shadow-primary-500/20">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-heading font-bold text-lg text-neutral-900 tracking-tight">
                        Hire<span className="text-primary-600">X</span>
                    </span>
                </div>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-500">
                    {[['#workflow', 'How It Works'], ['#intelligence', 'Intelligence'], ['#ecosystem', 'Portals'], ['#capabilities', 'Capabilities']].map(([href, label]) => (
                        <a key={href} href={href} className="relative group hover:text-neutral-900 transition-colors">
                            {label}
                            <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <Link to="/login">
                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(79,70,229,0.22)' }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-primary-500/20 transition-all"
                    >
                        Login <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                </Link>
            </div>
        </motion.nav>
    );
}

/* ─────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────── */
const Landing = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div className="landing-light min-h-screen bg-white text-neutral-900 overflow-x-hidden">
            {/* Global cursor glow */}
            <CursorGlow />
            <LandingNav />

            {/* ── HERO ── */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                <HeroBg />
                {/* Top-edge gradient decoration */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />

                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-primary-700 text-sm font-semibold mb-8 shadow-sm"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                        AI-Powered Hiring Intelligence Platform
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        className="text-6xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight leading-[1.06] text-neutral-900 mb-7"
                    >
                        The Future of{' '}
                        <span className="relative">
                            <span className="bg-gradient-to-r from-primary-600 via-violet-600 to-primary-500 bg-clip-text text-transparent">
                                Intelligent Hiring
                            </span>
                            {/* Animated underline */}
                            <motion.span
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary-400 to-violet-400 origin-left"
                            />
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.48, duration: 0.65 }}
                        className="text-xl text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        An intelligent hiring platform that deeply analyzes resumes, understands job requirements, and connects the right talent with the right opportunity — automatically.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.06, boxShadow: '0 16px 48px rgba(79,70,229,0.28)' }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-violet-600 text-white font-semibold text-base shadow-xl shadow-primary-500/20 transition-all"
                            >
                                Login to Platform <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                        <motion.a
                            href="#workflow"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-neutral-200 bg-white text-neutral-700 font-semibold text-base hover:border-primary-300 hover:text-primary-700 transition-all shadow-sm"
                        >
                            Explore Platform <ChevronRight className="w-4 h-4" />
                        </motion.a>
                    </motion.div>

                    {/* Scroll hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-20 flex flex-col items-center gap-2"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-6 h-9 rounded-full border-2 border-neutral-300 flex items-start justify-center pt-1.5"
                        >
                            <div className="w-1 h-2 rounded-full bg-neutral-400" />
                        </motion.div>
                        <span className="text-xs text-neutral-400 font-medium">Scroll to explore</span>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── STATS TICKER ── */}
            <section className="py-12 border-y border-neutral-100 bg-white relative z-10">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((s, i) => (
                            <Reveal key={s.label} delay={i * 0.08} direction="scale">
                                <div className="text-center">
                                    <div className={`text-4xl md:text-5xl font-bold font-heading mb-1 ${s.color}`}>{s.value}</div>
                                    <div className="text-sm text-neutral-500 font-medium">{s.label}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PLATFORM WORKFLOW ── */}
            <section id="workflow" className="py-28 bg-neutral-50 relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #e0e7ff 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        opacity: 0.4,
                    }}
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <Reveal className="text-center mb-20">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-4 border border-primary-200">
                            Platform Intelligence
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-neutral-900 mb-4">
                            How the <Highlight>AI Works</Highlight>
                        </h2>
                        <p className="text-neutral-500 text-lg max-w-xl mx-auto">
                            Five intelligent steps that turn raw resumes into perfect hires.
                        </p>
                    </Reveal>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {/* Connecting line (desktop) */}
                        <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-200 via-violet-200 to-primary-200" />

                        {workflowSteps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <Reveal key={step.num} delay={i * 0.1} direction="up">
                                    <motion.div
                                        whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(79,70,229,0.12)' }}
                                        className="relative flex flex-col items-center text-center bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm cursor-default transition-all duration-300 hover:border-primary-200"
                                    >
                                        {/* Step number badge */}
                                        <div className="absolute -top-3 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-primary-500/20">
                                            {i + 1}
                                        </div>
                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                                            <Icon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <h3 className="font-semibold text-neutral-800 text-sm mb-2">{step.title}</h3>
                                        <p className="text-neutral-400 text-xs leading-relaxed">{step.desc}</p>
                                    </motion.div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── AI INTELLIGENCE CARDS ── */}
            <section id="intelligence" className="py-28 bg-white relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <Reveal className="text-center mb-20">
                        <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-4 border border-violet-200">
                            AI Capabilities
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-neutral-900 mb-4">
                            Built on <Highlight color="violet">Deep Intelligence</Highlight>
                        </h2>
                        <p className="text-neutral-500 text-lg max-w-xl mx-auto">
                            Every feature powered by state-of-the-art AI designed for hiring.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {intelligenceFeatures.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <Reveal key={f.title} delay={i * 0.07}>
                                    <TiltCard>
                                        <div className={`group h-full p-7 rounded-2xl bg-white border border-neutral-200 ${f.border} hover:shadow-xl hover:shadow-neutral-200/60 transition-all duration-300 cursor-default`}>
                                            <div className={`w-11 h-11 rounded-xl ${f.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-semibold text-neutral-900 text-base mb-2">{f.title}</h3>
                                            <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
                                        </div>
                                    </TiltCard>
                                </Reveal>
                            );
                        })}

                        {/* CTA card */}
                        <Reveal delay={0.35}>
                            <Link to="/login" className="block h-full">
                                <motion.div
                                    whileHover={{ scale: 1.02, boxShadow: '0 20px 48px rgba(79,70,229,0.15)' }}
                                    className="h-full min-h-[180px] p-7 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 border-0 flex flex-col justify-between cursor-pointer transition-all duration-300"
                                >
                                    <div>
                                        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-5">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base mb-2">Experience the Platform</h3>
                                        <p className="text-white/70 text-sm">Login and start hiring smarter today.</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-white text-sm font-medium mt-4">
                                        Get Started <ArrowRight className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── PORTAL ECOSYSTEM ── */}
            <section id="ecosystem" className="py-28 bg-neutral-50 relative overflow-hidden">
                {/* Animated background stripe */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-64 opacity-5"
                        style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }}
                    />
                </div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <Reveal className="text-center mb-20">
                        <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold mb-4 border border-cyan-200">
                            Two Portals, One Platform
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-neutral-900 mb-4">
                            Built for <Highlight color="cyan">Everyone</Highlight>
                        </h2>
                        <p className="text-neutral-500 text-lg max-w-xl mx-auto">
                            Tailored experiences for both sides of the hiring equation.
                        </p>
                    </Reveal>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Job Seeker */}
                        <Reveal delay={0} direction="left">
                            <TiltCard>
                                <div className="group relative overflow-hidden rounded-3xl p-8 md:p-10 bg-white border border-neutral-200 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-100/60 transition-all duration-400 min-h-[380px]">
                                    {/* BG accent */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                                    <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-primary-50/50 -translate-y-8 translate-x-8 group-hover:-translate-y-4 group-hover:translate-x-4 transition-transform duration-500" />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                                            <Briefcase className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-4">For Job Seekers</span>
                                        <h3 className="text-2xl font-bold font-heading text-neutral-900 mb-3">Find Your Dream Role</h3>
                                        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
                                            Let our AI discover, match, and even apply to roles that fit your profile perfectly.
                                        </p>
                                        <ul className="space-y-2.5 mb-8">
                                            {seekerFeatures.map(f => (
                                                <li key={f} className="flex items-center gap-2.5 text-neutral-600 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to="/login">
                                            <motion.button
                                                whileHover={{ scale: 1.04, boxShadow: '0 10px 32px rgba(37,99,235,0.25)' }}
                                                whileTap={{ scale: 0.97 }}
                                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold shadow-md transition-all"
                                            >
                                                Start Job Hunting <ArrowRight className="w-4 h-4" />
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </TiltCard>
                        </Reveal>

                        {/* Job Provider */}
                        <Reveal delay={0.12} direction="right">
                            <TiltCard>
                                <div className="group relative overflow-hidden rounded-3xl p-8 md:p-10 bg-white border border-neutral-200 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-100/60 transition-all duration-400 min-h-[380px]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                                    <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-violet-50/50 -translate-y-8 translate-x-8 group-hover:-translate-y-4 group-hover:translate-x-4 transition-transform duration-500" />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                                            <Cpu className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-4">For Recruiters</span>
                                        <h3 className="text-2xl font-bold font-heading text-neutral-900 mb-3">Hire with Intelligence</h3>
                                        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
                                            Post jobs, AI ranks applicants, auto-shortlist top candidates, fill roles faster than ever.
                                        </p>
                                        <ul className="space-y-2.5 mb-8">
                                            {providerFeatures.map(f => (
                                                <li key={f} className="flex items-center gap-2.5 text-neutral-600 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to="/login">
                                            <motion.button
                                                whileHover={{ scale: 1.04, boxShadow: '0 10px 32px rgba(124,58,237,0.25)' }}
                                                whileTap={{ scale: 0.97 }}
                                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold shadow-md transition-all"
                                            >
                                                Start Hiring <ArrowRight className="w-4 h-4" />
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </TiltCard>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── PLATFORM CAPABILITIES ── */}
            <section id="capabilities" className="py-28 bg-white relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <Reveal className="text-center mb-20">
                        <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold mb-4 border border-neutral-200">Full Platform</span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-neutral-900 mb-4">
                            Every Capability <Highlight>You Need</Highlight>
                        </h2>
                        <p className="text-neutral-500 text-lg max-w-xl mx-auto">
                            A complete AI-driven hiring stack, end-to-end.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {capabilities.map((cap, i) => {
                            const Icon = cap.icon;
                            return (
                                <Reveal key={cap.title} delay={i * 0.05}>
                                    <motion.div
                                        whileHover={{ y: -5, borderColor: '#a5b4fc', boxShadow: '0 10px 30px rgba(99,102,241,0.10)' }}
                                        className="group p-5 rounded-2xl bg-neutral-50 border border-neutral-200 transition-all duration-300 cursor-default"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-100 group-hover:border-primary-200 transition-colors">
                                            <Icon className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <h3 className="text-neutral-900 text-sm font-semibold mb-1.5">{cap.title}</h3>
                                        <p className="text-neutral-400 text-xs leading-relaxed">{cap.desc}</p>
                                    </motion.div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="py-28 relative overflow-hidden bg-neutral-50">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                {/* Big soft gradient blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-[-40%] left-[-20%] w-[70%] h-[140%] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(ellipse, #c7d2fe, transparent 65%)', filter: 'blur(40px)' }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.06, 1], rotate: [0, -5, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute bottom-[-40%] right-[-20%] w-[70%] h-[140%] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(ellipse, #ddd6fe, transparent 65%)', filter: 'blur(40px)' }}
                    />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <Reveal>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-6 border border-primary-200">
                            <Star className="w-3 h-3 inline mr-1" />
                            Ready to Transform Hiring?
                        </span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-neutral-900 mb-6 tracking-tight leading-tight">
                            Experience{' '}
                            <span className="bg-gradient-to-r from-primary-600 via-violet-600 to-primary-500 bg-clip-text text-transparent">
                                Intelligent Hiring
                            </span>
                        </h2>
                        <p className="text-neutral-500 text-lg mb-12 max-w-xl mx-auto">
                            Step into the next generation of hiring — fast, intelligent, and built for the future.
                        </p>
                        <Link to="/login">
                            <motion.button
                                whileHover={{
                                    scale: 1.07,
                                    boxShadow: '0 20px 60px rgba(79, 70, 229, 0.30)',
                                }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-primary-600 to-violet-600 text-white font-bold text-lg shadow-xl shadow-primary-500/25 transition-all group"
                            >
                                Login to Platform
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-neutral-200 bg-white py-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-sm">
                            <Brain className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-neutral-900">Hire<span className="text-primary-600">X</span></span>
                        <span className="text-neutral-300 text-sm ml-3">AI-Powered Hiring Intelligence</span>
                    </div>
                    <nav className="flex items-center gap-6 text-sm text-neutral-400">
                        {[['#workflow', 'How It Works'], ['#intelligence', 'Intelligence'], ['#ecosystem', 'Portals'], ['/login', 'Login']].map(([href, label]) => (
                            href.startsWith('#')
                                ? <a key={href} href={href} className="hover:text-neutral-700 transition-colors">{label}</a>
                                : <Link key={href} to={href} className="hover:text-neutral-700 transition-colors">{label}</Link>
                        ))}
                    </nav>
                    <p className="text-neutral-300 text-xs">© 2026 HireX. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
