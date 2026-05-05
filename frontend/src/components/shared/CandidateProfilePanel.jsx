import { useState, useEffect } from 'react';
import { X, User, CheckCircle2, Video, Code, Star, XCircle } from 'lucide-react';
import { getApplicationProfileSnapshot, getApplicationResume } from '../../api/applications';
import CandidateProfileContent from './CandidateProfileContent';

/**
 * CandidateProfilePanel
 * A side-panel component for recruiters to view a candidate's profile snapshot.
 * Fully theme-aware — adapts to active theme via CSS variables.
 */
const CandidateProfilePanel = ({ applicationId, isOpen, onClose, onUpdateStatus, candidateName = 'Candidate', initialData = null, initialResumeUrl = null }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [isSnapshot, setIsSnapshot] = useState(false);
    const [snapshotDate, setSnapshotDate] = useState(null);
    const [resumeUrl, setResumeUrl] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setProfileData(initialData);
                setLoading(false);
                if (initialResumeUrl) setResumeUrl(initialResumeUrl);
            } else if (applicationId) {
                fetchProfileSnapshot();
                fetchResume();
            }
        }
    }, [isOpen, applicationId, initialData, initialResumeUrl]);

    const fetchProfileSnapshot = async () => {
        if (initialData) return;
        try {
            setLoading(true);
            setError('');
            const response = await getApplicationProfileSnapshot(applicationId);
            if (response.success) {
                setProfileData(response.data.snapshot);
                setIsSnapshot(response.data.is_snapshot);
                setSnapshotDate(response.data.snapshot_date);
            }
        } catch (err) {
            console.error('Error fetching profile snapshot:', err);
            setError('Failed to load candidate profile.');
        } finally {
            setLoading(false);
        }
    };

    const fetchResume = async () => {
        try {
            const blob = await getApplicationResume(applicationId);
            if (blob && blob.size > 0) {
                const url = URL.createObjectURL(blob);
                setResumeUrl(url);
            }
        } catch (err) {
            console.error('Failed to fetch resume:', err);
        }
    };

    const handleViewResume = () => {
        if (resumeUrl) {
            window.open(resumeUrl, '_blank');
        }
    };

    if (!isOpen) return null;

    const info = profileData?.personal_info || {};

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                onClick={onClose}
            />

            {/* Side Panel */}
            <div
                className="relative w-full max-w-2xl shadow-2xl h-full flex flex-col transform transition-transform duration-300"
                style={{
                    backgroundColor: 'var(--theme-card-bg, #ffffff)',
                    borderLeft: '1px solid var(--theme-border, #e2e8f0)',
                }}
            >
                {/* Header */}
                <div
                    className="flex-none p-6 flex justify-between items-start"
                    style={{
                        backgroundColor: 'var(--theme-bg, #f8fafc)',
                        borderBottom: '1px solid var(--theme-border, #e2e8f0)',
                    }}
                >
                    <div className="flex items-center gap-4">
                        {profileData?.profile_image_url ? (
                            <img
                                src={profileData.profile_image_url}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover"
                                style={{ border: '1px solid var(--theme-border, #e2e8f0)' }}
                            />
                        ) : (
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: 'var(--theme-hover, #eef2ff)',
                                    color: 'var(--theme-primary, #4F46E5)',
                                    border: '1px solid var(--theme-border, #e2e8f0)',
                                }}
                            >
                                <User className="w-6 h-6" />
                            </div>
                        )}
                        <div>
                            <h2
                                className="text-xl font-bold tracking-tight"
                                style={{ color: 'var(--theme-text-primary, #0f172a)' }}
                            >
                                {info.name || candidateName}
                            </h2>
                            <p
                                className="text-sm font-medium uppercase tracking-widest mt-0.5"
                                style={{ color: 'var(--theme-text-secondary, #475569)' }}
                            >
                                {info.title || info.job_title || 'Candidate Profile'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg shadow-sm transition-colors"
                        style={{
                            color: 'var(--theme-text-secondary, #64748b)',
                            backgroundColor: 'var(--theme-card-bg, #ffffff)',
                            border: '1px solid var(--theme-border, #e2e8f0)',
                        }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content area: Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 provider-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4"
                            style={{ color: 'var(--theme-text-secondary, #94a3b8)' }}
                        >
                            <div
                                className="w-8 h-8 rounded-full animate-spin"
                                style={{
                                    borderWidth: '4px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--theme-border, #bfdbfe)',
                                    borderTopColor: 'var(--theme-primary, #2563eb)',
                                }}
                            />
                            <p className="font-medium text-sm">Loading candidate profile data...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 font-medium" style={{ color: '#ef4444' }}>
                            {error}
                        </div>
                    ) : (
                        <CandidateProfileContent
                            data={profileData}
                            resumeUrl={resumeUrl}
                            onViewResume={handleViewResume}
                            isSnapshot={isSnapshot}
                            snapshotDate={snapshotDate}
                        />
                    )}
                </div>

                {/* Footer Actions */}
                {!loading && !error && onUpdateStatus && (
                    <div 
                        className="flex-none p-4 flex flex-wrap items-center justify-center gap-3"
                        style={{ 
                            backgroundColor: 'var(--theme-bg, #f8fafc)',
                            borderTop: '1px solid var(--theme-border, #e2e8f0)' 
                        }}
                    >
                        <button
                            onClick={() => { onUpdateStatus(applicationId, 'accepted'); onClose(); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Hire
                        </button>
                        <button
                            onClick={() => { onUpdateStatus(applicationId, 'interview'); onClose(); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border border-amber-100"
                        >
                            <Video className="w-3.5 h-3.5" /> Interview
                        </button>
                        <button
                            onClick={() => { onUpdateStatus(applicationId, 'shortlisted_for_test'); onClose(); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100"
                        >
                            <Code className="w-3.5 h-3.5" /> Test
                        </button>
                        <button
                            onClick={() => { onUpdateStatus(applicationId, 'shortlisted'); onClose(); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white border border-violet-100"
                        >
                            <Star className="w-3.5 h-3.5" /> Shortlist
                        </button>
                        <button
                            onClick={() => { onUpdateStatus(applicationId, 'rejected'); onClose(); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100"
                        >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateProfilePanel;
