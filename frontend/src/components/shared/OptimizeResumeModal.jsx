
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Sparkles, Check, FileText, Loader2, RefreshCw, Download, AlertCircle, User, PenTool, File, ArrowLeft } from 'lucide-react';
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
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col h-[90vh] bg-white shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-indigo-600 mr-1"
                            title="Back"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="font-heading text-xl font-bold text-slate-900">AI Resume Optimizer</h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Groq Llama 3 • JSON Structured Engine</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden flex">
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="max-w-2xl mx-auto space-y-8">

                            {/* Optimization Mode */}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Optimization Goal</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setMode('general')}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === 'general' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-purple-200'}`}
                                    >
                                        <div className={`font-bold mb-1 ${mode === 'general' ? 'text-purple-700' : 'text-slate-700'}`}>General Professional</div>
                                        <div className="text-xs text-slate-500 font-medium leading-relaxed">Polish grammar, impact, and standardize format.</div>
                                    </button>
                                    <button
                                        onClick={() => setMode('targeted')}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === 'targeted' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-purple-200'}`}
                                    >
                                        <div className={`font-bold mb-1 ${mode === 'targeted' ? 'text-purple-700' : 'text-slate-700'}`}>Targeted Role</div>
                                        <div className="text-xs text-slate-500 font-medium leading-relaxed">Tailor for a specific job match from our database.</div>
                                    </button>
                                </div>

                                {mode === 'targeted' && (
                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Select Target Job</label>
                                        <select
                                            value={selectedJobId}
                                            onChange={(e) => setSelectedJobId(e.target.value)}
                                            className="w-full p-3 rounded-xl text-slate-900 text-sm border border-slate-200 bg-slate-50 focus:border-purple-500 outline-none"
                                        >
                                            <option value="">-- Select a Job from Database --</option>
                                            {jobs.map(job => (
                                                <option key={job.job_id} value={job.job_id}>
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
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Source Resume</label>
                                <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                                    <button
                                        onClick={() => setResumeSource('profile')}
                                        className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${resumeSource === 'profile' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <User className="w-4 h-4" /> Use Profile
                                    </button>
                                    <button
                                        onClick={() => setResumeSource('upload')}
                                        className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${resumeSource === 'upload' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Upload className="w-4 h-4" /> Upload
                                    </button>
                                    <button
                                        onClick={() => setResumeSource('text')}
                                        className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${resumeSource === 'text' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <PenTool className="w-4 h-4" /> Paste
                                    </button>
                                </div>

                                <div className="mt-4 min-h-[150px]">
                                    {resumeSource === 'profile' && (
                                        <div className="rounded-2xl p-6 flex items-center gap-4 bg-purple-50 border border-purple-100">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-50">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">Current Profile Resume</h4>
                                                <p className="text-sm text-slate-500 font-medium mt-0.5">We'll use the resume currently linked to your candidate profile.</p>
                                            </div>
                                        </div>
                                    )}

                                    {resumeSource === 'upload' && (
                                        <div className="border-2 border-dashed rounded-2xl p-8 text-center transition-all border-purple-200 bg-purple-50/30 hover:bg-purple-50 hover:border-purple-300">
                                            <input type="file" accept=".pdf,.docx" onChange={handleFileChange} id="resume-upload" className="hidden" />
                                            <label htmlFor="resume-upload" className="cursor-pointer block">
                                                <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                                                <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">PDF or DOCX (Max 5MB)</p>
                                                {resumeFile && (
                                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white text-purple-700 rounded-full text-xs font-bold border border-purple-200 shadow-sm">
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
                                                className="w-full h-48 p-4 rounded-2xl font-mono text-sm resize-none text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:border-purple-500 outline-none"
                                            />
                                            <p className="text-[10px] text-slate-500 font-bold uppercase text-right">{resumeText.length}/12000 chars</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl p-4 flex gap-3 items-start bg-indigo-50 border border-indigo-100">
                                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-indigo-700 font-medium">
                                    <strong>Ready for Editing:</strong> After optimization, a full-screen editor will open where you can refine AI suggestions before saving.
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl flex items-center gap-2 text-sm bg-red-50 border border-red-100 text-red-600 font-bold">
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
