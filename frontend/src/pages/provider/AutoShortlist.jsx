import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Zap,
    Search,
    CheckCircle2,
    XCircle,
    Info,
    TrendingUp,
    BarChart3,
    Target,
    ChevronDown,
    ChevronUp,
    Sparkles,
    FileText,
    Activity,
    BrainCircuit,
    ArrowRight,
    SearchCode,
    Gauge,
    Users,
    Mail
} from 'lucide-react';
import { ProviderLayout } from '../../components/provider-layout';
import { StatusBadge, SkeletonCard, TopProgressBar } from '../../components/provider-ui';
import { useProviderToast } from '../../contexts/ProviderToastContext';
import api from '../../api/axios';

const AutoShortlist = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [expandedCandidateId, setExpandedCandidateId] = useState(null);
    const [currentJobDetails, setCurrentJobDetails] = useState(null);
    const { addToast } = useProviderToast();

    // Fetch jobs on mount
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/ai-tools/jobs');
                if (response.data.success) {
                    setJobs(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                addToast('error', 'Failed to load jobs');
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchJobs();
    }, []);

    // Fetch candidates when job selection changes
    useEffect(() => {
        if (!selectedJobId) {
            setCandidates([]);
            setCurrentJobDetails(null);
            return;
        }

        const fetchJobDetails = async () => {
            try {
                const res = await api.get(`/jobs/${selectedJobId}`);
                if (res.data.success) {
                    setCurrentJobDetails(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch job details", err);
            }
        };

        const fetchCandidates = async () => {
            setLoadingCandidates(true);
            try {
                const response = await api.get(`/ai-tools/jobs/${selectedJobId}/candidates`);
                if (response.data.success) {
                    setCandidates(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching candidates:', error);
                addToast('error', 'Failed to load candidates');
            } finally {
                setLoadingCandidates(false);
            }
        };

        fetchJobDetails();
        fetchCandidates();
    }, [selectedJobId]);

    const handleRunAutoShortlist = async () => {
        if (!selectedJobId) return;
        setProcessing(true);

        try {
            const response = await api.post(`/ai-tools/shortlist/${selectedJobId}`);
            if (response.data.success) {
                addToast('success', 'AI Analysis Complete');
                setCandidates(response.data.data);
            }
        } catch (error) {
            console.error('Error running auto-shortlist:', error);
            addToast('error', error.response?.data?.message || 'AI processing failed');
        } finally {
            setProcessing(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <ProviderLayout>
            {(loadingJobs || loadingCandidates || processing) && <TopProgressBar progress={processing ? 70 : 30} />}

            <div className="max-w-[1200px] mx-auto px-6 py-10">
                {/* Hero Section */}
                <div className="mb-12 relative overflow-hidden p-8 rounded-[2rem] bg-provider-slate-900 text-white">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                        <Activity className="w-full h-full text-provider-blue-400 stroke-[0.5]" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-provider-blue-500/20 text-provider-blue-300 border border-provider-blue-500/30 text-[10px] font-black uppercase tracking-widest mb-4">
                                <Sparkles className="w-3 h-3" /> HireX Intelligence
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
                                AI <span className="text-provider-blue-400">Talent Scouter</span>
                            </h1>
                            <p className="text-provider-slate-400 font-medium text-lg max-w-xl">
                                Instantly rank candidates based on deep multi-dimensional analysis of their resumes against your JD.
                            </p>
                        </div>

                        <div className="flex-shrink-0 w-48 h-48 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <svg className="w-full h-full text-provider-blue-500/20" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
                                </svg>
                            </motion.div>
                            <BrainCircuit className="w-24 h-24 text-provider-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Job Context */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="provider-panel p-6">
                            <h3 className="text-sm font-black text-provider-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Target className="w-4 h-4 text-provider-blue-600" />
                                Target Position
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter mb-1.5 block">Select Job Posting</label>
                                    <select
                                        value={selectedJobId}
                                        onChange={(e) => setSelectedJobId(e.target.value)}
                                        className="provider-input font-bold text-provider-slate-700"
                                    >
                                        <option value="">Choose a listing...</option>
                                        {jobs.map((job) => (
                                            <option key={job.job_id} value={job.job_id}>
                                                {job.job_title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleRunAutoShortlist}
                                    disabled={!selectedJobId || candidates.length === 0 || processing}
                                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${processing
                                        ? 'bg-provider-slate-200 text-provider-slate-400'
                                        : 'bg-provider-blue-600 text-white shadow-lg shadow-provider-blue-200 hover:bg-provider-blue-700 disabled:opacity-50 disabled:grayscale'
                                        }`}
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4" />
                                            Run AI Scouter
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </section>

                        <AnimatePresence>
                            {currentJobDetails && (
                                <motion.section
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="provider-panel p-6"
                                >
                                    <h3 className="text-sm font-black text-provider-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-provider-blue-600" />
                                        Job Context
                                    </h3>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        <div>
                                            <p className="text-xs text-provider-slate-500 font-medium leading-relaxed whitespace-pre-line line-clamp-6 hover:line-clamp-none transition-all cursor-n-resize">
                                                {currentJobDetails.job_description}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-provider-slate-100">
                                            <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter mb-2 block">Required Stack</label>
                                            <div className="flex flex-wrap gap-2">
                                                {currentJobDetails.required_skills?.split(',').map((skill, i) => (
                                                    <span key={i} className="px-2 py-1 bg-provider-slate-100 text-provider-slate-600 text-[10px] font-bold rounded-md capitalize">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Scouter Feed */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-provider-slate-900 flex items-center gap-2 uppercase tracking-tight">
                                <SearchCode className="w-5 h-5 text-provider-blue-600" />
                                Scouter Results
                            </h2>

                            <div className="flex items-center gap-4 text-xs font-bold text-provider-slate-500 bg-provider-slate-100 px-3 py-1.5 rounded-lg border border-provider-slate-200">
                                <span>Candidates: {candidates.length}</span>
                                <div className="w-px h-3 bg-provider-slate-300" />
                                <span>Sorted by Relevance</span>
                            </div>
                        </div>

                        {!selectedJobId ? (
                            <div className="provider-panel p-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-3xl bg-provider-slate-50 flex items-center justify-center mb-6">
                                    <Target className="w-10 h-10 text-provider-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-provider-slate-900 mb-2">Initialize Scouter</h3>
                                <p className="text-provider-slate-500 text-sm max-w-sm">Select a job posting from the panel to begin AI-powered candidate ranking and analysis.</p>
                            </div>
                        ) : loadingCandidates ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : candidates.length === 0 ? (
                            <div className="provider-panel p-20 flex flex-col items-center justify-center text-center">
                                <Users className="w-12 h-12 text-provider-slate-300 mb-4" />
                                <p className="text-provider-slate-500 font-bold">No applicants found for this position yet.</p>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {candidates.map((candidate, index) => (
                                    <motion.div
                                        key={candidate.application_id}
                                        variants={itemVariants}
                                        className={`provider-panel overflow-hidden transition-all border-l-4 ${candidate.match_score >= 70 ? 'border-l-green-500' :
                                            candidate.match_score >= 40 ? 'border-l-amber-500' : 'border-l-provider-slate-300'
                                            }`}
                                    >
                                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${index < 3 && candidate.match_score !== null
                                                    ? 'bg-provider-blue-50 text-provider-blue-600'
                                                    : 'bg-provider-slate-50 text-provider-slate-400'
                                                    }`}>
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-provider-slate-900">{candidate.candidate_name}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[11px] font-bold text-provider-slate-500 flex items-center gap-1 uppercase tracking-tighter">
                                                            <Mail className="w-3 h-3" /> {candidate.candidate_email}
                                                        </span>
                                                        <div className="w-1 h-1 rounded-full bg-provider-slate-300" />
                                                        <span className={`text-[11px] font-black uppercase tracking-tighter flex items-center gap-1 ${candidate.has_resume ? 'text-provider-blue-600' : 'text-rose-500'}`}>
                                                            {candidate.has_resume ? <FileText className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                            {candidate.has_resume ? 'Resume Scanned' : 'Missing File'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                {candidate.match_score !== null ? (
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest mb-1">Relevance Score</div>
                                                            <div className={`text-2xl font-black ${candidate.match_score >= 80 ? 'text-green-600' :
                                                                candidate.match_score >= 60 ? 'text-provider-blue-600' : 'text-provider-slate-700'
                                                                }`}>
                                                                {candidate.match_score}%
                                                            </div>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setExpandedCandidateId(expandedCandidateId === candidate.application_id ? null : candidate.application_id)}
                                                            className={`p-2 rounded-xl border transition-all ${expandedCandidateId === candidate.application_id
                                                                ? 'bg-provider-blue-600 border-provider-blue-600 text-white shadow-lg shadow-provider-blue-200'
                                                                : 'bg-white border-provider-slate-200 text-provider-slate-400 hover:text-provider-blue-600 hover:border-provider-blue-200 shadow-sm'
                                                                }`}
                                                        >
                                                            {expandedCandidateId === candidate.application_id ? <ChevronUp className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                                                        </motion.button>
                                                    </div>
                                                ) : (
                                                    <div className="px-4 py-2 bg-provider-slate-50 rounded-xl text-[10px] font-black text-provider-slate-400 uppercase tracking-widest border border-dashed border-provider-slate-200">
                                                        Analysis Needed
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expandable Insight Panel */}
                                        <AnimatePresence>
                                            {expandedCandidateId === candidate.application_id && candidate.explanation && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-provider-slate-100 bg-provider-slate-50/50"
                                                >
                                                    <div className="p-6">
                                                        <div className="flex gap-4 mb-8">
                                                            <div className="w-10 h-10 rounded-xl bg-provider-blue-600 flex items-center justify-center flex-shrink-0">
                                                                <Sparkles className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-black text-provider-blue-600 uppercase tracking-widest block mb-1">Executive Summary</label>
                                                                <p className="text-sm text-provider-slate-700 font-medium italic leading-relaxed">
                                                                    "{candidate.explanation.aiNarrative || candidate.explanation.summary}"
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Metrics Grid */}
                                                        {candidate.explanation.breakdown && (
                                                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                                                                {[
                                                                    { label: 'Skills', val: candidate.explanation.breakdown.skillScore, col: 'blue' },
                                                                    { label: 'Experience', val: candidate.explanation.breakdown.experienceScore, col: 'green' },
                                                                    { label: 'Seniority', val: candidate.explanation.breakdown.seniorityScore, col: 'indigo' },
                                                                    { label: 'Education', val: candidate.explanation.breakdown.educationScore, col: 'violet' },
                                                                    { label: 'Relevance', val: candidate.explanation.breakdown.tfidfScore, col: 'amber' }
                                                                ].map((metric, i) => (
                                                                    <div key={i} className="bg-white p-3 rounded-2xl border border-provider-slate-200 shadow-sm">
                                                                        <div className="flex justify-between items-center mb-2">
                                                                            <span className="text-[9px] font-black text-provider-slate-400 uppercase tracking-tighter">{metric.label}</span>
                                                                            <span className="text-xs font-black text-provider-slate-900">{Math.round(metric.val)}%</span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-provider-slate-100 rounded-full overflow-hidden">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${metric.val}%` }}
                                                                                className={`h-full bg-provider-${metric.col}-500 rounded-full`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            <div className="bg-white/50 p-4 rounded-2xl border border-provider-slate-200">
                                                                <h5 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Strengths Identified
                                                                </h5>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {candidate.explanation.matchedSkills?.map((skill, si) => (
                                                                        <span key={si} className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100 capitalize">
                                                                            {skill}
                                                                        </span>
                                                                    )) || <span className="text-xs text-provider-slate-400">No specific strengths found.</span>}
                                                                </div>
                                                            </div>

                                                            <div className="bg-white/50 p-4 rounded-2xl border border-provider-slate-200">
                                                                <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                    <XCircle className="w-3.5 h-3.5" /> Talent Gaps
                                                                </h5>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {candidate.explanation.missingSkills?.map((skill, si) => (
                                                                        <span key={si} className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-lg border border-rose-100 capitalize">
                                                                            {skill}
                                                                        </span>
                                                                    )) || <span className="text-xs text-provider-slate-400 font-bold">Perfect alignment.</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </ProviderLayout>
    );
};

export default AutoShortlist;
