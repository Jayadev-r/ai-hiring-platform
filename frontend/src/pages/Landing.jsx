import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import {
    Brain, Zap, Target, Users, FileText, Search,
    Shield, BarChart3, Sparkles, ChevronRight,
    ArrowRight, CheckCircle, Star, Cpu, Network,
    GitBranch, ScanLine, TrendingUp, Bot, Briefcase
} from 'lucide-react';

/* ─────────────────────────────────────────────
   VIBRANT CURSOR GLOW
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
   CINEMATIC VIBRANT BACKGROUND (LIGHT THEME)
───────────────────────────────────────────── */
function HeroBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-gradient-to-b from-[#f0f4ff] via-[#fdf2f8] to-[#f0fdfa]">
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

/* ─────────────────────────────────────────────
   SCROLL-REVEAL WRAPPER (MORE DRAMATIC)
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, direction = 'up', className = '', scale = false }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
            x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
            scale: scale ? 0.85 : 1,
            rotateX: scale ? 10 : 0
        },
        visible: { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0 },
    };
    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
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
    { icon: ScanLine, title: 'AI Resume Analysis', desc: 'Deep semantic parsing extracts skills and experience beyond surface keywords.', accent: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200 hover:border-indigo-400', shadow: 'hover:shadow-indigo-500/30' },
    { icon: BarChart3, title: 'Smart Candidate Ranking', desc: 'Proprietary scoring algorithms rank candidates by multi-dimensional fit scores.', accent: 'bg-violet-100 text-violet-600', border: 'border-violet-200 hover:border-violet-400', shadow: 'hover:shadow-violet-500/30' },
    { icon: GitBranch, title: 'Automated Skill Matching', desc: 'Graph-based skill matching identifies lateral skills across roles.', accent: 'bg-sky-100 text-sky-600', border: 'border-sky-200 hover:border-sky-400', shadow: 'hover:shadow-sky-500/30' },
    { icon: Search, title: 'AI Talent Discovery', desc: 'Proactively surface passive candidates who match your requirements.', accent: 'bg-rose-100 text-rose-600', border: 'border-rose-200 hover:border-rose-400', shadow: 'hover:shadow-rose-500/30' },
    { icon: Sparkles, title: 'Intelligent Recommendations', desc: 'Continuously learns from hiring decisions to improve over time.', accent: 'bg-amber-100 text-amber-600', border: 'border-amber-200 hover:border-amber-400', shadow: 'hover:shadow-amber-500/30' },
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
    { value: '10×', label: 'Faster Hiring', color: 'text-indigo-600' },
    { value: '95%', label: 'Match Accuracy', color: 'text-violet-600' },
    { value: '< 2s', label: 'AI Analysis Time', color: 'text-sky-600' },
    { value: '100%', label: 'Automated', color: 'text-pink-600' },
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
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-lg shadow-indigo-900/5 py-3'
                    : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-heading font-black text-2xl text-slate-900 tracking-tight">
                        Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-500">X</span>
                    </span>
                </div>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
                    {[['#workflow', 'How It Works'], ['#intelligence', 'Intelligence'], ['#ecosystem', 'Portals'], ['#capabilities', 'Capabilities']].map(([href, label]) => (
                        <a key={href} href={href} className="relative group hover:text-indigo-600 transition-colors tracking-wide">
                            {label}
                            <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <Link to="/login">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 30px -10px rgba(99,102,241,0.6)' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-xl transition-all"
                    >
                        Login Portal
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
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-200 selection:text-indigo-900">
            <CursorGlow />
            <LandingNav />

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <HeroBg />

                <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <Reveal scale delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-indigo-700 text-sm font-bold mb-10 shadow-xl shadow-indigo-900/5">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            Next-Generation Hiring Intelligence
                        </div>
                    </Reveal>

                    <Reveal scale delay={0.2}>
                        <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black font-heading tracking-tighter leading-[0.95] text-slate-900 mb-8 drop-shadow-sm">
                            The Intelligent
                            <br />
                            <span className="relative inline-block mt-2">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500">
                                    Future of Hiring.
                                </span>
                                {/* Massive glowing text shadow */}
                                <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 opacity-30 z-0"></span>
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.4}>
                        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
                            A wildly powerful, visually stunning platform that deeply analyzes resumes and connects top talent with the right opportunity — automatically.
                        </p>
                    </Reveal>

                    <Reveal delay={0.6}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(99,102,241,0.5)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white font-bold text-lg shadow-2xl transition-all"
                                >
                                    Login to Platform <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <motion.a
                                href="#workflow"
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.9)' }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-10 py-5 rounded-full bg-white/50 backdrop-blur-md border border-white/50 text-slate-800 font-bold text-lg hover:text-indigo-700 transition-all shadow-xl shadow-slate-900/5"
                            >
                                Explore Features
                            </motion.a>
                        </div>
                    </Reveal>
                </motion.div>

                {/* Floating Elements (Cinematic effect) */}
                <motion.div 
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[20%] left-[10%] w-24 h-24 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl flex items-center justify-center rotate-12 pointer-events-none"
                >
                    <Brain className="w-10 h-10 text-indigo-500" />
                </motion.div>
                <motion.div 
                    animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }} 
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[20%] right-[10%] w-28 h-28 rounded-full bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl flex items-center justify-center -rotate-12 pointer-events-none"
                >
                    <Target className="w-12 h-12 text-fuchsia-500" />
                </motion.div>
            </section>

            {/* ── STATS TICKER ── */}
            <section className="py-16 relative z-10 bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-2xl shadow-indigo-900/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {stats.map((s, i) => (
                            <Reveal key={s.label} delay={i * 0.1} scale>
                                <div className="text-center group">
                                    <div className={`text-5xl md:text-6xl font-black font-heading mb-2 ${s.color} drop-shadow-md group-hover:scale-110 transition-transform duration-500`}>{s.value}</div>
                                    <div className="text-base text-slate-500 font-bold uppercase tracking-widest">{s.label}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PLATFORM WORKFLOW ── */}
            <section id="workflow" className="py-32 relative overflow-hidden bg-[#f8fafc]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f1f5f9]" />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <Reveal className="text-center mb-24" scale>
                        <h2 className="text-5xl md:text-6xl font-black font-heading text-slate-900 mb-6 tracking-tight">
                            Flawless <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">Automation.</span>
                        </h2>
                        <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
                            Five massive leaps forward in hiring technology. Sit back and watch the AI work.
                        </p>
                    </Reveal>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-sky-200 via-indigo-300 to-fuchsia-200 rounded-full" />

                        {workflowSteps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <Reveal key={step.num} delay={i * 0.15} direction="up">
                                    <motion.div
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        className="relative flex flex-col items-center text-center bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-2xl shadow-slate-200/50 cursor-default transition-all duration-500"
                                    >
                                        <div className="absolute -top-4 -right-2 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-500/30 rotate-12">
                                            {step.num}
                                        </div>
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mb-6 shadow-inner">
                                            <Icon className="w-10 h-10 text-indigo-600" />
                                        </div>
                                        <h3 className="font-black text-slate-800 text-lg mb-3">{step.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium">{step.desc}</p>
                                    </motion.div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── AI INTELLIGENCE CARDS ── */}
            <section id="intelligence" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-fuchsia-50 rounded-full blur-[120px] opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-60 pointer-events-none translate-y-1/2 -translate-x-1/3" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <Reveal className="text-center mb-24" scale>
                        <h2 className="text-5xl md:text-6xl font-black font-heading text-slate-900 mb-6 tracking-tight">
                            Deep <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-rose-500">Intelligence.</span>
                        </h2>
                        <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
                            Not just keyword matching. True semantic understanding built on state-of-the-art models.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {intelligenceFeatures.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <Reveal key={f.title} delay={i * 0.1}>
                                    <div className={`group h-full p-10 rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border-2 ${f.border} ${f.shadow} hover:-translate-y-2 transition-all duration-500 cursor-default shadow-xl shadow-slate-200/50`}>
                                        <div className={`w-16 h-16 rounded-2xl ${f.accent} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-black text-slate-900 text-2xl mb-4">{f.title}</h3>
                                        <p className="text-slate-500 text-base leading-relaxed font-medium">{f.desc}</p>
                                    </div>
                                </Reveal>
                            );
                        })}

                        {/* CTA card */}
                        <Reveal delay={0.5}>
                            <Link to="/login" className="block h-full">
                                <motion.div
                                    whileHover={{ scale: 1.03, rotate: -2 }}
                                    className="h-full min-h-[300px] p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 border-0 flex flex-col justify-between cursor-pointer transition-all duration-500 shadow-2xl shadow-indigo-600/30 overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 border border-white/30">
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="font-black text-white text-3xl mb-3 leading-tight">Experience<br/>The Magic</h3>
                                    </div>
                                    <div className="relative z-10 flex items-center gap-3 text-white text-lg font-bold mt-8 bg-white/10 w-fit px-6 py-3 rounded-full backdrop-blur-md border border-white/20 group">
                                        Launch Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </motion.div>
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── PORTAL ECOSYSTEM ── */}
            <section id="ecosystem" className="py-32 bg-slate-900 relative overflow-hidden text-white">
                {/* Dark section for extreme contrast */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[150px] mix-blend-screen"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-fuchsia-500 rounded-full blur-[150px] mix-blend-screen"
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <Reveal className="text-center mb-24" scale>
                        <h2 className="text-5xl md:text-7xl font-black font-heading text-white mb-6 tracking-tight">
                            Two Portals.<br/>One <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Ecosystem.</span>
                        </h2>
                    </Reveal>

                    <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {/* Job Seeker */}
                        <Reveal delay={0} direction="left">
                            <div className="group relative overflow-hidden rounded-[3rem] p-10 md:p-14 bg-white/5 backdrop-blur-3xl border border-white/10 hover:bg-white/10 transition-all duration-500 min-h-[500px]">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <Briefcase className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-4xl font-black font-heading text-white mb-4">For Seekers</h3>
                                <p className="text-cyan-100/70 text-lg mb-10 leading-relaxed font-medium">
                                    Let our AI discover, match, and apply to roles that fit your profile perfectly. Your ultimate career co-pilot.
                                </p>
                                <ul className="space-y-4 mb-12">
                                    {seekerFeatures.map(f => (
                                        <li key={f} className="flex items-center gap-4 text-white/90 text-base font-bold">
                                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                                                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/login">
                                    <button className="w-full py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-lg font-black transition-colors shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                                        Enter Seeker Portal
                                    </button>
                                </Link>
                            </div>
                        </Reveal>

                        {/* Job Provider */}
                        <Reveal delay={0.2} direction="right">
                            <div className="group relative overflow-hidden rounded-[3rem] p-10 md:p-14 bg-white/5 backdrop-blur-3xl border border-white/10 hover:bg-white/10 transition-all duration-500 min-h-[500px]">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center mb-8 shadow-2xl shadow-fuchsia-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <Cpu className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-4xl font-black font-heading text-white mb-4">For Recruiters</h3>
                                <p className="text-fuchsia-100/70 text-lg mb-10 leading-relaxed font-medium">
                                    Post jobs, let AI rank applicants, and auto-shortlist top candidates. Hiring on autopilot.
                                </p>
                                <ul className="space-y-4 mb-12">
                                    {providerFeatures.map(f => (
                                        <li key={f} className="flex items-center gap-4 text-white/90 text-base font-bold">
                                            <div className="w-6 h-6 rounded-full bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/50">
                                                <CheckCircle className="w-3.5 h-3.5 text-fuchsia-400" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/login">
                                    <button className="w-full py-5 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-lg font-black transition-colors shadow-[0_0_40px_rgba(217,70,239,0.4)]">
                                        Enter Recruiter Portal
                                    </button>
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="py-40 relative overflow-hidden bg-white">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0,transparent_100%)]" />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 text-center">
                    <Reveal scale>
                        <h2 className="text-6xl md:text-8xl font-black font-heading text-slate-900 mb-8 tracking-tighter">
                            The Wait <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Is Over.</span>
                        </h2>
                        <p className="text-slate-500 text-2xl mb-14 max-w-2xl mx-auto font-medium">
                            Join the revolution. Stop screening. Start hiring.
                        </p>
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(79, 70, 229, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-4 px-14 py-6 rounded-full bg-slate-900 text-white font-black text-2xl shadow-2xl transition-all group"
                            >
                                Launch HireX
                                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                            </motion.button>
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-heading font-black text-xl text-slate-900">HireX</span>
                    </div>
                    <p className="text-slate-400 font-medium">© 2026 HireX Platform.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
