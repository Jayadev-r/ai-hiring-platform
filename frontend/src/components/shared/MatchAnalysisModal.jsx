
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Target, BarChart2, CheckCircle, AlertTriangle, Loader2, BookOpen, Rocket, ExternalLink, Info } from 'lucide-react';
import { Button } from '../ui';
import axios from '../../api/axios';

const MatchAnalysisModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingJobs, setFetchingJobs] = useState(false);
    const [result, setResult] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [jobSource, setJobSource] = useState('internal'); // 'internal' | 'external'
    const [searchFilters, setSearchFilters] = useState({ role: '', location: '' });
    const [selectedJobId, setSelectedJobId] = useState('');
    const [manualDescription, setManualDescription] = useState('');
    const [useProfileResume, setUseProfileResume] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (jobSource === 'internal') {
                fetchInternalJobs();
            }
        }
    }, [isOpen, jobSource]);

    const fetchInternalJobs = async () => {
        setFetchingJobs(true);
        try {
            const res = await axios.get('/jobs');
            if (res.data.success) {
                setJobs(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching internal jobs:', err);
        } finally {
            setFetchingJobs(false);
        }
    };

    const fetchExternalJobs = async () => {
        if (!searchFilters.role) {
            setError('Please enter a role to search for external jobs.');
            return;
        }
        setFetchingJobs(true);
        setError('');
        try {
            const res = await axios.get('/jobs/india', {
                params: {
                    role: searchFilters.role,
                    location: searchFilters.location
                }
            });
            if (res.data.success) {
                setJobs(res.data.data);
                if (res.data.data.length === 0) {
                    setError('No external jobs found for these criteria.');
                }
            }
        } catch (err) {
            console.error('Error fetching external jobs:', err);
            setError('Failed to fetch external jobs.');
        } finally {
            setFetchingJobs(false);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedJobId && !manualDescription) {
            setError('Please select a job or provide a description.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/ai/resume/analyze-match', {
                jobId: selectedJobId,
                jobDescription: manualDescription,
                useProfileResume
            });

            if (res.data.success) {
                setResult(res.data.data);
            } else {
                setError(res.data.error || 'Failed to analyze.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Server error during analysis.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col max-h-[95vh] relative" style={{ background: 'rgba(10,15,46,0.95)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
                <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between sticky top-0 z-10" style={{ background: 'rgba(10,15,46,0.98)' }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="font-heading text-xl font-bold text-white">AI Match Analysis</h2>
                            <p className="text-sm text-slate-500">Resume vs Job Fit Assessment</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/[0.08] rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl text-sm flex items-center gap-2" style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {!result ? (
                        <div className="space-y-6">
                            {/* Job Source Selection */}
                            <div className="flex p-1 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <button
                                    onClick={() => { setJobSource('internal'); setSelectedJobId(''); setJobs([]); }}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${jobSource === 'internal' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Internal Jobs (Portal)
                                </button>
                                <button
                                    onClick={() => { setJobSource('external'); setSelectedJobId(''); setJobs([]); }}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${jobSource === 'external' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    External Jobs (Adzuna/Jooble)
                                </button>
                            </div>

                            {jobSource === 'external' && (
                                <div className="p-4 rounded-2xl space-y-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.20)' }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1 ml-1">Job Role</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. React Developer"
                                                className="w-full p-2.5 rounded-xl text-sm text-white placeholder-slate-600"
                                                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                                                value={searchFilters.role}
                                                onChange={(e) => setSearchFilters(prev => ({ ...prev, role: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1 ml-1">Location</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Bangalore"
                                                className="w-full p-2.5 rounded-xl text-sm text-white placeholder-slate-600"
                                                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                                                value={searchFilters.location}
                                                onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={fetchExternalJobs}
                                        disabled={fetchingJobs}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-10 text-xs font-bold"
                                    >
                                        {fetchingJobs ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                                        Search External Postings
                                    </Button>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    {jobSource === 'internal' ? 'Select Internal Job' : 'Select Search Success'}
                                </label>
                                <select
                                    value={selectedJobId}
                                    onChange={(e) => setSelectedJobId(e.target.value)}
                                    disabled={fetchingJobs}
                                    className="w-full p-3 rounded-xl text-white text-sm"
                                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                                >
                                    <option value="" style={{ background: '#0a0f2e' }}>{fetchingJobs ? 'Fetching jobs...' : (jobSource === 'internal' ? 'Select an internal job...' : 'Select from search results...')}</option>
                                    {jobs.map(job => (
                                        <option key={job.job_id} value={job.job_id} style={{ background: '#0a0f2e' }}>
                                            {job.job_title} - {job.external_company_name || job.company_name || 'Generic Company'} ({job.location})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/[0.06]" />
                                <span className="relative z-10 px-4 text-xs font-bold text-slate-600 uppercase mx-auto block w-fit" style={{ background: 'rgba(10,15,46,0.95)' }}>OR</span>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Paste Job Description</label>
                                <textarea
                                    value={manualDescription}
                                    onChange={(e) => setManualDescription(e.target.value)}
                                    placeholder="Paste the job description here if it's not listed above..."
                                    className="w-full p-4 rounded-xl min-h-[150px] transition-all text-sm text-slate-200 placeholder-slate-600 resize-none"
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-xl text-sm" style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.20)', color: '#93c5fd' }}>
                                <Info className="w-5 h-5 shrink-0" />
                                <p>Our Llama 3.3 AI will compare your profile resume against this job to identify matches, gaps, and bridge recommendations.</p>
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                disabled={loading || fetchingJobs}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <BarChart2 className="w-5 h-5 mr-2" />
                                        Run Match Analysis
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                            {/* Score Header */}
                            <div className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="60" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                                        <circle cx="64" cy="64" r="60" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset={377 - (377 * result.match_percentage) / 100} className="transition-all duration-1000 ease-out" />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-3xl font-bold text-white">{result.match_percentage}%</span>
                                        <span className="text-xs text-slate-500 font-bold uppercase">Fit</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Analysis Result</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{result.overall_reasoning}</p>
                                </div>
                            </div>

                            {/* Skills Analysis */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-5 rounded-2xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.20)' }}>
                                    <h4 className="flex items-center gap-2 mb-4 text-emerald-400 font-bold">
                                        <CheckCircle className="w-5 h-5" />
                                        Matching Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.skill_analysis.matching_skills.map(s => (
                                            <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.30)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}>
                                    <h4 className="flex items-center gap-2 mb-4 text-amber-400 font-bold">
                                        <AlertTriangle className="w-5 h-5" />
                                        Missing Keywords
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.skill_analysis.missing_skills.map(s => (
                                            <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Gap Bridging - Projects & Courses */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                                        <Rocket className="w-5 h-5 text-blue-600" />
                                        Bridging the Gap
                                    </h4>
                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">AI Recommendations</span>
                                </div>

                                <div className="space-y-4">
                                    {result.gap_bridging.map((bridge, idx) => (
                                        <div key={idx} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                <span className="text-sm font-bold text-slate-300">Missing Skill: <span className="text-cyan-400">{bridge.missing_skill}</span></span>
                                            </div>
                                            <div className="p-5 grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
                                                        <Rocket className="w-3 h-3" /> Recommended Project
                                                    </div>
                                                    <h5 className="font-bold text-white mb-1">{bridge.recommended_project.title}</h5>
                                                    <p className="text-sm text-slate-400 mb-3">{bridge.recommended_project.description}</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {bridge.recommended_project.tech_stack.map(t => (
                                                            <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 uppercase" style={{ background: 'rgba(255,255,255,0.08)' }}>{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
                                                        <BookOpen className="w-3 h-3" /> Learning Resources
                                                    </div>
                                                    {bridge.learning_resources.map((resource, rIdx) => (
                                                        <a
                                                            key={rIdx}
                                                            href="#"
                                                            className="flex items-center justify-between p-3 rounded-xl transition-all group"
                                                            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                                                            onClick={(e) => e.preventDefault()}
                                                        >
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-200 line-clamp-1">{resource.title}</p>
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase">{resource.platform} • {resource.type}</p>
                                                            </div>
                                                            <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={() => setResult(null)} className="w-full py-3 font-bold" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8' }}>
                                Analyze Another Match
                            </Button>
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="absolute inset-0 backdrop-blur-[3px] flex items-center justify-center z-50" style={{ background: 'rgba(8,12,35,0.7)' }}>
                        <div className="p-8 rounded-3xl flex flex-col items-center animate-in zoom-in-95" style={{ background: 'rgba(10,15,46,0.96)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
                            <div className="relative mb-6">
                                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                                <Target className="w-6 h-6 text-emerald-500 absolute inset-0 m-auto" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">AI Analyzing...</h3>
                            <p className="text-slate-500 text-sm max-w-[200px] text-center">Comparing your experience with job requirements</p>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default MatchAnalysisModal;
