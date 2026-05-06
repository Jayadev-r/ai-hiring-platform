import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Bot, FileText, Sparkles, Target, Map, Briefcase, Zap,
    Settings, ChevronRight
} from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import TiltCard from '../../components/futuristic/TiltCard';

import CoverLetterModal from '../../components/shared/CoverLetterModal';
import OptimizeResumeModal from '../../components/shared/OptimizeResumeModal';
import MatchAnalysisModal from '../../components/shared/MatchAnalysisModal';
import CareerRoadmapModal from '../../components/shared/CareerRoadmapModal';

const TOOL_STYLES = {
    info: { icon: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200', glow: 'blue' },
    primary: { icon: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', glow: 'blue' },
    secondary: { icon: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', glow: 'purple' },
    success: { icon: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', glow: 'green' },
    warning: { icon: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', glow: 'amber' },
};

const AIActions = () => {
    const navigate = useNavigate();

    const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
    const [isOptimizeResumeModalOpen, setIsOptimizeResumeModalOpen] = useState(false);
    const [isMatchAnalysisModalOpen, setIsMatchAnalysisModalOpen] = useState(false);
    const [isCareerRoadmapModalOpen, setIsCareerRoadmapModalOpen] = useState(false);

    const aiActions = [
        { id: 'recommended-jobs', icon: Briefcase, title: 'Recommended Jobs', description: 'AI-powered external job suggestions tailored to your profile', color: 'info', action: () => navigate('/user/ai-actions/recommended-jobs') },
        { id: 'cover-letter', icon: FileText, title: 'Generate Cover Letter', description: 'Create a tailored cover letter for a specific job application', color: 'primary', action: () => setIsCoverLetterModalOpen(true) },
        { id: 'optimize-resume', icon: Sparkles, title: 'Optimize Resume', description: 'Improve your resume for better ATS compatibility and scoring', color: 'secondary', action: () => setIsOptimizeResumeModalOpen(true) },
        { id: 'match-analysis', icon: Target, title: 'Match Analysis', description: 'Get a detailed analysis of how well you match specific job listings', color: 'success', action: () => setIsMatchAnalysisModalOpen(true) },
        { id: 'career-roadmap', icon: Map, title: 'AI Career Roadmap', description: 'Visualise your path to mastering any skill or role', color: 'warning', action: () => setIsCareerRoadmapModalOpen(true) },
    ];

    return (
        <UserLayout>
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <Zap className="w-6 h-6 text-amber-500" />
                    <h1 className="font-heading text-4xl font-bold text-slate-900">AI Actions</h1>
                </div>
                <p className="text-slate-600 font-medium mt-0.5">Supercharge your job search with AI-powered tools</p>
            </motion.div>


            {/* ── AI Tools Grid ───────────────────────── */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {aiActions.map((action, i) => {
                    const Icon = action.icon;
                    const style = TOOL_STYLES[action.color] || TOOL_STYLES.info;
                    return (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.07 }}
                        >
                            <TiltCard className="h-full group">
                                <GlassCard hover glow={style.glow} padding="lg" animate={false} className="h-full flex flex-col">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${style.bg} ${style.border} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-6 h-6 ${style.icon}`} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-heading font-bold text-slate-900 text-base mb-2">{action.title}</h3>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed flex-1 mb-5">{action.description}</p>

                                    {/* CTA */}
                                    <button
                                        onClick={action.action}
                                        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${style.bg} ${style.border} ${style.icon} hover:brightness-95`}
                                    >
                                        Run Action
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </GlassCard>
                            </TiltCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Modals (all preserved) ──────────────── */}
            <CoverLetterModal isOpen={isCoverLetterModalOpen} onClose={() => setIsCoverLetterModalOpen(false)} />
            <OptimizeResumeModal isOpen={isOptimizeResumeModalOpen} onClose={() => setIsOptimizeResumeModalOpen(false)} />
            <MatchAnalysisModal isOpen={isMatchAnalysisModalOpen} onClose={() => setIsMatchAnalysisModalOpen(false)} />
            <CareerRoadmapModal isOpen={isCareerRoadmapModalOpen} onClose={() => setIsCareerRoadmapModalOpen(false)} />
        </UserLayout>
    );
};

export default AIActions;
