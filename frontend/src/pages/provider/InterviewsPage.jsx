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

    // Filtered lists
    const upcomingInterviews = interviews.filter(i => new Date(i.interview_date) >= new Date());
    const pastInterviews = interviews.filter(i => new Date(i.interview_date) < new Date());

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
    };

    const startInterview = async (interviewId) => {
        try {
            toast.info('Initializing secure meeting environment...');
            const res = await api.post(`/interviews/${interviewId}/start`);
            if (res.data.success) {
                window.open(`/interview-room/${res.data.room_id}`, '_blank');
            }
        } catch (error) {
            toast.error('Handshake failed. Check room availability.');
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
                            {['upcoming', 'completed', 'all'].map((tab) => (
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

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="wait">
                            {interviews.length > 0 ? (
                                interviews.map((session, idx) => (
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
                                                    {new Date(session.interview_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} at {session.start_time}
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
                                                    onClick={() => startInterview(session.id)}
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
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </ProviderLayout>
    );
};

export default InterviewsPage;
