import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, ExternalLink, Briefcase, SlidersHorizontal, X, Search } from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import SkeletonCard from '../../components/futuristic/SkeletonCard';
import AILoader from '../../components/futuristic/AILoader';

import { getJobsInIndia } from '../../api/jobs';

/* ── External job card ──────────────────────────────────── */
const ExternalJobCard = ({ job, index }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04, duration: 0.35 }}
    >
        <GlassCard hover glow="green" padding="md" animate={false} className="group border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="flex items-start justify-between gap-6 flex-wrap md:flex-nowrap">
                <div className="flex-1 min-w-0">
                    {/* Badge Stack */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 border border-emerald-100 text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5" /> External Provider
                        </span>
                        {job.source && (
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{job.source}</span>
                        )}
                    </div>

                    <h3 className="font-heading font-bold text-slate-900 text-lg md:text-xl mb-1 group-hover:text-emerald-600 transition-colors leading-none truncate" dangerouslySetInnerHTML={{ __html: job.job_title || job.title || job.name || 'External Job' }} />

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-bold text-slate-600">{job.external_company_name || job.company || job.company_name || 'Verified Employer'}</span>
                        {job.location && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <div className="flex items-center gap-1 text-slate-500">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-semibold">{job.location}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {(job.job_description || job.description) && (
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: job.job_description || job.description }} />
                    )}
                </div>

                {/* Apply Action */}
                <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-slate-100 mt-2 md:mt-0 flex items-center md:items-start shrink-0">
                    <a
                        href={job.source_url || job.redirect_url || job.apply_url || job.job_url || job.url || '#'}
                        target={job.source_url || job.redirect_url || job.apply_url || job.job_url || job.url ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="w-full md:w-40 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-200 group/btn"
                    >
                        Apply on Partner
                        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </GlassCard>
    </motion.div>
);

/* ── Page ─────────────────────────────────────────────────── */
const JobsInIndia = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState({ role: '', location: '', experience: '' });

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getJobsInIndia(params);
            setJobs(result.data || result.results || result || []);
        } catch (e) {
            console.error(e);
            setError('Could not load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    return (
        <UserLayout>
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <Globe className="w-6 h-6 text-emerald-600" />
                    <h1 className="font-heading text-4xl font-bold text-slate-900">Jobs in India</h1>
                </div>
                <p className="text-slate-600 font-medium mt-1">External job listings aggregated from top providers</p>
            </motion.div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                {/* Filter panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="h-fit sticky top-6"
                >
                    <GlassCard padding="md" animate={false}>
                        <div className="flex items-center gap-2 mb-5">
                            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                            <h2 className="font-heading font-bold text-slate-900 text-sm">Filters</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                { key: 'role', label: 'Job Role', placeholder: 'e.g. React Developer' },
                                { key: 'location', label: 'Location', placeholder: 'e.g. Bangalore' },
                                { key: 'experience', label: 'Experience', placeholder: 'e.g. 2 years' },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key}>
                                    <label className="text-xs text-slate-700 font-semibold mb-1.5 block">{label}</label>
                                    <input
                                        type="text"
                                        placeholder={placeholder}
                                        value={params[key]}
                                        onChange={(e) => setParams(p => ({ ...p, [key]: e.target.value }))}
                                        className="w-full bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                                        onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                                    />
                                </div>
                            ))}

                            <button onClick={fetchJobs} className="bg-emerald-600 text-white hover:bg-emerald-700 w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm">
                                <Search className="w-4 h-4" /> Search Jobs
                            </button>

                            {Object.values(params).some(Boolean) && (
                                <button
                                    onClick={() => setParams({ role: '', location: '', experience: '' })}
                                    className="w-full text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-1"
                                >
                                    <X className="w-3 h-3" /> Clear Filters
                                </button>
                            )}
                        </div>

                        {!loading && (
                            <p className="text-xs text-slate-600 mt-4 text-center">{jobs.length} jobs found</p>
                        )}
                    </GlassCard>
                </motion.div>

                {/* Job feed */}
                <div>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} height="h-10" lines={2} />)}
                        </div>
                    ) : error ? (
                        <GlassCard padding="lg" className="text-center py-16 border-red-200 bg-red-50">
                            <p className="text-red-600 font-medium mb-4">{error}</p>
                            <button onClick={fetchJobs} className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">Retry</button>
                        </GlassCard>
                    ) : jobs.length > 0 ? (
                        <div className="space-y-4">
                            {jobs.map((job, i) => (
                                <ExternalJobCard key={job.id || i} job={job} index={i} />
                            ))}
                        </div>
                    ) : (
                        <GlassCard padding="lg" className="text-center py-16">
                            <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
                            <p className="text-slate-600 font-medium">Try adjusting the filters or search a different role</p>
                        </GlassCard>
                    )}
                </div>
            </div>
        </UserLayout>
    );
};

export default JobsInIndia;
