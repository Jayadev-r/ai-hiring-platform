import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Award, CheckCircle, XCircle, Code2, Clock,
    Calendar, ChevronLeft, Terminal, FileText, TrendingUp
} from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import AILoader from '../../components/futuristic/AILoader';
import MatchScoreRing from '../../components/futuristic/MatchScoreRing';
import AnimatedCounter from '../../components/futuristic/AnimatedCounter';
import codingService from '../../services/codingService';

const CodingResultPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { fetchResults(); }, [id]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const res = await codingService.getCodingSubmissions(id);
            setSubmissions(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Results may not be published yet.');
        } finally { setLoading(false); }
    };

    if (loading) return <UserLayout><AILoader text="Retrieving performance data..." size="lg" /></UserLayout>;

    if (error) return (
        <UserLayout>
            <GlassCard padding="lg" className="max-w-md mx-auto text-center border-amber-200 mt-10">
                <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">Results Pending</h3>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={() => navigate('/user/coding-tests')} className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-colors">Back to Dashboard</button>
            </GlassCard>
        </UserLayout>
    );

    const totalScore = submissions.reduce((sum, s) => sum + parseFloat(s.score || 0), 0);
    const totalMaxScore = submissions.reduce((sum, s) => sum + parseInt(s.max_score || 0), 0);
    const scorePercent = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
    const totalPassed = submissions.reduce((sum, s) => sum + (s.test_cases_passed || 0), 0);

    return (
        <UserLayout>
            {/* Back */}
            <button onClick={() => navigate('/user/coding-tests')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 font-semibold text-sm">
                <ChevronLeft className="w-4 h-4" /> Back to Tests
            </button>

            {/* Score hero */}
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard padding="none" animate={false} className="overflow-hidden border-indigo-100">
                    {/* Dark header zone */}
                    <div className="relative p-10 text-center overflow-hidden bg-indigo-50">
                        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(79,70,229,0.1) 0%, transparent 60%)' }} />
                        <div className="relative z-10 space-y-5">
                            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto rotate-3 border border-indigo-200">
                                <Award className="w-10 h-10 text-indigo-600" />
                            </div>
                            <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">Test Performance Report</p>
                            <h1 className="font-heading text-4xl font-extrabold text-slate-900">Your Results are In!</h1>
                            <div className="flex items-center justify-center gap-16 pt-4 border-t border-indigo-200">
                                <div className="text-center">
                                    <AnimatedCounter value={scorePercent} className="font-heading text-5xl font-black text-slate-900 block" suffix="%" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Final Score</p>
                                </div>
                                <div className="w-px h-12 bg-indigo-200" />
                                <div className="text-center">
                                    <p className="font-heading text-5xl font-black text-indigo-600">{totalScore}<span className="text-2xl text-slate-500">/{totalMaxScore}</span></p>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Raw Marks</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics strip */}
                    <div className="grid grid-cols-3 divide-x divide-slate-200 p-0 border-t border-slate-200 bg-white">
                        {[
                            { icon: FileText, color: 'text-blue-400', label: 'Questions', value: submissions.length },
                            { icon: CheckCircle, color: 'text-green-400', label: 'Passed Cases', value: totalPassed },
                            { icon: TrendingUp, color: 'text-amber-400', label: 'Percentile', value: 'Top 15%', raw: true },
                        ].map(({ icon: Icon, color, label, value, raw }, i) => (
                            <div key={i} className="flex items-center gap-4 p-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 shrink-0 ${color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                                    {raw ? <p className="font-heading text-xl font-black text-slate-900">{value}</p> : <AnimatedCounter value={value} className="font-heading text-xl font-black text-slate-900 block" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </motion.div>

            {/* Breakdown */}
            <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" /> Question Breakdown
            </h2>
            <div className="space-y-4">
                {submissions.map((sub, idx) => {
                    const fullScore = parseFloat(sub.score) === parseInt(sub.max_score);
                    return (
                        <motion.div key={sub.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                            <GlassCard hover glow={fullScore ? 'green' : 'purple'} padding="md" animate={false} className="group">
                                <div className="flex items-start justify-between flex-wrap gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="w-6 h-6 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[10px] font-black font-mono-hirex text-indigo-700">
                                                Q{idx + 1}
                                            </span>
                                            <h4 className="font-heading font-bold text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{sub.question_title}</h4>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" />{sub.language}</span>
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(sub.submitted_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-baseline gap-1">
                                            <span className={`font-heading text-2xl font-black ${fullScore ? 'text-green-500' : 'text-slate-900'}`}>{sub.score}</span>
                                            <span className="text-xs text-slate-500">/ {sub.max_score}</span>
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${sub.test_cases_passed === sub.total_test_cases ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
                                            {sub.test_cases_passed === sub.total_test_cases ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {sub.test_cases_passed}/{sub.total_test_cases} Cases
                                        </span>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* AI insight */}
            <motion.div className="mt-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <GlassCard padding="md" animate={false} className="border-indigo-200 bg-indigo-50">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h4 className="font-heading font-bold text-slate-900 mb-1">Expert Feedback</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Your performance in "{submissions[0]?.question_title || 'Logic'}" demonstrates strong algorithmic thinking. {scorePercent > 70 ? 'Recruiters are highly likely to notice your profile based on these results.' : 'Consider practicing more on complexity analysis and edge cases to improve your score in future assessments.'}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </UserLayout>
    );
};

export default CodingResultPage;
