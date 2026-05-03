
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Sparkles, Check, FileText, Loader2, RefreshCw, Download, AlertCircle, User, PenTool, File } from 'lucide-react';
import { Button } from '../ui';
import axios from '../../api/axios';
import ResumeEditor from './ResumeEditor';

const OptimizeResumeModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Result
    const [resumeSource, setResumeSource] = useState('profile'); // 'profile', 'upload', 'text'
    const [resumeText, setResumeText] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [result, setResult] = useState(null);
    const [mode, setMode] = useState('general'); // 'general' or 'targeted'
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [error, setError] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // Fetch jobs when mode changes to targeted
    React.useEffect(() => {
        if (mode === 'targeted' && jobs.length === 0) {
            fetchJobs();
        }
    }, [mode]);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('/jobs?status=Open');
            if (response.data.success) {
                setJobs(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setResumeFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleOptimize = async () => {
        // Validation
        if (resumeSource === 'text' && (!resumeText || resumeText.length < 50)) {
            setError('Please enter a valid resume text (at least 50 characters).');
            return;
        }
        if (resumeSource === 'upload' && !resumeFile) {
            setError('Please upload a PDF or DOCX resume.');
            return;
        }
        if (mode === 'targeted' && !selectedJobId) {
            setError('Please select a target job for optimization.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            // Add Resume Source
            if (resumeSource === 'upload') {
                formData.append('resumeFile', resumeFile);
            } else if (resumeSource === 'profile') {
                formData.append('useProfileResume', 'true');
            } else {
                formData.append('resumeText', resumeText);
            }

            // Add Job Context
            if (mode === 'targeted' && selectedJobId) {
                formData.append('jobId', selectedJobId);
            }

            const response = await axios.post('/ai/resume/optimize', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setResult(response.data.data);
                setIsEditorOpen(true);
            }
        } catch (err) {
            console.error('Optimization Failed:', err);
            setError(err.response?.data?.error || 'Failed to optimize resume. Please check your input or try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (isEditorOpen && result) {
        return (
            <ResumeEditor
                isOpen={isEditorOpen}
                originalText={result.original_text}
                optimizedData={result}
                onClose={() => setIsEditorOpen(false)}
                onSaveSuccess={() => {
                    alert('Resume saved to your profile!');
                    setIsEditorOpen(false);
                    onClose();
                }}
            />
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center font-sans">
            <div className="w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col h-[90vh]" style={{ background: 'rgba(10,15,46,0.95)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0" style={{ background: 'rgba(10,15,46,0.98)' }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="font-heading text-xl font-bold text-white">AI Resume Optimizer</h2>
                            <p className="text-sm text-slate-500">Groq Llama 3 • JSON Structured Engine</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/[0.08] rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden flex">
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="max-w-2xl mx-auto space-y-8">

                            {/* Optimization Mode */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-300">Optimization Goal</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setMode('general')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'general' ? 'border-purple-500 bg-purple-500/10' : 'border-white/[0.08] bg-white/[0.03] hover:border-purple-500/50'}`}
                                    >
                                        <div className="font-semibold text-white mb-1">General Professional</div>
                                        <div className="text-xs text-slate-500">Polish grammar, impact, and standardize format.</div>
                                    </button>
                                    <button
                                        onClick={() => setMode('targeted')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'targeted' ? 'border-purple-500 bg-purple-500/10' : 'border-white/[0.08] bg-white/[0.03] hover:border-purple-500/50'}`}
                                    >
                                        <div className="font-semibold text-white mb-1">Targeted Role</div>
                                        <div className="text-xs text-slate-500">Tailor for a specific job match.</div>
                                    </button>
                                </div>

                                {mode === 'targeted' && (
                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Select Target Job</label>
                                        <select
                                            value={selectedJobId}
                                            onChange={(e) => setSelectedJobId(e.target.value)}
                                            className="w-full p-3 rounded-lg text-white text-sm"
                                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                                        >
                                            <option value="" style={{ background: '#0a0f2e' }}>-- Select a Job from Database --</option>
                                            {jobs.map(job => (
                                                <option key={job.job_id} value={job.job_id} style={{ background: '#0a0f2e' }}>
                                                    {job.job_title} - {job.company_name || 'My Company'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/[0.06] my-6"></div>

                            {/* Resume Source Tabs */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-300">Source Resume</label>
                                <div className="flex p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <button
                                        onClick={() => setResumeSource('profile')}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${resumeSource === 'profile' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <User className="w-4 h-4" /> Use Existing Profile
                                    </button>
                                    <button
                                        onClick={() => setResumeSource('upload')}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${resumeSource === 'upload' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <Upload className="w-4 h-4" /> Upload File
                                    </button>
                                    <button
                                        onClick={() => setResumeSource('text')}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${resumeSource === 'text' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <PenTool className="w-4 h-4" /> Paste Text
                                    </button>
                                </div>

                                <div className="mt-4 min-h-[150px]">
                                    {resumeSource === 'profile' && (
                                        <div className="rounded-xl p-6 flex items-center gap-4" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
                                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">Current Profile Resume</h4>
                                                <p className="text-sm text-purple-300 mt-1">We'll use the resume currently linked to your candidate profile.</p>
                                            </div>
                                        </div>
                                    )}

                                    {resumeSource === 'upload' && (
                                        <div className="border-2 border-dashed rounded-xl p-8 text-center transition-all" style={{ borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.05)' }}>
                                            <input type="file" accept=".pdf,.docx" onChange={handleFileChange} id="resume-upload" className="hidden" />
                                            <label htmlFor="resume-upload" className="cursor-pointer block">
                                                <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                                                <p className="text-sm font-medium text-slate-300">Click to upload or drag and drop</p>
                                                <p className="text-xs text-slate-600 mt-1">PDF or DOCX (Max 5MB)</p>
                                                {resumeFile && (
                                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                                                        <File className="w-4 h-4" /> {resumeFile.name}
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    )}

                                    {resumeSource === 'text' && (
                                        <div className="space-y-2">
                                            <textarea
                                                value={resumeText}
                                                onChange={(e) => setResumeText(e.target.value)}
                                                placeholder="Paste your resume text here..."
                                                className="w-full h-48 p-4 rounded-xl font-mono text-sm resize-none text-slate-200 placeholder-slate-600"
                                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                                            />
                                            <p className="text-xs text-slate-600 text-right">{resumeText.length}/12000 chars</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg p-4 flex gap-3 items-start" style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.25)' }}>
                                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-300">
                                    <strong>Ready for Editing:</strong> After optimization, a full-screen editor will open where you can refine AI suggestions before saving.
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 rounded-lg flex items-center gap-2 text-sm" style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={handleOptimize}
                                disabled={loading}
                                className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-500 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                        Running Groq AI Analysis...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-3" />
                                        Optimize Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default OptimizeResumeModal;
