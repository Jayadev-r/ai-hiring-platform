import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Briefcase, Building2, User } from 'lucide-react';
import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import AILoader from '../../components/futuristic/AILoader';
import { getCandidateInterviews } from '../../services/interviewService';

const InterviewsPage = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchInterviews(); }, []);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const response = await getCandidateInterviews();
            setInterviews(response.data || []);
        } catch (error) {
            console.error('Error fetching interviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinInterview = (channelName, scheduledAt) => {
        const interviewTime = new Date(scheduledAt);
        const now = new Date();
        const timeDiff = (interviewTime - now) / (1000 * 60);
        if (timeDiff > 10) { alert(`Interview starts in ${Math.round(timeDiff)} minutes. You can join 10 minutes before.`); return; }
        if (timeDiff < -60) { alert('This interview has ended.'); return; }
        window.location.href = `/interview/${channelName}`;
    };

    const formatDate = (date) => {
        if (!date) return 'Not scheduled';
        return new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };
    const formatTime = (time) => time ? time.substring(0, 5) : '';

    const canJoin = (scheduledAt, status) => {
        if (status !== 'scheduled') return false;
        const diff = (new Date(scheduledAt) - new Date()) / (1000 * 60);
        return diff <= 15 && diff >= -120;
    };

    const statusConfig = {
        pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
        scheduled: { label: 'Scheduled', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
        completed: { label: 'Completed', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
        cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
    };

    return (
        <UserLayout>
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <Video className="w-6 h-6 text-indigo-600" />
                    <h1 className="font-heading text-4xl font-bold text-slate-900">My Interviews</h1>
                </div>
                <p className="text-slate-500">View and join your scheduled interviews</p>
            </motion.div>

            {loading ? (
                <AILoader text="Loading interviews..." size="md" />
            ) : interviews.length === 0 ? (
                <GlassCard padding="lg" className="text-center py-20">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No interviews scheduled</h3>
                    <p className="text-slate-500">Your upcoming interviews will appear here</p>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    {interviews.map((interview, i) => {
                        const sc = statusConfig[interview.status] || statusConfig.pending;
                        const joinable = canJoin(interview.scheduled_at, interview.status);
                        return (
                            <motion.div
                                key={interview.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                            >
                                <GlassCard hover glow="purple" padding="md" animate={false}>
                                    <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Briefcase className="w-4 h-4 text-indigo-600" />
                                                <h3 className="font-heading font-semibold text-slate-900 text-lg">{interview.job_title}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                                <Building2 className="w-3.5 h-3.5" />{interview.company_name}
                                            </div>
                                            {interview.recruiter_name && (
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <User className="w-3.5 h-3.5" />Interviewer: {interview.recruiter_name}
                                                </div>
                                            )}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.border} ${sc.color}`}>
                                            {sc.label}
                                        </span>
                                    </div>

                                    {interview.status === 'scheduled' && (
                                        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500">Date</p>
                                                    <p className="text-xs font-medium text-slate-900">{formatDate(interview.interview_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500">Time</p>
                                                    <p className="text-xs font-medium text-slate-900">
                                                        {formatTime(interview.start_time)} – {formatTime(interview.end_time)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {interview.status === 'scheduled' && (
                                        joinable ? (
                                            <motion.button
                                                onClick={() => handleJoinInterview(interview.channel_name, interview.scheduled_at)}
                                                className="bg-indigo-600 text-white hover:bg-indigo-700 w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm"
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                animate={{ boxShadow: ['0 0 16px rgba(79,70,229,0.4)', '0 0 28px rgba(79,70,229,0.7)', '0 0 16px rgba(79,70,229,0.4)'] }}
                                                transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
                                            >
                                                <Video className="w-5 h-5" /> Join Interview
                                            </motion.button>
                                        ) : (
                                            <button disabled className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-500 cursor-not-allowed font-semibold text-sm">
                                                <Video className="w-5 h-5" /> Interview Not Started
                                            </button>
                                        )
                                    )}

                                    {interview.status === 'pending' && (
                                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                                            <p className="text-xs text-amber-700 font-medium">⏳ Your interview is being scheduled. You'll be notified once confirmed.</p>
                                        </div>
                                    )}
                                    {interview.status === 'cancelled' && (
                                        <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                                            <p className="text-xs text-red-700 font-medium">✗ This interview has been cancelled. Please contact the recruiter.</p>
                                        </div>
                                    )}
                                    {interview.status === 'completed' && (
                                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                                            <p className="text-xs text-blue-700 font-medium">✓ Interview completed. Thank you for your participation!</p>
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </UserLayout>
    );
};

export default InterviewsPage;
