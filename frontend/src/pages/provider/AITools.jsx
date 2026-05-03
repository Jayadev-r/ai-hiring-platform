import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Zap
} from 'lucide-react';
import { ProviderLayout } from '../../components/provider-layout';
import { motion } from 'framer-motion';

/**
 * AI Tools page for recruiters
 * Rebuilt as a high-tech "AI Recruiting Copilot" interface.
 */
const AITools = () => {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'auto-shortlist',
            icon: Users,
            title: 'Auto-Shortlist AI',
            description: 'Rank and shortlist candidates using multi-parameter semantic matching engine.',
            path: '/provider/ai-tools/auto-shortlist',
            accent: 'blue',
            badge: 'High Precision'
        },
        {
            id: 'interview-scheduler',
            icon: Calendar,
            title: 'Smart Scheduler',
            description: 'Intelligent interview coordination based on candidate ranking and availability.',
            path: '/provider/ai-tools/interview-scheduler',
            accent: 'violet',
            badge: 'Automated'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <ProviderLayout>
            {/* Hero Section */}
            <div className="relative mb-12 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden shadow-xl border border-slate-700">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <Sparkles className="w-full h-full text-blue-400" />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-4 animate-pulse">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Powered by HireX Intelligence</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">AI Recruiting Copilot</h1>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Streamline your workflow with specialized AI tools designed to reduce time-to-hire by mapping candidate DNA to your team culture and technical requirements.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Semantic Matching</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Contextual Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Bias Mitigation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <motion.div
                            key={tool.id}
                            variants={itemVariants}
                            whileHover={{ y: -4 }}
                            className="provider-panel group relative overflow-hidden p-0 border-slate-200"
                            onClick={() => navigate(tool.path)}
                        >
                            <div className="p-6 cursor-pointer">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all duration-300">
                                        <Icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                                    </div>
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-tighter">
                                        {tool.badge}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                    {tool.description}
                                </p>

                                <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <span>Launch Engine</span>
                                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>

                            {/* Accent Glow */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tool.accent === 'blue' ? 'from-blue-400 to-indigo-500' :
                                tool.accent === 'violet' ? 'from-violet-400 to-purple-500' :
                                    tool.accent === 'emerald' ? 'from-emerald-400 to-teal-500' :
                                        'from-amber-400 to-orange-500'
                                } opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* AI Insight Card */}
            <div className="provider-panel bg-blue-50/30 border-blue-100/50 p-6 flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
                    <Sparkles className="w-5 h-5 font-bold" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Pro Tip: AI Ranking Efficiency</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Recruiters using HireX AI tools report <strong className="text-slate-700">60% less time spent</strong> on manual screening. We recommend using Auto-Shortlist immediately after a job post reaches 20+ applicants for optimal results.
                    </p>
                </div>
            </div>
        </ProviderLayout>
    );
};

export default AITools;
