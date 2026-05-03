import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bot, X, Sparkles, Search, Zap, FileText, Target, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QUICK_ACTIONS = [
    { label: 'AI Recommended Jobs', icon: Sparkles, path: '/user/ai-actions/recommended-jobs' },
    { label: 'Cover Letter', icon: FileText, path: '/user/ai-actions' },
    { label: 'Match Analysis', icon: Target, path: '/user/ai-actions' },
    { label: 'Career Roadmap', icon: Map, path: '/user/ai-actions' },
    { label: 'Job Discovery', icon: Search, path: '/user/jobs' },
    { label: 'AI Actions Hub', icon: Zap, path: '/user/ai-actions' },
];

/**
 * AICompanionOrb – TOP-RIGHT pulsing AI orb.
 * Opens a quick-actions panel that drops downward-left below the orb.
 */
const AICompanionOrb = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const shouldReduce = useReducedMotion();

    const handleAction = (path) => { navigate(path); setOpen(false); };

    return (
        <>
            {/* Command palette — drops below-left of the top-right orb */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[190]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* Palette — positioned top-right, below the orb */}
                        <motion.div
                            className="fixed top-20 right-6 z-[201] glass-panel p-5 w-72"
                            initial={{ opacity: 0, y: -12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                        <Bot className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="font-heading text-sm font-bold text-slate-900">AI Assistant</span>
                                </div>
                                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-[10px] text-slate-500 mb-3 font-bold uppercase tracking-widest">Quick Actions</p>

                            {/* Actions */}
                            <div className="space-y-1">
                                {QUICK_ACTIONS.map((action, i) => {
                                    const Icon = action.icon;
                                    return (
                                        <motion.button
                                            key={action.label}
                                            onClick={() => handleAction(action.path)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
                                            initial={shouldReduce ? {} : { opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Icon className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors shrink-0" />
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{action.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* AI Orb button — fixed TOP-RIGHT */}
            <div className="fixed top-6 right-6 z-[200]">
                <motion.button
                    onClick={() => setOpen((o) => !o)}
                    className="w-14 h-14 rounded-full flex items-center justify-center relative shadow-lg"
                    style={{
                        background: 'linear-gradient(135deg, #4F46E5, #0891b2)',
                        border: '2px solid white',
                    }}
                    whileHover={shouldReduce ? {} : { scale: 1.08 }}
                    whileTap={shouldReduce ? {} : { scale: 0.94 }}
                    aria-label="Open AI Assistant"
                >
                    {/* Spinning gradient border */}
                    <motion.div
                        className="absolute inset-[-2px] rounded-full"
                        style={{
                            background: 'conic-gradient(from 0deg, #4F46E5, #06b6d4, #4F46E5)',
                            zIndex: -1,
                        }}
                        animate={shouldReduce ? {} : { rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Pulsing glow */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'rgba(79, 70, 229, 0.4)' }}
                        animate={shouldReduce ? {} : { scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <Bot className="w-6 h-6 text-white relative z-10" />
                </motion.button>

                {/* Tooltip below orb */}
                {!open && (
                    <div className="absolute top-16 right-0 whitespace-nowrap bg-indigo-600 px-3 py-1.5 rounded-[10px] text-xs font-semibold text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        AI Assistant
                    </div>
                )}
            </div>
        </>
    );
};

export default AICompanionOrb;
