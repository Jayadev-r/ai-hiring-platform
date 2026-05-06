import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Code, Clock, Play, Send, ChevronRight, ChevronLeft,
    AlertCircle, CheckCircle, Info, Maximize2, Minimize2,
    Settings, Terminal, FileCode, RotateCcw, Award
} from 'lucide-react';
import MonacoCodeEditor from '../../components/coding/MonacoCodeEditor';
import codingService from '../../services/codingService';

const CodingTestAttempt = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [codes, setCodes] = useState({}); // { [questionId]: sourceCode }
    const [languages, setLanguages] = useState({}); // { [questionId]: languageId }
    const [results, setResults] = useState({}); // { [questionId]: result }
    const [runResults, setRunResults] = useState({}); // { [questionId]: results[] }
    const [customInputs, setCustomInputs] = useState({}); // { [questionId]: string }
    const [customOutputs, setCustomOutputs] = useState({}); // { [questionId]: result }
    const [submittedQuestions, setSubmittedQuestions] = useState({}); // { [questionId]: boolean }
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [activeResultTab, setActiveResultTab] = useState('results'); // results | custom

    // Fetch Test
    useEffect(() => {
        fetchTestData();
    }, [id]);

    const fetchTestData = async () => {
        try {
            setLoading(true);
            const res = await codingService.getCodingTestForAttempt(id);
            const testData = res.data;
            setTest(testData);
            setTimeLeft(testData.time_limit * 60);

            // Initialize codes and languages
            const initialCodes = {};
            const initialLanguages = {};
            const availableLanguages = codingService.getSupportedLanguages();

            testData.questions.forEach(q => {
                initialCodes[q.id] = q.previousSubmission?.source_code || availableLanguages[0].template;
                initialLanguages[q.id] = q.previousSubmission?.language || availableLanguages[0].id;
            });

            setCodes(initialCodes);
            setLanguages(initialLanguages);
        } catch (error) {
            console.error('Error fetching test data:', error);
            alert('Failed to load test. Please try again.');
            navigate('/user/coding-tests');
        } finally {
            setLoading(false);
        }
    };

    // Timer Logic
    useEffect(() => {
        if (!timeLeft || loading) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // UI Handlers
    const currentQuestion = test?.questions[currentQuestionIndex];
    const currentCode = codes[currentQuestion?.id] || '';
    const currentLanguage = languages[currentQuestion?.id] || 'python3';
    const isSubmitted = submittedQuestions[currentQuestion?.id] || false;

    const handleCodeChange = (newCode) => {
        if (isSubmitted) return;
        setCodes(prev => ({ ...prev, [currentQuestion.id]: newCode }));
    };

    const handleLanguageChange = (langId) => {
        if (isSubmitted) return;
        const template = codingService.getSupportedLanguages().find(l => l.id === langId)?.template || '';
        if (confirm('Change language? Your current code for this question will be reset to the template.')) {
            setLanguages(prev => ({ ...prev, [currentQuestion.id]: langId }));
            setCodes(prev => ({ ...prev, [currentQuestion.id]: template }));
            setRunResults(prev => ({ ...prev, [currentQuestion.id]: null }));
        }
    };

    const handleRunCode = async () => {
        if (running || isSubmitted) return;
        try {
            setRunning(true);
            setActiveResultTab('results');
            const res = await codingService.runCode({
                questionId: currentQuestion.id,
                sourceCode: currentCode,
                language: currentLanguage,
                mode: 'visible'
            });
            setRunResults(prev => ({ ...prev, [currentQuestion.id]: res.data }));
        } catch (error) {
            console.error('Error running code:', error);
            alert('Failed to run code: ' + (error.response?.data?.message || error.message));
        } finally {
            setRunning(false);
        }
    };

    const handleRunCustom = async () => {
        if (running || isSubmitted) return;
        try {
            setRunning(true);
            const input = customInputs[currentQuestion.id] || '';
            const res = await codingService.runCode({
                questionId: currentQuestion.id,
                sourceCode: currentCode,
                language: currentLanguage,
                mode: 'custom',
                customInput: input
            });
            setCustomOutputs(prev => ({ ...prev, [currentQuestion.id]: res.data }));
        } catch (error) {
            console.error('Error running custom input:', error);
            alert('Failed to run custom input: ' + (error.response?.data?.message || error.message));
        } finally {
            setRunning(false);
        }
    };

    const handleSubmitSolution = async () => {
        if (submitting || isSubmitted) return;
        if (!confirm('Submit your solution? You will not be able to edit it after submission.')) return;

        try {
            setSubmitting(true);
            const res = await codingService.submitCode({
                questionId: currentQuestion.id,
                testId: test.id,
                sourceCode: currentCode,
                language: currentLanguage
            });

            setResults(prev => ({ ...prev, [currentQuestion.id]: res.data }));
            setSubmittedQuestions(prev => ({ ...prev, [currentQuestion.id]: true }));
            setActiveResultTab('results');
        } catch (error) {
            console.error('Error submitting code:', error);
            alert('Failed to submit code: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleAutoSubmit = () => {
        alert('Time is up! Your current progress has been saved.');
        navigate('/user/coding-tests');
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    if (loading) return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 gap-6">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold font-mono tracking-tighter">INITIALIZING_SANDBOX</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Preparing your coding environment</p>
            </div>
        </div>
    );

    return (
        <div className={`h-screen flex flex-col bg-slate-50 text-slate-600 font-sans selection:bg-indigo-500/30 ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
            {/* Header - Fixed Height */}
            <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white shadow-sm backdrop-blur-md shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/user/coding-tests')}>
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
                            <Code className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-slate-900 tracking-tighter text-lg">CODE_FLOW</span>
                    </div>
                    <div className="h-6 w-px bg-slate-100"></div>
                    <div>
                        <h1 className="text-xs font-bold text-slate-600 uppercase tracking-widest">{test.title}</h1>
                        <p className="text-[10px] text-slate-500 font-bold">{test.job_title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-100/50 px-4 py-1.5 rounded-full border border-slate-200/50">
                        <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`} />
                        <span className={`font-mono font-bold text-sm ${timeLeft < 300 ? 'text-red-500' : 'text-slate-900'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/user/coding-tests')}
                        className="px-4 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg text-xs font-bold ring-1 ring-red-500/20"
                    >
                        Quit Test
                    </button>
                    <button onClick={toggleFullScreen} className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
                        {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Main Content - Takes remaining height */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Problem Statement - 1/3 width, scrollable */}
                <div className="w-1/3 border-r border-slate-200 overflow-y-auto p-6 bg-white">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-600/10 text-indigo-600 border border-indigo-500/20 rounded flex items-center justify-center text-xs font-bold font-mono">
                                Q{currentQuestionIndex + 1}
                            </span>
                            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">{currentQuestion.title}</span>
                        </div>
                        <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                            {currentQuestion.marks} PTS
                        </span>
                    </div>

                    <div className="space-y-6">
                        <article className="prose prose-sm max-w-none">
                            <h4 className="text-slate-900 text-sm font-bold mb-2 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Problem</h4>
                            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                                {currentQuestion.problem_statement}
                            </p>
                        </article>

                        {currentQuestion.input_format && (
                            <div className="space-y-3">
                                <h4 className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                                    Input Format
                                </h4>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 font-mono leading-relaxed">
                                    {currentQuestion.input_format}
                                </div>
                            </div>
                        )}

                        {currentQuestion.output_format && (
                            <div className="space-y-3">
                                <h4 className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                                    Output Format
                                </h4>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 font-mono leading-relaxed">
                                    {currentQuestion.output_format}
                                </div>
                            </div>
                        )}

                        {currentQuestion.constraints && (
                            <div className="space-y-3">
                                <h4 className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                                    Constraints
                                </h4>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 font-mono italic">
                                    {currentQuestion.constraints}
                                </div>
                            </div>
                        )}

                        {currentQuestion.sampleTestCases?.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                    Example
                                </h4>
                                {currentQuestion.sampleTestCases.map((tc, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-slate-100/50 rounded-lg p-3 ring-1 ring-slate-200">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                                    <ChevronRight className="w-3 h-3" /> Input
                                                </p>
                                                <pre className="text-xs text-slate-900 font-mono">{tc.input}</pre>
                                            </div>
                                            <div className="bg-slate-100/50 rounded-lg p-3 ring-1 ring-slate-200">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                                    <ChevronLeft className="w-3 h-3" /> Output
                                                </p>
                                                <pre className="text-xs text-slate-900 font-mono">{tc.expected_output}</pre>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Question Navigator - Fixed at bottom */}
                    <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 sticky bottom-0 bg-white/95 backdrop-blur-sm">
                        <button
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <button
                            disabled={currentQuestionIndex === test.questions.length - 1}
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-indigo-600"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right Panel: Editor & Results - 2/3 width */}
                <div className="flex flex-col flex-1 h-full min-w-0">
                    {/* Language Selector & Run Buttons - Fixed Height */}
                    <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 bg-white shadow-sm shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                {codingService.getSupportedLanguages().map(lang => (
                                    <button
                                        key={lang.id}
                                        onClick={() => handleLanguageChange(lang.id)}
                                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${currentLanguage === lang.id
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                            : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                    >
                                        {lang.id === 'python3' ? 'PY' : lang.id === 'cpp' ? 'C++' : lang.id === 'javascript' ? 'JS' : 'JAVA'}
                                    </button>
                                ))}
                            </div>
                            <div className="h-4 w-px bg-slate-100"></div>
                            <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Reset</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRunCode}
                                disabled={running || submitting || isSubmitted}
                                className="px-4 py-1.5 bg-white text-slate-700 hover:bg-slate-50 transition-all rounded-lg text-xs font-bold border border-slate-200 shadow-sm disabled:opacity-50"
                            >
                                <div className="flex items-center gap-2">
                                    <Play className="w-3.5 h-3.5 fill-current text-emerald-500" />
                                    Run Code
                                </div>
                            </button>
                            <button
                                onClick={handleSubmitSolution}
                                disabled={submitting || running || isSubmitted}
                                className={`px-6 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-all disabled:opacity-50 ${isSubmitted ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'}`}
                            >
                                <div className="flex items-center gap-2">
                                    {submitting ? (
                                        <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                    ) : (
                                        isSubmitted ? <CheckCircle className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />
                                    )}
                                    {isSubmitted ? 'Submitted' : 'Submit Solution'}
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 bg-slate-50 relative">
                        <MonacoCodeEditor
                            value={currentCode}
                            onChange={handleCodeChange}
                            language={currentLanguage}
                            height="100%"
                            theme="light"
                            readOnly={isSubmitted}
                        />
                        {isSubmitted && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none z-10 flex items-center justify-center">
                                <div className="bg-white border border-slate-200 shadow-xl px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl">
                                    <Award className="w-6 h-6 text-emerald-500" />
                                    <div className="text-left">
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Question Submitted</p>
                                        <p className="text-[10px] text-slate-500 font-bold">Code is now locked and evaluating.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Test Results Panel */}
                    <div className="h-64 border-t border-slate-200 bg-white shrink-0 flex flex-col">
                        <div className="h-10 border-b border-slate-200 px-4 flex items-center gap-6 shrink-0">
                            <button
                                onClick={() => setActiveResultTab('results')}
                                className={`h-10 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeResultTab === 'results' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                            >
                                Test Results
                            </button>
                            <button
                                onClick={() => setActiveResultTab('custom')}
                                className={`h-10 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeResultTab === 'custom' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                            >
                                Custom Input
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/20">
                            {activeResultTab === 'results' && (
                                <div className="space-y-4">
                                    {/* Evaluation Results (Visible after Submit) */}
                                    {isSubmitted && results[currentQuestion.id] && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                                                <div className="flex items-center gap-3">
                                                    <Award className="w-8 h-8 text-emerald-500" />
                                                    <div>
                                                        <p className="text-lg font-black text-slate-900 leading-tight">FINAL_SCORE: {results[currentQuestion.id].score}/{results[currentQuestion.id].maxScore}</p>
                                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                                            {results[currentQuestion.id].testCasesPassed} OF {results[currentQuestion.id].totalTestCases} CASES PASSED (SECURE_EVALUATION)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {results[currentQuestion.id].results?.map((res, idx) => (
                                                    <div key={idx} className="bg-slate-100/20 border border-slate-200/50 rounded-lg p-2.5 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${res.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                {res.passed ? '✓' : '✗'}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-600">Case #{res.testCaseIndex}</span>
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${res.passed ? 'text-emerald-500' : 'text-red-500'}`}>{res.passed ? 'PASS' : 'FAIL'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Run Code Results (Visible Test Cases) */}
                                    {!isSubmitted && (
                                        <div className="space-y-4">
                                            {!runResults[currentQuestion.id] && !running && (
                                                <div className="h-32 flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                                                    <Terminal className="w-8 h-8" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Run code to see sample test results</p>
                                                </div>
                                            )}

                                            {running && (
                                                <div className="h-32 flex flex-col items-center justify-center gap-4">
                                                    <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                                    <p className="text-[10px] font-black uppercase text-indigo-600 animate-pulse font-bold">Running Sample Tests...</p>
                                                </div>
                                            )}

                                            {runResults[currentQuestion.id] && !running && (
                                                <div className="space-y-3">
                                                    <div className="bg-slate-100/30 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-600">Sample Evaluation Results</span>
                                                        <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                            {runResults[currentQuestion.id].filter(r => r.passed).length} / {runResults[currentQuestion.id].length} PASSED
                                                        </span>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        {runResults[currentQuestion.id].map((res, idx) => (
                                                            <div key={idx} className="bg-slate-100/10 border border-slate-200/50 rounded-xl overflow-hidden">
                                                                <div className="px-4 py-2 flex items-center justify-between border-b border-slate-200/50">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-2 h-2 rounded-full ${res.passed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                                        <span className="text-xs font-bold text-slate-900">Sample Case #{res.testCaseIndex}</span>
                                                                    </div>
                                                                    <span className={`text-[10px] font-black uppercase ${res.passed ? 'text-emerald-500' : 'text-red-500'}`}>{res.passed ? 'Accepted' : 'Wrong Answer'}</span>
                                                                </div>
                                                                {!res.passed && (
                                                                    <div className="p-3 grid grid-cols-2 gap-3 text-[10px] font-mono leading-tight">
                                                                        <div className="space-y-1">
                                                                            <p className="text-slate-500 font-bold uppercase tracking-tighter">Expected</p>
                                                                            <div className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-600 overflow-x-auto">{res.expectedOutput}</div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-slate-500 font-bold uppercase tracking-tighter">Actual</p>
                                                                            <div className="bg-red-50 p-2 rounded border border-red-200 text-red-600 overflow-x-auto">{res.actualOutput || '<Empty>'}</div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {res.error && (
                                                                    <div className="px-3 pb-3">
                                                                        <div className="bg-red-50 p-2 rounded border border-red-200 text-red-500 text-[10px] font-mono overflow-x-auto truncate">{res.error}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeResultTab === 'custom' && (
                                <div className="h-full flex flex-col gap-4">
                                    <div className="flex-1 flex gap-4 min-h-0">
                                        <div className="flex-1 flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Input</label>
                                            <textarea
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:border-indigo-500 outline-none resize-none placeholder:text-neutral-800"
                                                placeholder="Enter custom input here..."
                                                value={customInputs[currentQuestion.id] || ''}
                                                onChange={(e) => setCustomInputs(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                                disabled={isSubmitted}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Output</label>
                                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono overflow-auto whitespace-pre custom-scrollbar">
                                                {customOutputs[currentQuestion.id]?.stdout || <span className="text-neutral-800 italic">No output yet</span>}
                                                {customOutputs[currentQuestion.id]?.stderr && <div className="text-red-500 border-t border-red-200 mt-2 pt-2">{customOutputs[currentQuestion.id].stderr}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    {!isSubmitted && (
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleRunCustom}
                                                disabled={running || isSubmitted}
                                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-2"
                                            >
                                                {running ? <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div> : <Terminal className="w-3.5 h-3.5" />}
                                                Test Custom Input
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            ` }} />
        </div>
    );
};

export default CodingTestAttempt;
