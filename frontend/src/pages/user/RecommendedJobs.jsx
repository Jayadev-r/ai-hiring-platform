import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Briefcase, ExternalLink, RefreshCw, Zap } from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import TiltCard from '../../components/futuristic/TiltCard';
import MatchScoreRing from '../../components/futuristic/MatchScoreRing';
import SkeletonCard from '../../components/futuristic/SkeletonCard';
import api from '../../api/axios';

const RecommendedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/ai/recommended-jobs');
            if (response.data.success) {
                setJobs(response.data.data || []);
            } else {
                setError(response.data.message || 'Failed to fetch recommendations.');
            }
        } catch (err) {
            console.error('[RecommendedJobs]', err);
            setError('Could not connect to the recommendation service. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    return (
        <UserLayout>
            {/* Header */}
            <motion.div
                className="mb-8 flex items-start justify-between flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-200 flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="font-heading text-4xl font-bold text-slate-900">
                            AI <span className="text-indigo-600">Curated</span> Matches
                        </h1>
                        <p className="text-slate-600 font-medium mt-0.5">Personalised job recommendations based on your profile</p>
                    </div>
                </div>

                {!loading && jobs.length > 0 && (
                    <button
                        onClick={fetchJobs}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                )}
            </motion.div>

            {/* Content */}
            {loading ? (
                <div className="space-y-5">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} height="h-20" lines={3} />)}
                </div>
            ) : error ? (
                <GlassCard padding="lg" className="text-center py-16 border-red-400/20">
                    <div className="w-16 h-16 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={fetchJobs} className="btn-neon-cyan px-8 py-2.5 rounded-lg text-sm font-semibold">Try Again</button>
                </GlassCard>
            ) : jobs.length > 0 ? (
                <div className="space-y-5">
                    {jobs.map((job, i) => (
                        <motion.div
                            key={job.id || i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <TiltCard>
                                <GlassCard hover glow="cyan" padding="md" animate={false} className="group">
                                    <div className="flex items-start justify-between gap-6 flex-wrap md:flex-nowrap">
                                        {/* Left content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h3 className="font-heading font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                                                    {job.title}
                                                </h3>
                                                {job.source && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-600 uppercase tracking-wider">
                                                        {job.source}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Matched skill tag */}
                                            {job.matched_skill && (
                                                <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                                                    <Zap className="w-3 h-3" />
                                                    Matched by: <span className="text-emerald-800">{job.matched_skill}</span>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500 font-medium mb-3">
                                                {job.company && (
                                                    <span className="flex items-center gap-1.5 text-slate-700">
                                                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />{job.company}
                                                    </span>
                                                )}
                                                {job.location && (
                                                    <span className="flex items-center gap-1.5 text-slate-600">
                                                        <MapPin className="w-3.5 h-3.5" />{job.location}
                                                    </span>
                                                )}
                                            </div>

                                            {job.description && (
                                                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">{job.description}</p>
                                            )}
                                        </div>

                                        {/* Right: score + apply */}
                                        <div className="flex flex-col items-center gap-3 shrink-0">
                                            {job.match_score != null && (
                                                <MatchScoreRing score={Math.round(job.match_score)} size={70} label="Match" thickness={5} />
                                            )}
                                            {job.apply_url && (
                                                <a
                                                    href={job.apply_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                                                >
                                                    Apply Now <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            </TiltCard>
                        </motion.div>
                    ))}
                    <p className="text-center text-slate-600 text-sm py-4">
                        Showing top {jobs.length} recommendations based on your professional profile.
                    </p>
                </div>
            ) : (
                <GlassCard padding="lg" className="text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">No recommendations yet</h3>
                    <p className="text-slate-600 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                        Update your profile skills and job preferences for AI-powered matches.
                    </p>
                    <button onClick={fetchJobs} className="bg-indigo-600 text-white border-transparent hover:bg-indigo-700 px-8 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm">Refresh Search</button>
                </GlassCard>
            )}
        </UserLayout>
    );
};

export default RecommendedJobs;
