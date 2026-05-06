import React, { useState } from 'react';
import { X, Calendar, Clock, Video, User, Briefcase } from 'lucide-react';
import axios from '../../api/axios';
import { useProviderToast } from '../../contexts/ProviderToastContext';

const ScheduleInterviewModal = ({ isOpen, onClose, applicant, jobId, onSuccess }) => {
    const { addToast } = useProviderToast();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        interviewDate: '',
        startTime: '',
        endTime: ''
    });

    if (!isOpen || !applicant) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.interviewDate || !formData.startTime || !formData.endTime) {
            addToast('warning', 'Please fill in all scheduling fields');
            return;
        }

        const candidateId = applicant.candidate_id || applicant.user_id;
        if (!candidateId) {
            addToast('error', 'Candidate information is missing');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                jobId: jobId || applicant.job_id,
                applicationId: applicant.id,
                candidateId: candidateId,
                ...formData
            };

            const response = await axios.post('/interviews/create-and-schedule', payload);
            
            if (response.data.success) {
                addToast('success', 'Interview scheduled successfully');
                if (onSuccess) onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Scheduling error:', error);
            addToast('error', error.response?.data?.message || 'Failed to schedule interview');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/[0.1]" style={{ background: 'rgba(15,20,55,0.95)' }}>
                {/* Header */}
                <div className="p-6 border-b border-white/[0.08] flex justify-between items-center" style={{ background: 'rgba(10,15,46,0.95)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                            <Video className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">Schedule <span className="text-amber-500">Interview</span></h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Session Coordination</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Candidate Info Card */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-black text-lg">
                            {applicant.candidate_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-sm font-black text-white">{applicant.candidate_name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{applicant.job_title || 'Target Role'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Interview Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                <input 
                                    type="date" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-amber-500/50 transition-all"
                                    value={formData.interviewDate}
                                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Start Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                    <input 
                                        type="time" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-amber-500/50 transition-all"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">End Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                    <input 
                                        type="time" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-amber-500/50 transition-all"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 py-4 rounded-2xl bg-amber-500 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
                        >
                            {loading ? 'Processing...' : 'Confirm Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleInterviewModal;
