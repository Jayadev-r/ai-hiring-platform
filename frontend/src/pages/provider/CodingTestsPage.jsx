import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    ChevronDown,
    Code,
    Eye,
    Send,
    CheckCircle,
    X,
    FileCode,
    Clock,
    Calendar,
    Users,
    Award,
    ChevronRight,
    Edit3,
    Save,
    Info,
    AlertCircle,
    Terminal,
    Target,
    Briefcase,
    Settings2,
    Sparkles,
    ChevronLeft,
    CheckCircle2
} from 'lucide-react';
import { ProviderLayout } from '../../components/provider-layout';
import { StatusBadge, SkeletonCard, TopProgressBar, DataTable } from '../../components/provider-ui';
import codingService from '../../services/codingService';
import SubmissionCodeModal from '../../components/coding/SubmissionCodeModal';
import axios from '../../api/axios';
import { useProviderToast } from '../../contexts/ProviderToastContext';

const CodingTestsPage = () => {
    const navigate = useNavigate();
    const { addToast } = useProviderToast();

    // View State
    const [activeTab, setActiveTab] = useState('list'); // list | create | edit | results
    const [editingTestId, setEditingTestId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [tests, setTests] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');

    // Form State
    const [testForm, setTestForm] = useState({
        title: '',
        description: '',
        timeLimit: 60,
        totalMarks: 100
    });
    const [questions, setQuestions] = useState([
        {
            title: '',
            problemStatement: '',
            inputFormat: '',
            outputFormat: '',
            constraints: '',
            marks: 50,
            testCases: [{ input: '', expectedOutput: '', isHidden: false }]
        }
    ]);

    // Results state
    const [selectedTest, setSelectedTest] = useState(null);
    const [results, setResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(false);
    const [codeModalOpen, setCodeModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [loadingSubmission, setLoadingSubmission] = useState(false);

    useEffect(() => {
        fetchTests();
        fetchJobs();
    }, []);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const res = await codingService.getRecruiterCodingTests();
            setTests(res.data || []);
        } catch (error) {
            addToast('error', 'Failed to synchronize algorithmic challenges');
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            const res = await axios.get('/jobs/recruiter');
            setJobs(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedJobId) return addToast('warning', 'Link this challenge to a position');

        setSaving(true);
        try {
            const payload = { jobId: selectedJobId, ...testForm, questions };
            if (editingTestId) {
                await codingService.updateCodingTest(editingTestId, payload);
                addToast('success', 'Algorithm challenge updated');
            } else {
                await codingService.createCodingTest(payload);
                addToast('success', 'Algorithm challenge deployed');
            }
            setActiveTab('list');
            fetchTests();
            resetForm();
        } catch (error) {
            addToast('error', 'Failed to deploy verification engine');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setEditingTestId(null);
        setSelectedJobId('');
        setTestForm({ title: '', description: '', timeLimit: 60, totalMarks: 100 });
        setQuestions([{
            title: '', problemStatement: '', inputFormat: '', outputFormat: '', constraints: '', marks: 50,
            testCases: [{ input: '', expectedOutput: '', isHidden: false }]
        }]);
    };

    const handleEdit = async (test) => {
        try {
            const res = await codingService.getCodingTestById(test.id);
            const data = res.data;
            setEditingTestId(data.id);
            setSelectedJobId(data.job_id);
            setTestForm({
                title: data.title,
                description: data.description,
                timeLimit: data.time_limit,
                totalMarks: data.total_marks
            });
            setQuestions(data.questions.map(q => ({
                title: q.title,
                problemStatement: q.problem_statement,
                inputFormat: q.input_format,
                outputFormat: q.output_format,
                constraints: q.constraints,
                marks: q.marks,
                testCases: q.testCases.map(tc => ({
                    input: tc.input,
                    expectedOutput: tc.expected_output,
                    isHidden: tc.is_hidden
                }))
            })));
            setActiveTab('edit');
        } catch (error) {
            addToast('error', 'Failed to retrieve challenge blueprint');
        }
    };

    const handleViewResults = async (test) => {
        try {
            setLoadingResults(true);
            setSelectedTest(test);
            setActiveTab('results');
            const res = await codingService.getCodingTestResults(test.id);
            setResults(res.data || []);
        } catch (error) {
            addToast('error', 'Failed to aggregate submission data');
        } finally {
            setLoadingResults(false);
        }
    };

    const handleViewCode = async (submissionId) => {
        try {
            setLoadingSubmission(true);
            const res = await codingService.getSubmissionById(submissionId);
            setSelectedSubmission(res.data);
            setCodeModalOpen(true);
        } catch (error) {
            addToast('error', 'Failed to decompile submission');
        } finally {
            setLoadingSubmission(false);
        }
    };

    const updateQuestion = (idx, field, value) => {
        const updated = [...questions];
        updated[idx] = { ...updated[idx], [field]: value };
        setQuestions(updated);
    };

    const updateTestCase = (qIdx, tcIdx, field, value) => {
        const updated = [...questions];
        updated[qIdx].testCases[tcIdx] = { ...updated[qIdx].testCases[tcIdx], [field]: value };
        setQuestions(updated);
    };

    const renderList = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-provider-blue-600 mb-1">
                        <Terminal className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Algorithmic Verification</span>
                    </div>
                    <h1 className="text-3xl font-black text-provider-slate-900 tracking-tight">
                        Coding <span className="text-provider-blue-600">Arena</span>
                    </h1>
                </div>
                <button
                    onClick={() => { setActiveTab('create'); resetForm(); }}
                    className="provider-btn-primary px-6 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Engineer New Challenge
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : tests.length === 0 ? (
                <div className="provider-panel p-20 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-provider-slate-100 text-provider-slate-400 flex items-center justify-center mx-auto mb-6">
                        <Code className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-provider-slate-900 mb-2">No Challenges Configured</h3>
                    <p className="text-provider-slate-500 font-medium mb-8 max-w-sm mx-auto">Deploy algorithmic challenges to test candidate implementation skills.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tests.map(test => (
                        <div key={test.id} className="provider-panel p-6 flex items-center justify-between group">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-black text-provider-slate-900 text-lg group-hover:text-provider-blue-600 transition-colors uppercase tracking-tight">{test.title}</h3>
                                    <StatusBadge status={test.status === 'published' ? 'active' : 'draft'}>{test.status}</StatusBadge>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-provider-slate-400 uppercase tracking-tighter mb-4">
                                    <Briefcase className="w-3 h-3" /> {test.job_title || 'General Assessment'}
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-provider-slate-600">
                                        <Clock className="w-3.5 h-3.5 text-provider-blue-500" />
                                        {test.time_limit} Mins
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-provider-slate-600">
                                        <Award className="w-3.5 h-3.5 text-provider-blue-500" />
                                        {test.total_marks} Marks
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-provider-slate-600">
                                        <Users className="w-3.5 h-3.5 text-provider-blue-500" />
                                        {test.candidates_attempted} Attempts
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {test.status === 'published' ? (
                                    <button
                                        onClick={() => handleViewResults(test)}
                                        className="p-2.5 rounded-xl bg-provider-blue-50 text-provider-blue-600 hover:bg-provider-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest px-4"
                                    >
                                        <Eye className="w-4 h-4" /> Result Intelligence
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEdit(test)}
                                            className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => codingService.publishCodingTest(test.id).then(fetchTests)}
                                            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest px-4"
                                        >
                                            Launch
                                        </button>
                                    </>
                                )}
                                <button className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderForm = () => (
        <div className="max-w-[1000px] mx-auto pb-32">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setActiveTab('list')}
                        className="w-12 h-12 rounded-2xl bg-white border border-provider-slate-200 flex items-center justify-center text-provider-slate-400 hover:text-provider-blue-600 transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-provider-blue-600 mb-1">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Algorithm Architect</span>
                        </div>
                        <h1 className="text-3xl font-black text-provider-slate-900 tracking-tight">
                            Build <span className="text-provider-blue-600">Challenge</span>
                        </h1>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="provider-panel p-8">
                    <h3 className="text-xs font-black text-provider-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-provider-blue-600 text-white flex items-center justify-center text-[10px]">01</span>
                        Global Parameters
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest mb-2 block">Link to Position</label>
                            <select
                                value={selectedJobId}
                                onChange={(e) => setSelectedJobId(e.target.value)}
                                className="provider-input font-bold"
                            >
                                <option value="">Select a listing...</option>
                                {jobs.map(j => <option key={j.job_id} value={j.job_id}>{j.job_title} at {j.company}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-provider-slate-400 uppercase mb-2 block">Test Designation</label>
                            <input className="provider-input font-bold" value={testForm.title} onChange={e => setTestForm({ ...testForm, title: e.target.value })} placeholder="e.g. Senior Backend Algorithm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-provider-slate-400 uppercase mb-2 block">Time (Min)</label>
                                <input className="provider-input font-bold" type="number" value={testForm.timeLimit} onChange={e => setTestForm({ ...testForm, timeLimit: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-provider-slate-400 uppercase mb-2 block">Total Marks</label>
                                <input className="provider-input font-bold" type="number" value={testForm.totalMarks} onChange={e => setTestForm({ ...testForm, totalMarks: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xs font-black text-provider-slate-900 uppercase tracking-widest flex items-center gap-2 px-4">
                        <span className="w-6 h-6 rounded-lg bg-provider-blue-600 text-white flex items-center justify-center text-[10px]">02</span>
                        Logical Challenges
                    </h3>

                    {questions.map((q, idx) => (
                        <div key={idx} className="provider-panel p-8 relative group">
                            <div className="flex items-start gap-6">
                                <div className="w-10 h-10 rounded-2xl bg-provider-blue-50 text-provider-blue-600 flex items-center justify-center font-black flex-shrink-0">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-4 gap-6">
                                        <div className="col-span-3">
                                            <label className="text-[10px] font-black text-provider-slate-400 uppercase mb-2 block">Question Title</label>
                                            <input className="provider-input font-bold text-sm" value={q.title} onChange={e => updateQuestion(idx, 'title', e.target.value)} placeholder="e.g. Balanced Binary Tree" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-provider-slate-400 uppercase mb-2 block">Points</label>
                                            <input className="provider-input font-bold" type="number" value={q.marks} onChange={e => updateQuestion(idx, 'marks', e.target.value)} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-provider-slate-400 uppercase mb-2 block">Problem Specification</label>
                                        <textarea
                                            className="provider-input font-bold text-xs min-h-[150px] leading-relaxed font-mono"
                                            value={q.problemStatement}
                                            onChange={e => updateQuestion(idx, 'problemStatement', e.target.value)}
                                            placeholder="Markdown supported problem description..."
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest">Verification Cases</label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...questions];
                                                    updated[idx].testCases.push({ input: '', expectedOutput: '', isHidden: false });
                                                    setQuestions(updated);
                                                }}
                                                className="text-[10px] font-black text-provider-blue-600 uppercase tracking-widest border-b border-provider-blue-200"
                                            >
                                                + Add Case
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {q.testCases.map((tc, tcIdx) => (
                                                <div key={tcIdx} className="p-4 bg-provider-slate-50/50 rounded-2xl border border-provider-slate-100 flex items-start gap-4 h-24">
                                                    <textarea
                                                        className="flex-1 provider-input text-[10px] font-mono p-2 h-full bg-white resize-none"
                                                        value={tc.input}
                                                        onChange={e => updateTestCase(idx, tcIdx, 'input', e.target.value)}
                                                        placeholder="Input Data"
                                                    />
                                                    <textarea
                                                        className="flex-1 provider-input text-[10px] font-mono p-2 h-full bg-white resize-none"
                                                        value={tc.expectedOutput}
                                                        onChange={e => updateTestCase(idx, tcIdx, 'expectedOutput', e.target.value)}
                                                        placeholder="Expected Output"
                                                    />
                                                    <div className="flex flex-col items-center gap-2 pt-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${tc.isHidden ? 'bg-provider-blue-600 border-provider-blue-600' : 'bg-white border-provider-slate-300'}`}>
                                                                {tc.isHidden && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <input type="checkbox" className="hidden" checked={tc.isHidden} onChange={e => updateTestCase(idx, tcIdx, 'isHidden', e.target.checked)} />
                                                            <span className="text-[9px] font-black text-provider-slate-400 uppercase tracking-tighter">Private</span>
                                                        </label>
                                                        <button type="button" onClick={() => {
                                                            const updated = [...questions];
                                                            updated[idx].testCases = updated[idx].testCases.filter((_, i) => i !== tcIdx);
                                                            setQuestions(updated);
                                                        }} className="text-rose-400 hover:text-rose-600">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                                className="absolute top-4 right-4 text-provider-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => setQuestions([...questions, { title: '', problemStatement: '', inputFormat: '', outputFormat: '', constraints: '', marks: 50, testCases: [{ input: '', expectedOutput: '', isHidden: false }] }])}
                        className="w-full py-6 border-2 border-dashed border-provider-slate-200 rounded-3xl text-provider-slate-400 font-black text-xs uppercase tracking-widest hover:border-provider-blue-400 hover:text-provider-blue-600 hover:bg-provider-blue-50/50 transition-all flex items-center justify-center gap-3"
                    >
                        <Plus className="w-5 h-5" /> Vectorize New Question
                    </button>
                </section>

                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-provider-slate-100 flex items-center justify-end gap-4 z-50">
                    <button type="button" onClick={() => setActiveTab('list')} className="provider-btn-secondary px-8 font-black uppercase text-xs">Abort</button>
                    <button type="submit" disabled={saving} className="provider-btn-primary px-12 font-black uppercase text-xs shadow-xl shadow-provider-blue-200">
                        {saving ? 'Processing...' : 'Deploy Arena'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderResults = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                    <button onClick={() => setActiveTab('list')} className="w-12 h-12 rounded-2xl bg-white border border-provider-slate-200 flex items-center justify-center text-provider-slate-400 hover:text-provider-blue-600 transition-all shadow-sm">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-provider-blue-600 mb-1">
                            <Terminal className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Submission Intelligence</span>
                        </div>
                        <h1 className="text-3xl font-black text-provider-slate-900 tracking-tight">Challenge <span className="text-provider-blue-600">Analytics</span></h1>
                        <div className="text-xs font-bold text-provider-slate-400 mt-1">{selectedTest?.title}</div>
                    </div>
                </div>
            </div>

            <div className="provider-panel overflow-hidden border-none shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-provider-slate-50 border-b border-provider-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-provider-slate-400 uppercase tracking-widest">Engineer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-provider-slate-400 uppercase tracking-widest">Problem</th>
                                <th className="px-6 py-4 text-[10px] font-black text-provider-slate-400 uppercase tracking-widest text-center">Lang</th>
                                <th className="px-6 py-4 text-[10px] font-black text-provider-slate-400 uppercase tracking-widest text-center">Efficiency</th>
                                <th className="px-6 py-4 text-[10px] font-black text-provider-slate-400 uppercase tracking-widest text-center">Passed</th>
                                <th className="px-6 py-4 text-[10px] font-black text-provider-slate-400 uppercase tracking-widest text-right">Time</th>
                                <th className="px-6 py-4 text-[10px] font-black text-provider-slate-400 uppercase tracking-widest text-right">Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-provider-slate-50">
                            {results.map((r, idx) => (
                                <tr key={idx} className="hover:bg-provider-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-provider-slate-900 text-xs">{r.candidate_name}</div>
                                        <div className="text-[9px] font-bold text-provider-slate-400">{r.candidate_email}</div>
                                    </td>
                                    <td className="px-6 py-4 truncate max-w-[150px] text-xs font-bold text-provider-slate-600">{r.question_title}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-[10px] font-black px-2 py-1 rounded bg-provider-slate-100 text-provider-slate-500 uppercase font-mono">{r.language}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${parseFloat(r.score) >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-provider-blue-50 text-provider-blue-600'}`}>
                                            {Math.round(r.score)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs font-black text-provider-slate-900">{r.test_cases_passed}/{r.total_test_cases}</td>
                                    <td className="px-6 py-4 text-right text-[10px] font-bold text-provider-slate-400">{new Date(r.submitted_at).toLocaleTimeString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleViewCode(r.submission_id)} className="p-2 rounded-lg bg-provider-slate-50 text-provider-slate-400 hover:bg-provider-blue-600 hover:text-white transition-all shadow-sm">
                                            <FileCode className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <ProviderLayout>
            {(loading || saving || loadingSubmission) && <TopProgressBar />}
            <div className="max-w-[1400px] mx-auto px-6 py-10">
                {activeTab === 'list' && renderList()}
                {(activeTab === 'create' || activeTab === 'edit') && renderForm()}
                {activeTab === 'results' && renderResults()}
            </div>

            <SubmissionCodeModal
                open={codeModalOpen}
                onClose={() => setCodeModalOpen(false)}
                submission={selectedSubmission}
            />
        </ProviderLayout>
    );
};

export default CodingTestsPage;
