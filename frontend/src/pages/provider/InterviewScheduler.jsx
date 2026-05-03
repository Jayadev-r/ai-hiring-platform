import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    CheckCircle2,
    ArrowLeft,
    UserPlus,
    X,
    Coffee,
    Link,
    MapPin,
    Video,
    Briefcase,
    CalendarCheck,
    Users2,
    Settings2,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    Copy,
    Share2,
    LayoutDashboard,
    Play
} from 'lucide-react';
import { ProviderLayout } from '../../components/provider-layout';
import { StatusBadge, SkeletonCard, TopProgressBar } from '../../components/provider-ui';
import { useProviderToast } from '../../contexts/ProviderToastContext';
import api from '../../api/axios';

const InterviewScheduler = () => {
    const navigate = useNavigate();
    const { addToast } = useProviderToast();

    // Core State
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [topCandidates, setTopCandidates] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(false);
    const [scheduling, setScheduling] = useState(false);
    const [scheduledData, setScheduledData] = useState(null);
    const [candidateLimit, setCandidateLimit] = useState(10);

    // Config State
    const [interviewDate, setInterviewDate] = useState('');
    const [startTime, setStartTime] = useState('10:00');
    const [slotDuration, setSlotDuration] = useState(45);
    const [mode, setMode] = useState('online');
    const [meetingLink, setMeetingLink] = useState('');
    const [breakDuration, setBreakDuration] = useState(15);
    const [breakFrequency, setBreakFrequency] = useState(3);

    // Interviewer State
    const [interviewers, setInterviewers] = useState([]);
    const [newInName, setNewInName] = useState('');
    const [newInEmail, setNewInEmail] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/ai-tools/jobs');
                if (response.data.success) setJobs(response.data.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                addToast('error', 'Failed to load positions');
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        if (!selectedJobId) {
            setTopCandidates([]);
            setScheduledData(null);
            return;
        }

        const fetchCandidates = async () => {
            setLoadingCandidates(true);
            try {
                const response = await api.get(`/ai-tools/jobs/${selectedJobId}/candidates`);
                if (response.data.success) {
                    const aiRanked = response.data.data
                        .filter(c => c.match_score !== null && c.shortlisted_by_ai)
                        .slice(0, candidateLimit === 0 ? undefined : candidateLimit);
                    setTopCandidates(aiRanked);
                }
            } catch (error) {
                console.error('Error fetching candidates:', error);
                addToast('error', 'Failed to fetch candidate pool');
            } finally {
                setLoadingCandidates(false);
            }
        };
        fetchCandidates();
    }, [selectedJobId, candidateLimit]);

    const handleAddInterviewer = () => {
        if (!newInName.trim() || !newInEmail.trim()) return;
        setInterviewers([...interviewers, { name: newInName, email: newInEmail }]);
        setNewInName('');
        setNewInEmail('');
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        if (interviewers.length === 0) return addToast('warning', 'Add at least one interviewer');

        setScheduling(true);
        try {
            const response = await api.post(`/interviews/auto-schedule`, {
                jobId: selectedJobId,
                config: {
                    interviewDate,
                    startTime,
                    slotDuration,
                    mode,
                    meetingLink: mode === 'online' ? meetingLink : null,
                    breakDuration,
                    breakFrequency
                },
                interviewers,
                candidateCount: candidateLimit
            });

            if (response.data.success) {
                setScheduledData(response.data.data);
                addToast('success', 'Interview campaign launched!');
            }
        } catch (error) {
            console.error('Scheduling error:', error);
            addToast('error', error.response?.data?.message || 'Failed to orchestrate schedule');
        } finally {
            setScheduling(false);
        }
    };

    return (
        <ProviderLayout>
            {(loadingJobs || loadingCandidates || scheduling) && <TopProgressBar progress={scheduling ? 70 : 40} />}

            <div className="max-w-[1400px] mx-auto px-6 py-10">
                {/* Header Area */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/provider/ai-tools')}
                            className="w-12 h-12 rounded-2xl bg-white border border-provider-slate-200 flex items-center justify-center text-provider-slate-400 hover:text-provider-blue-600 hover:border-provider-blue-200 transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-provider-blue-600 mb-1">
                                <CalendarCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Orchestration Module</span>
                            </div>
                            <h1 className="text-3xl font-black text-provider-slate-900 tracking-tight">
                                Smart <span className="text-provider-blue-600">Interview Scheduler</span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Configuration (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Step 1: Position & Pool */}
                        <section className="provider-panel p-8">
                            <h3 className="text-xs font-black text-provider-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-provider-blue-600 text-white flex items-center justify-center text-[10px]">01</span>
                                Position & Candidate Pool
                            </h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter mb-2 block">Target Job Posting</label>
                                    <select
                                        value={selectedJobId}
                                        onChange={(e) => setSelectedJobId(e.target.value)}
                                        className="provider-input font-bold"
                                    >
                                        <option value="">Choose a listing...</option>
                                        {jobs.map(j => (
                                            <option key={j.job_id} value={j.job_id}>{j.job_title} ({j.applicant_count} apps)</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter mb-2 block">Candidate Selection</label>
                                    <select
                                        value={candidateLimit}
                                        onChange={(e) => setCandidateLimit(Number(e.target.value))}
                                        className="provider-input font-bold"
                                    >
                                        <option value={5}>Top 5 Ranked</option>
                                        <option value={10}>Top 10 Ranked</option>
                                        <option value={20}>Top 20 Ranked</option>
                                        <option value={0}>All AI-Recommended</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Step 2: Scheduling Logic */}
                        {selectedJobId && (
                            <section className="provider-panel p-8">
                                <h3 className="text-xs font-black text-provider-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-provider-blue-600 text-white flex items-center justify-center text-[10px]">02</span>
                                    Scheduling Logic
                                </h3>

                                <div className="grid md:grid-cols-3 gap-6 mb-8">
                                    <div>
                                        <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter mb-2 block">Campaign Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-provider-blue-600" />
                                            <input
                                                type="date"
                                                value={interviewDate}
                                                onChange={(e) => setInterviewDate(e.target.value)}
                                                className="provider-input pl-11 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter mb-2 block">Start Window</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-provider-blue-600" />
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="provider-input pl-11 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter mb-2 block">Slot Duration</label>
                                        <select
                                            value={slotDuration}
                                            onChange={(e) => setSlotDuration(Number(e.target.value))}
                                            className="provider-input font-bold"
                                        >
                                            <option value={30}>30 Minutes</option>
                                            <option value={45}>45 Minutes (Recommended)</option>
                                            <option value={60}>60 Minutes</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 border-t border-provider-slate-100 pt-8">
                                    <div>
                                        <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter mb-4 block">Interview Type</label>
                                        <div className="flex gap-4">
                                            {['online', 'offline'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setMode(m)}
                                                    className={`flex-1 py-3 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${mode === m
                                                        ? 'bg-provider-blue-50 border-provider-blue-200 text-provider-blue-700'
                                                        : 'bg-white border-provider-slate-200 text-provider-slate-500 hover:border-provider-slate-300'
                                                        }`}
                                                >
                                                    {m === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                    {m.charAt(0).toUpperCase() + m.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        {mode === 'online' && (
                                            <div className="relative">
                                                <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-provider-blue-600" />
                                                <input
                                                    type="url"
                                                    placeholder="Meeting Link (GMeet, Zoom...)"
                                                    value={meetingLink}
                                                    onChange={(e) => setMeetingLink(e.target.value)}
                                                    className="provider-input pl-11 font-bold"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Step 3: Interviewer Squad */}
                        {selectedJobId && (
                            <section className="provider-panel p-8">
                                <h3 className="text-xs font-black text-provider-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-provider-blue-600 text-white flex items-center justify-center text-[10px]">03</span>
                                    Interviewer Squad
                                </h3>
                                <p className="text-xs text-provider-slate-400 font-bold mb-8 ml-8">Interviews will be balanced automatically using Round-Robin logic.</p>

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Interviewer Name"
                                            value={newInName}
                                            onChange={(e) => setNewInName(e.target.value)}
                                            className="provider-input font-bold"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                placeholder="Corporate Email"
                                                value={newInEmail}
                                                onChange={(e) => setNewInEmail(e.target.value)}
                                                className="provider-input flex-1 font-bold"
                                            />
                                            <button
                                                onClick={handleAddInterviewer}
                                                className="px-4 bg-provider-blue-600 text-white rounded-xl hover:bg-provider-blue-700 transition-all shadow-sm"
                                            >
                                                <UserPlus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <AnimatePresence>
                                            {interviewers.map((inv, idx) => (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    key={idx}
                                                    className="bg-provider-slate-50 border border-provider-slate-200 px-4 py-2 rounded-xl flex items-center gap-3"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-provider-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase">
                                                        {inv.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black text-provider-slate-900">{inv.name}</div>
                                                        <div className="text-[10px] font-bold text-provider-slate-400">{inv.email}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => setInterviewers(interviewers.filter((_, i) => i !== idx))}
                                                        className="p-1 text-provider-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Execution & Preview */}
                    <div className="lg:col-span-4 space-y-6 sticky top-24">
                        <section className="provider-panel p-6 bg-provider-blue-900 text-white border-none">
                            <h3 className="text-xs font-black uppercase tracking-widest text-provider-blue-300 mb-6">Orchestration Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-xs font-bold text-provider-blue-300 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Pool Size</span>
                                    <span className="text-sm font-black">{topCandidates.length} Candidates</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-xs font-bold text-provider-blue-300 flex items-center gap-2"><Users2 className="w-3.5 h-3.5" /> Squad Size</span>
                                    <span className="text-sm font-black">{interviewers.length} Reviewers</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-xs font-bold text-provider-blue-300 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Est. Time</span>
                                    <span className="text-sm font-black text-provider-blue-400">
                                        {topCandidates.length > 0 ? (topCandidates.length * slotDuration) : 0} Minutes
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSchedule}
                                disabled={!selectedJobId || topCandidates.length === 0 || scheduling}
                                className="w-full py-4 bg-provider-blue-500 hover:bg-provider-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-provider-blue-950 transition-all flex items-center justify-center gap-2 disabled:bg-white/10 disabled:text-white/20"
                            >
                                {scheduling ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                Launch Campaign
                            </motion.button>
                        </section>

                        <section className="provider-panel p-6">
                            <h3 className="text-xs font-black text-provider-slate-900 uppercase tracking-widest mb-6">Candidate Preview</h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {loadingCandidates ? (
                                    <div className="space-y-2">
                                        {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-provider-slate-100 rounded-lg animate-pulse" />)}
                                    </div>
                                ) : topCandidates.map((c, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-provider-slate-50 border border-provider-slate-100">
                                        <div className="w-6 h-6 rounded-lg bg-provider-slate-200 text-[10px] font-black flex items-center justify-center text-provider-slate-500">#{idx + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-provider-slate-900 truncate">{c.candidate_name}</div>
                                            <div className="text-[10px] font-bold text-provider-blue-600 uppercase tracking-tighter">{c.match_score}% Match</div>
                                        </div>
                                    </div>
                                ))}
                                {topCandidates.length === 0 && (
                                    <div className="py-6 text-center text-provider-slate-400 text-xs font-bold italic">No candidates selected</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Final Success View */}
                <AnimatePresence>
                    {scheduledData && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 provider-panel p-10 border-2 border-green-500/20 bg-green-500/5"
                        >
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="w-16 h-16 rounded-3xl bg-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-200">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-black text-provider-slate-900 mb-2">Scheduling Successful!</h2>
                                    <p className="text-provider-slate-500 font-medium mb-8">All invites have been dispatched. The timeline has been synchronized with the team.</p>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                        <div className="bg-white p-4 rounded-2xl border border-provider-slate-200 shadow-sm">
                                            <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest block mb-1 font-mono">Position</label>
                                            <div className="text-sm font-black text-provider-slate-900">{scheduledData.jobTitle}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-provider-slate-200 shadow-sm">
                                            <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest block mb-1 font-mono">Window Open</label>
                                            <div className="text-sm font-black text-provider-slate-900">{new Date(scheduledData.interviewDate).toLocaleDateString()}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-provider-slate-200 shadow-sm">
                                            <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest block mb-1 font-mono">Sessions</label>
                                            <div className="text-sm font-black text-provider-slate-900">{scheduledData.scheduledInterviews.length} Booked</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-provider-slate-200 shadow-sm">
                                            <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest block mb-1 font-mono">Platform</label>
                                            <div className="text-sm font-black text-provider-slate-900 capitalize">{scheduledData.mode}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-provider-slate-400 uppercase tracking-tighter block ml-2">Session Timeline</label>
                                        {scheduledData.scheduledInterviews.map((slot, sidx) => (
                                            <div key={sidx} className="bg-white flex items-center justify-between p-4 rounded-2xl border border-provider-slate-100 shadow-sm group hover:border-provider-blue-300 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-provider-slate-50 text-provider-slate-400 flex items-center justify-center text-xs font-black">{sidx + 1}</div>
                                                    <div>
                                                        <div className="text-sm font-black text-provider-slate-900">{slot.candidateName}</div>
                                                        <div className="text-[10px] font-bold text-provider-slate-400">Panel: {slot.interviewerName}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-black text-provider-blue-600 bg-provider-blue-50 px-4 py-1.5 rounded-xl border border-provider-blue-100">
                                                    {slot.timeSlot}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ProviderLayout>
    );
};

export default InterviewScheduler;
