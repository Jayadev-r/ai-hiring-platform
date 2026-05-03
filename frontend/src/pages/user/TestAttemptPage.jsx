import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, AlertTriangle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { getTestForAttempt, submitTest, saveTestProgress } from '../../services/testService';
import AILoader from '../../components/futuristic/AILoader';
import GlassCard from '../../components/futuristic/GlassCard';
import MatchScoreRing from '../../components/futuristic/MatchScoreRing';

const TestAttemptPage = () => {
    const { id: testId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQ, setCurrentQ] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [violations, setViolations] = useState(0);
    const [warning, setWarning] = useState('');

    const timerRef = useRef(null);
    const saveIntervalRef = useRef(null);

    // ── Load test ────────────────────────────────────────────
    useEffect(() => {
        const loadTest = async () => {
            try {
                setLoading(true);
                const res = await getTestForAttempt(testId);
                const data = res.data;
                setTest(data.test);
                setQuestions(data.questions);
                setAttemptId(data.attemptId);
                if (data.existingAnswers?.length > 0) {
                    const restored = {};
                    data.existingAnswers.forEach(a => { restored[a.question_id] = a.candidate_answer; });
                    setAnswers(restored);
                }
                const startedAt = new Date(data.startedAt);
                const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000);
                const remaining = Math.max(0, data.test.duration_minutes * 60 - elapsed);
                setTimeLeft(remaining);
                if (remaining <= 0) handleAutoSubmit(data.attemptId, {});
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load test');
            } finally { setLoading(false); }
        };
        loadTest();
        return () => { clearInterval(timerRef.current); clearInterval(saveIntervalRef.current); };
    }, [testId]);

    // ── Timer ────────────────────────────────────────────────
    useEffect(() => {
        if (timeLeft <= 0 || submitted) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timerRef.current); handleAutoSubmit(attemptId, answers); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [timeLeft, submitted, attemptId]);

    // ── Auto-save ─────────────────────────────────────────────
    useEffect(() => {
        if (!attemptId || submitted) return;
        saveIntervalRef.current = setInterval(() => saveProgress(), 30000);
        return () => clearInterval(saveIntervalRef.current);
    }, [attemptId, answers, submitted]);

    // ── Proctoring ────────────────────────────────────────────
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden && !submitted) {
                setViolations(v => v + 1);
                setWarning('⚠️ Tab switch detected! This will be reported to the recruiter.');
                setTimeout(() => setWarning(''), 5000);
            }
        };
        const handleBeforeUnload = (e) => { if (!submitted) { e.preventDefault(); e.returnValue = ''; } };
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => { document.removeEventListener('visibilitychange', handleVisibility); window.removeEventListener('beforeunload', handleBeforeUnload); };
    }, [submitted]);

    const saveProgress = async () => {
        if (!attemptId || submitted) return;
        try {
            const formatted = Object.entries(answers).map(([questionId, candidateAnswer]) => ({ questionId, candidateAnswer }));
            await saveTestProgress(testId, { attemptId, answers: formatted });
        } catch (err) { console.error('Auto-save error:', err); }
    };

    const handleAutoSubmit = useCallback(async (aId, currentAnswers) => {
        await doSubmit(aId || attemptId, currentAnswers || answers, true);
    }, [attemptId, answers]);

    const doSubmit = async (aId, currentAnswers, autoSubmitted) => {
        if (submitted || submitting) return;
        try {
            setSubmitting(true);
            const formatted = Object.entries(currentAnswers).map(([questionId, candidateAnswer]) => ({ questionId, candidateAnswer }));
            const res = await submitTest(testId, { attemptId: aId, answers: formatted, autoSubmitted });
            setSubmitted(true);
            setSubmitResult(res.data);
            clearInterval(timerRef.current);
            clearInterval(saveIntervalRef.current);
        } catch (err) {
            alert('Failed to submit: ' + (err.response?.data?.message || err.message));
        } finally { setSubmitting(false); }
    };

    const setAnswer = (questionId, value) => setAnswers(prev => ({ ...prev, [questionId]: value }));
    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const timerColor = timeLeft <= 60 ? 'text-red-400 border-red-400/40 bg-red-400/10' : timeLeft <= 300 ? 'text-amber-400 border-amber-400/40 bg-amber-400/10' : 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10';

    // ── States ────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#020617' }}>
            <AILoader text="Loading test..." size="lg" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#020617' }}>
            <GlassCard padding="lg" className="max-w-md text-center border-red-400/20">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="font-heading text-xl font-bold text-white mb-2">Cannot Access Test</h2>
                <p className="text-slate-400 mb-6">{error}</p>
                <button onClick={() => navigate('/user/tests')} className="btn-neon-cyan px-6 py-2.5 rounded-lg font-semibold">Back to My Tests</button>
            </GlassCard>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#020617' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <GlassCard padding="lg" className="max-w-md text-center">
                    <div className="w-20 h-20 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-white mb-2">Test Submitted!</h2>
                    <p className="text-slate-400 mb-6">Your answers have been recorded successfully.</p>
                    {submitResult && (
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <MatchScoreRing score={submitResult.scorePercentage || 0} size={100} label="Score" thickness={7} />
                            <p className="text-sm text-slate-500">
                                {submitResult.totalScore}/{submitResult.maxScore} points · {Math.floor(submitResult.timeTakenSeconds / 60)}m {submitResult.timeTakenSeconds % 60}s
                            </p>
                        </div>
                    )}
                    <p className="text-xs text-slate-600 mb-5">Detailed results available once the recruiter publishes them.</p>
                    <button onClick={() => navigate('/user/tests')} className="btn-neon-cyan w-full py-3 rounded-lg font-semibold">Back to My Tests</button>
                </GlassCard>
            </motion.div>
        </div>
    );

    const currentQuestion = questions[currentQ];
    const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;

    return (
        <div className="min-h-screen" style={{ background: '#020617' }}>
            {/* Violation warning */}
            <AnimatePresence>
                {warning && (
                    <motion.div initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }}
                        className="fixed top-0 left-0 right-0 z-50 bg-red-500/90 backdrop-blur text-white text-center py-2.5 text-sm font-semibold">
                        {warning}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Sticky top bar ─────────────────────────────── */}
            <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#020617]/90 backdrop-blur-xl">
                <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="font-heading font-bold text-white text-base">{test?.title}</h1>
                        <p className="text-xs text-slate-500">{answeredCount}/{questions.length} answered</p>
                    </div>

                    {/* Timer */}
                    <div className={`px-4 py-2 rounded-xl border font-mono-hirex text-lg font-bold flex items-center gap-2 ${timerColor}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>

                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={submitting}
                        className="btn-neon-purple px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" /> Submit Test
                    </button>
                </div>

                {/* Question navigator strip */}
                <div className="max-w-5xl mx-auto px-6 pb-3 flex gap-1.5 flex-wrap">
                    {questions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentQ(i)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${i === currentQ ? 'bg-purple-500 text-white shadow-glow-purple' :
                                    answers[q.id]?.trim() ? 'bg-green-400/20 border border-green-400/40 text-green-400' :
                                        'bg-white/[0.05] border border-white/10 text-slate-500 hover:border-white/20'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Question area ───────────────────────────────── */}
            <div className="max-w-3xl mx-auto px-6 py-8">
                {currentQuestion && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQ}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <GlassCard padding="lg" animate={false}>
                                {/* Question header */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-full bg-purple-400/10 border border-purple-400/30 flex items-center justify-center font-heading font-bold text-purple-300">
                                        {currentQ + 1}
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentQuestion.question_type === 'objective' ? 'bg-blue-400/10 border border-blue-400/30 text-blue-300' : 'bg-amber-400/10 border border-amber-400/30 text-amber-300'}`}>
                                        {currentQuestion.question_type === 'objective' ? 'Multiple Choice' : 'Descriptive'}
                                    </span>
                                </div>

                                <h2 className="text-lg font-medium text-white mb-6 leading-relaxed">
                                    {currentQuestion.question_text}
                                </h2>

                                {/* MCQ Options */}
                                {currentQuestion.question_type === 'objective' && currentQuestion.options && (
                                    <div className="space-y-3">
                                        {(typeof currentQuestion.options === 'string' ? JSON.parse(currentQuestion.options) : currentQuestion.options).map((option, oIdx) => {
                                            const selected = answers[currentQuestion.id] === option;
                                            return (
                                                <label key={oIdx}
                                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selected ? 'border-purple-500/70 bg-purple-500/10' : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-purple-400 bg-purple-400' : 'border-slate-600'}`}>
                                                        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                    </div>
                                                    <input type="radio" name={`q-${currentQuestion.id}`} value={option} checked={selected} onChange={() => setAnswer(currentQuestion.id, option)} className="sr-only" />
                                                    <span className="text-slate-200">{option}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Descriptive */}
                                {currentQuestion.question_type === 'descriptive' && (
                                    <textarea
                                        value={answers[currentQuestion.id] || ''}
                                        onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                                        placeholder="Type your answer here..."
                                        className="glass-input w-full px-4 py-3 resize-none text-sm leading-relaxed"
                                        rows={6}
                                    />
                                )}

                                {/* Navigation */}
                                <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/[0.06]">
                                    <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:border-white/20 hover:text-white transition-all disabled:opacity-30 font-semibold text-sm">
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </button>
                                    <span className="text-sm text-slate-600">{currentQ + 1} of {questions.length}</span>
                                    <button onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))} disabled={currentQ === questions.length - 1}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-neon-purple disabled:opacity-30 font-semibold text-sm">
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Submit Confirm Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                            <GlassCard padding="lg" className="max-w-sm w-full mx-4 text-center">
                                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                                <h3 className="font-heading text-lg font-bold text-white mb-2">Submit Test?</h3>
                                <p className="text-slate-400 text-sm mb-2">You've answered {answeredCount} of {questions.length} questions.</p>
                                {answeredCount < questions.length && <p className="text-amber-400 text-sm mb-3 font-semibold">{questions.length - answeredCount} question(s) unanswered!</p>}
                                <p className="text-slate-600 text-xs mb-6">This cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:border-white/20 font-semibold text-sm">Cancel</button>
                                    <button onClick={() => { setShowConfirm(false); doSubmit(attemptId, answers, false); }} disabled={submitting}
                                        className="flex-1 py-2.5 rounded-lg btn-neon-purple font-semibold text-sm disabled:opacity-50">
                                        {submitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TestAttemptPage;
