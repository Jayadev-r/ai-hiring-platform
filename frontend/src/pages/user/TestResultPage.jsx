import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, CheckCircle, XCircle, Clock, ChevronLeft, AlertCircle } from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import AILoader from '../../components/futuristic/AILoader';
import MatchScoreRing from '../../components/futuristic/MatchScoreRing';
import { getMyTestResult } from '../../services/testService';

const TestResultPage = () => {
    const { id: testId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getMyTestResult(testId);
                setResult(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load results');
            } finally { setLoading(false); }
        })();
    }, [testId]);

    if (loading) return <UserLayout><AILoader text="Loading results..." size="lg" /></UserLayout>;

    if (error) return (
        <UserLayout>
            <GlassCard padding="lg" className="max-w-md mx-auto text-center border-red-200 mt-10 shadow-sm bg-red-50">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">Error</h2>
                <p className="text-slate-500 mb-6 font-medium">{error}</p>
                <button onClick={() => navigate('/user/tests')} className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-colors">Back to My Tests</button>
            </GlassCard>
        </UserLayout>
    );

    if (!result?.resultsPublished) return (
        <UserLayout>
            <GlassCard padding="lg" className="max-w-md mx-auto text-center border-amber-200 mt-10 shadow-sm">
                <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">{result?.title}</h2>
                <p className="text-slate-500 mb-6 font-medium">{result?.message || 'Results have not been published yet.'}</p>
                <button onClick={() => navigate('/user/tests')} className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-colors">Back to My Tests</button>
            </GlassCard>
        </UserLayout>
    );

    return (
        <UserLayout>
            {/* Back */}
            <button onClick={() => navigate('/user/tests')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-semibold text-sm">
                <ChevronLeft className="w-4 h-4" /> Back to My Tests
            </button>

            <h1 className="font-heading text-3xl font-bold text-slate-900 mb-6">{result.title} — Results</h1>

            {/* Score hero */}
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard padding="none" animate={false}>
                    <div className="p-8 flex items-center justify-between flex-wrap gap-8">
                        <div className="flex items-center gap-8">
                            <MatchScoreRing score={result.scorePercentage || 0} size={110} label="Score" thickness={7} />
                            <div>
                                <p className="text-slate-500 text-sm mb-1 font-semibold uppercase tracking-wider">Your Score</p>
                                <p className="font-heading text-4xl font-bold text-slate-900">{result.totalScore}<span className="text-slate-400 text-2xl">/{result.maxScore}</span></p>
                                <p className="text-sm text-slate-500 mt-1 font-medium">
                                    {Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s · {new Date(result.submittedAt).toLocaleString()}
                                </p>
                                {result.autoSubmitted && <p className="text-amber-500 text-xs font-semibold mt-1">Auto-submitted (time expired)</p>}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100 min-w-24">
                                <p className="font-heading text-2xl font-bold text-green-500">{result.answers?.filter(a => a.is_correct).length || 0}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Correct</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100 min-w-24">
                                <p className="font-heading text-2xl font-bold text-red-500">{result.answers?.filter(a => !a.is_correct).length || 0}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Incorrect</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Answers */}
            <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" /> Answer Breakdown
            </h2>
            <div className="space-y-4">
                {result.answers?.map((ans, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}>
                        <GlassCard padding="md" animate={false} className={`border ${ans.is_correct ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${ans.is_correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {ans.question_order}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ans.question_type === 'objective' ? 'bg-indigo-50 border border-indigo-200 text-indigo-600' : 'bg-amber-50 border border-amber-200 text-amber-600'}`}>
                                        {ans.question_type === 'objective' ? 'MCQ' : 'Descriptive'}
                                    </span>
                                </div>
                                {ans.is_correct
                                    ? <span className="flex items-center gap-1 text-green-600 text-sm font-semibold"><CheckCircle className="w-4 h-4" /> Correct</span>
                                    : <span className="flex items-center gap-1 text-red-600 text-sm font-semibold"><XCircle className="w-4 h-4" /> Incorrect</span>
                                }
                            </div>
                            <p className="text-slate-900 font-medium mb-4 leading-relaxed">{ans.question_text}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className={`p-3 rounded-xl ${ans.is_correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                    <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">Your Answer</p>
                                    <p className={`text-sm font-medium ${ans.is_correct ? 'text-green-700' : 'text-red-700'}`}>{ans.candidate_answer || '— No Answer —'}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">Expected Answer</p>
                                    <p className="text-sm font-medium text-slate-900">{ans.expected_answer}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button onClick={() => navigate('/user/tests')} className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold shadow-sm transition-colors">Back to My Tests</button>
            </div>
        </UserLayout>
    );
};

export default TestResultPage;
