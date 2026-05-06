import React, { useState, useEffect } from 'react';
import {
    Video,
    Calendar,
    Users,
    Plus,
    XCircle,
    Copy,
    ExternalLink,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpRight,
    MapPin,
    Sparkles,
    ChevronRight,
    LayoutGrid,
    ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProviderLayout } from '../../components/provider-layout';
import { StatusBadge, TopProgressBar } from '../../components/provider-ui';
import { useProviderToast } from '../../contexts/ProviderToastContext';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import ScheduleInterviewModal from '../../components/shared/ScheduleInterviewModal';

/**
 * Smart Interview Portfolio
 * Rebuilt as a high-fidelity hub for managing the interview lifecycle.
 */
const InterviewsPage = () => {
    const { user } = useAuth();
    const toast = useProviderToast();
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [interviews, setInterviews] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isScheduling, setIsScheduling] = useState(false);
    
    // New state for applicants
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [selectedApplicantForSchedule, setSelectedApplicantForSchedule] = useState(null);

    // Local time parser
    const getLocalInterviewDate = (interview) => {
        if (!interview.interview_date || !interview.start_time) return null;
        
        let datePart = '';
        if (typeof interview.interview_date === 'string') {
            datePart = interview.interview_date.split('T')[0];
        } else {
            const d = new Date(interview.interview_date);
            datePart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }
        
        const timePart = interview.start_time.substring(0, 5); // "HH:MM"
        
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        
        return new Date(year, month - 1, day, hour, minute, 0);
    };

    // Filtered lists
    const upcomingInterviews = interviews.filter(i => {
        if (i.status === 'completed' || i.status === 'cancelled') return false;
        if (i.status === 'in_progress') return true;
        const interviewTime = getLocalInterviewDate(i);
        if (!interviewTime) return true; // Default to showing if missing time
        
        // Show in upcoming if the interview is today or in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        return interviewTime >= today;
    });
    
    const pastInterviews = interviews.filter(i => {
        if (i.status === 'completed' || i.status === 'cancelled') return true;
        if (i.status === 'in_progress') return false;
        const interviewTime = getLocalInterviewDate(i);
        if (!interviewTime) return false;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        return interviewTime < today;
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            // Fetch recruiter's jobs to populate the filter dropdown
            const jobsRes = await api.get('/jobs/recruiter');
            if (jobsRes.data?.success) {
                setJobs(jobsRes.data.data);
                if (jobsRes.data.data.length > 0) {
                    setSelectedJobId(jobsRes.data.data[0].job_id);
                    fetchInterviews(jobsRes.data.data[0].job_id);
                }
            }
        } catch (error) {
            toast.error('Data synchronization protocol failed.');
        } finally {
            setLoading(false);
        }
    };

    const fetchInterviews = async (jobId) => {
        try {
            const res = await api.get(`/interviews/job/${jobId}`);
            if (res.data.success) {
                setInterviews(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to retrieve interview sessions.');
        }
    };

    const handleJobChange = (e) => {
        const id = e.target.value;
        setSelectedJobId(id);
        fetchInterviews(id);
        if (activeTab === 'applicants') {
            fetchJobApplicants(id);
        }
    };

    const fetchJobApplicants = async (jobId) => {
        if (!jobId) return;
        try {
            setLoadingApplicants(true);
            const res = await api.get(`/recruiter/jobs/${jobId}/applications`);
            if (res.data.success) {
                setApplicants(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
            toast.error('Failed to load candidate roster.');
        } finally {
            setLoadingApplicants(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'applicants' && selectedJobId) {
            fetchJobApplicants(selectedJobId);
        }
    }, [activeTab, selectedJobId]);

    const startInterview = async (interview) => {
        if (!interview.channel_name) {
            toast.error('Interview room not initialized.');
            return;
        }
        // Mark as in_progress so the candidate sees "Join Live Interview"
        try {
            await api.put(`/interviews/start/${interview.id}`);
            fetchInterviews(selectedJobId);
        } catch (err) {
            console.warn('Could not set in_progress status:', err);
        }
        window.open(`/interview/${interview.channel_name}`, '_blank');
    };


    const handleScheduleClick = (applicant) => {
        setSelectedApplicantForSchedule(applicant);
        setIsScheduling(true);
    };

    const handleStartNow = async (applicant) => {
        try {
            toast.info('Initializing immediate session...');
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
            const endTimeStr = new Date(now.getTime() + 60 * 60 * 1000).toTimeString().split(' ')[0].substring(0, 5);

            if (!applicant.candidate_id) {
                toast.error('Candidate ID missing. Cannot start session.');
                return;
            }

            const payload = {
                jobId: selectedJobId,
                applicationId: applicant.id,
                candidateId: applicant.candidate_id,
                interviewDate: dateStr,
                startTime: timeStr,
                endTime: endTimeStr
            };

            const res = await api.post('/interviews/create-and-schedule', payload);
            if (res.data.success) {
                const interviewId = res.data.data?.id;
                // Mark the interview as in_progress so the candidate can join immediately
                if (interviewId) {
                    try {
                        await api.put(`/interviews/start/${interviewId}`);
                    } catch (startErr) {
                        console.warn('Could not mark interview as in_progress:', startErr);
                    }
                }
                toast.success('Session generated. Candidate can join now.');
                fetchInterviews(selectedJobId);
                // Navigate to the room if channel_name is returned
                if (res.data.data?.channel_name) {
                    window.open(`/interview/${res.data.data.channel_name}`, '_blank');
                }
            }
        } catch (error) {
            toast.error('Failed to launch immediate session.');
        }
    };


    return (
        <ProviderLayout>
            <TopProgressBar loading={loading} />

            <div className="max-w-[1400px] mx-auto px-6 py-10">
                {/* Header Context */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-provider-blue-600 mb-1">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-provider-blue-600">Session Hub</span>
                        </div>
                        <h1 className="text-4xl font-black text-provider-slate-900 tracking-tight">
                            Smart <span className="text-provider-blue-600">Interviews</span>
                        </h1>
                        <p className="text-sm font-medium text-provider-slate-400 mt-2">Manage live sessions, evaluate candidate DNA, and handle real-time room generation.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-all rounded-full" />
                            <select
                                value={selectedJobId}
                                onChange={handleJobChange}
                                className="relative bg-white border border-provider-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-provider-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-provider-blue-500 appearance-none min-w-[280px]"
                            >
                                {jobs.map(job => (
                                    <option key={job.job_id} value={job.job_id}>{job.job_title}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => setIsScheduling(true)}
                            className="provider-btn-primary h-14 px-8 rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-200"
                        >
                            <Calendar className="w-5 h-5" />
                            <span className="font-black uppercase text-xs tracking-widest">Schedule Protocol</span>
                        </button>
                    </div>
                </div>


                {/* Portfolio Content */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-provider-slate-100 pb-0 shadow-[inset_0_-1px_0_0_#f1f5f9]">
                        <div className="flex gap-10">
                            {['upcoming', 'applicants', 'completed', 'all'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-xs font-black uppercase tracking-widest relative ${activeTab === tab ? 'text-provider-blue-600' : 'text-provider-slate-400'}`}
                                >
                                    {tab} Sessions
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-provider-blue-600 rounded-t-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 pb-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-provider-slate-50 rounded-xl border border-provider-slate-100 text-provider-slate-400 text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-white transition-all">
                                <ListFilter className="w-4 h-4" /> Filter Matrix
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <AnimatePresence mode="wait">
                            {(activeTab === 'upcoming' || activeTab === 'completed' || activeTab === 'all') && (
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                >
                                    {(activeTab === 'upcoming' ? upcomingInterviews : activeTab === 'completed' ? pastInterviews : interviews).length > 0 ? (
                                        (activeTab === 'upcoming' ? upcomingInterviews : activeTab === 'completed' ? pastInterviews : interviews).map((session, idx) => (
                                            <motion.div
                                                key={session.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="provider-panel group hover:shadow-xl transition-all border-l-4 border-l-provider-blue-600 p-0 overflow-hidden"
                                            >
                                                <div className="p-8">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-provider-slate-50 flex items-center justify-center text-xl font-black text-provider-slate-900 border border-provider-slate-100 group-hover:bg-provider-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                                                                {session.candidate_name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-provider-slate-900 tracking-tight leading-none mb-1">{session.candidate_name}</h4>
                                                                <div className="text-[10px] font-bold text-provider-slate-400 uppercase tracking-widest">{session.candidate_email}</div>
                                                            </div>
                                                        </div>
                                                        <div className="p-2 rounded-xl bg-provider-slate-50 text-provider-slate-400 group-hover:text-provider-blue-600 transition-colors">
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 mb-8">
                                                        <div className="flex items-center gap-3 text-xs font-bold text-provider-slate-600 capitalize">
                                                            <Calendar className="w-4 h-4 text-provider-blue-600" />
                                                            {getLocalInterviewDate(session) ? getLocalInterviewDate(session).toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) : 'Date TBD'} at {session.start_time}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs font-bold text-provider-slate-600">
                                                            <Video className="w-4 h-4 text-provider-blue-600" />
                                                            Secure Interview Room #102
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button className="provider-btn-secondary h-12 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                                            Details <ArrowUpRight className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => startInterview(session)}
                                                            className="provider-btn-primary h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700"
                                                        >
                                                            Start Now <ExternalLink className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-24 flex flex-col items-center text-center">
                                            <div className="w-24 h-24 bg-provider-slate-50 rounded-full flex items-center justify-center mb-6">
                                                <Video className="w-10 h-10 text-provider-slate-200" />
                                            </div>
                                            <h3 className="text-xl font-black text-provider-slate-900 tracking-tight">No Active Sessions Detected</h3>
                                            <p className="text-sm text-provider-slate-400 mt-2 max-w-xs">Initialize the scheduling protocol to begin candidate evaluation.</p>
                                            <button
                                                onClick={() => setIsScheduling(true)}
                                                className="mt-8 px-8 py-4 bg-white border border-provider-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-provider-blue-400 transition-all shadow-sm"
                                            >
                                                Initialize Protocol
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'applicants' && (
                                <motion.div
                                    key="applicants"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-4"
                                >
                                    {loadingApplicants ? (
                                        <div className="p-12 text-center text-provider-slate-400 font-bold">Synchronizing candidate roster...</div>
                                    ) : applicants.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {applicants.map((app) => {
                                                const appInterview = interviews.find(i => i.application_id === app.id || i.candidate_id === app.candidate_id);
                                                const isScheduled = appInterview && ['scheduled', 'in_progress'].includes(appInterview.status);

                                                return (
                                                <div key={app.id} className="provider-panel p-6 flex items-center justify-between group hover:border-provider-blue-200 transition-all">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-provider-slate-100 flex items-center justify-center text-provider-slate-400 font-black text-xl overflow-hidden">
                                                            {app.avatar ? <img src={app.avatar} className="w-full h-full object-cover" /> : app.candidate_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-black text-provider-slate-900 text-lg">{app.candidate_name}</h3>
                                                                <StatusBadge status={app.status} />
                                                            </div>
                                                            <div className="text-xs font-bold text-provider-slate-400 mt-1">{app.candidate_email} • Match Score: <span className="text-provider-blue-600">{app.match_score}%</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {isScheduled ? (
                                                            <>
                                                                <div className="px-4 py-3 bg-provider-slate-50 border border-provider-slate-200 rounded-xl text-xs font-bold text-provider-slate-600 flex items-center gap-2">
                                                                    <Calendar className="w-3.5 h-3.5 text-provider-blue-600" />
                                                                    {getLocalInterviewDate(appInterview) ? getLocalInterviewDate(appInterview).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} at {appInterview.start_time}
                                                                </div>
                                                                <button 
                                                                    onClick={() => startInterview(appInterview)}
                                                                    className="px-6 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                                                >
                                                                    <Video className="w-4 h-4" /> {appInterview.status === 'in_progress' ? 'Join Live' : 'Start'}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleStartNow(app)}
                                                                    className="px-6 py-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                                                >
                                                                    <Video className="w-4 h-4" /> Start Now
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleScheduleClick(app)}
                                                                    className="px-6 py-3 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                                                >
                                                                    <Calendar className="w-4 h-4" /> Schedule
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-20 text-center provider-panel border-dashed">
                                            <Users className="w-12 h-12 text-provider-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-black text-provider-slate-900">No applicants yet</h3>
                                            <p className="text-xs font-bold text-provider-slate-400 mt-2 uppercase tracking-widest">Candidates will appear here once they apply to this position</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <ScheduleInterviewModal 
                isOpen={isScheduling}
                onClose={() => { setIsScheduling(false); setSelectedApplicantForSchedule(null); }}
                applicant={selectedApplicantForSchedule}
                jobId={selectedJobId}
                onSuccess={() => fetchInterviews(selectedJobId)}
            />
        </ProviderLayout>
    );
};

export default InterviewsPage;
