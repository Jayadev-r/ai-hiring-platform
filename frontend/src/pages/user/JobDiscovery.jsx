import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Wifi, Briefcase } from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import TiltCard from '../../components/futuristic/TiltCard';
import SkeletonCard from '../../components/futuristic/SkeletonCard';
import JobApplyModal from '../../components/shared/JobApplyModal';

import { getJobs } from '../../api/jobs';
import { getUserApplications } from '../../api/applications';

/* ── Job card ──────────────────────────────────────────── */
const JobCard = ({ job, isApplied, onApply, index }) => {
    const skills = (job.required_skills || '').split(',').slice(0, 4);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
        >
            <TiltCard className="group">
                <GlassCard hover glow="blue" padding="md" animate={false}>
                    <div className="flex items-start justify-between gap-4">
                        {/* Left */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-200 flex items-center justify-center font-heading font-bold text-indigo-600 text-xs shrink-0 shadow-sm">
                                    {job.company_name?.charAt(0) || 'C'}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-heading font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                                        {job.job_title}
                                    </h3>
                                    <p className="text-xs text-slate-600 truncate font-medium">{job.company_name}</p>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium my-2">
                                {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{job.location}</span>}
                                {job.experience_level && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-slate-400" />{job.experience_level}</span>}
                            </div>

                            {/* Description Snippet */}
                            {job.job_description && (
                                <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.job_description }} />
                            )}

                            {/* Skill tags */}
                            <div className="flex flex-wrap gap-1.5">
                                {skills.filter(Boolean).map((s) => (
                                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Apply */}
                        <div className="shrink-0">
                            {isApplied ? (
                                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm">
                                    Applied ✓
                                </span>
                            ) : (
                                <button onClick={() => onApply(job)} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                                    Apply
                                </button>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </TiltCard>
        </motion.div>
    );
};

/* ── Page ────────────────────────────────────────────────── */
const JobDiscovery = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ role: '', experience: '', location: '', remote: false });
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [userApplications, setUserApplications] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const result = await getJobs({ status: 'Open' });
                if (result.success) setJobs(result.data);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await getUserApplications();
                if (res.success) setUserApplications(res.applications || []);
            } catch (e) { console.error(e); }
        })();
    }, [isApplyModalOpen]);

    const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== false).length;
    const clearFilters = () => setFilters({ role: '', experience: '', location: '', remote: false });

    const filteredJobs = jobs.filter(job => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!job.job_title?.toLowerCase().includes(q) &&
                !job.job_description?.toLowerCase().includes(q) &&
                !job.required_skills?.toLowerCase().includes(q)) return false;
        }
        if (filters.role && !job.job_title?.toLowerCase().includes(filters.role)) return false;
        if (filters.experience && !job.experience_level?.toLowerCase().includes(filters.experience)) return false;
        if (filters.location && !job.location?.toLowerCase().includes(filters.location)) return false;
        if (filters.remote) {
            const isRemote = job.location?.toLowerCase().includes('remote') || job.job_type?.toLowerCase().includes('remote');
            if (!isRemote) return false;
        }
        return true;
    });

    const filterOptions = {
        role: [{ v: '', l: 'All Roles' }, { v: 'frontend', l: 'Frontend' }, { v: 'backend', l: 'Backend' }, { v: 'fullstack', l: 'Full Stack' }, { v: 'ml', l: 'ML Engineer' }, { v: 'devops', l: 'DevOps' }],
        experience: [{ v: '', l: 'Any Level' }, { v: 'entry', l: 'Entry' }, { v: 'mid', l: 'Mid' }, { v: 'senior', l: 'Senior' }, { v: 'lead', l: 'Lead' }],
        location: [{ v: '', l: 'Any Location' }, { v: 'remote', l: 'Remote' }, { v: 'bangalore', l: 'Bangalore' }, { v: 'mumbai', l: 'Mumbai' }, { v: 'delhi', l: 'Delhi' }, { v: 'hyderabad', l: 'Hyderabad' }],
    };

    return (
        <UserLayout>
            {/* Header */}
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-heading text-4xl font-bold text-slate-900 mb-1 tracking-tight">Job Discovery</h1>
                <p className="text-slate-600 font-medium">
                    {loading ? 'Loading jobs...' : `${filteredJobs.length} jobs available`}
                </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
                className="relative mb-4"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
                {/* Search Bar */}
                <GlassCard padding="sm" animate={false} className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Job title, company, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all shadow-sm ${showFilters
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-slate-50'
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                        {activeFiltersCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500 text-white font-bold">{activeFiltersCount}</span>
                        )}
                    </button>
                </GlassCard>
            </motion.div>

            {/* Filter panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden mb-4"
                    >
                        <GlassCard padding="md" animate={false}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(filterOptions).map(([key, opts]) => (
                                    <div key={key}>
                                        <label className="text-xs text-slate-600 font-bold mb-1.5 block capitalize">{key}</label>
                                        <select
                                            value={filters[key]}
                                            onChange={(e) => setFilters(p => ({ ...p, [key]: e.target.value }))}
                                            className="glass-input w-full px-3 py-2 text-sm"
                                        >
                                            {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                                        </select>
                                    </div>
                                ))}
                                <div className="flex items-end gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.remote}
                                            onChange={(e) => setFilters(p => ({ ...p, remote: e.target.checked }))}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1"><Wifi className="w-3.5 h-3.5 text-indigo-500" />Remote</span>
                                    </label>
                                    {activeFiltersCount > 0 && (
                                        <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-red-500 font-semibold mb-2 ml-2 transition-colors">Clear</button>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active filter badges */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {filters.role && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700">
                            {filters.role}
                            <button onClick={() => setFilters(p => ({ ...p, role: '' }))}><X className="w-3 h-3 hover:text-indigo-900" /></button>
                        </span>
                    )}
                    {filters.experience && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700">
                            {filters.experience}
                            <button onClick={() => setFilters(p => ({ ...p, experience: '' }))}><X className="w-3 h-3 hover:text-indigo-900" /></button>
                        </span>
                    )}
                    {filters.location && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700">
                            <MapPin className="w-3 h-3" />{filters.location}
                            <button onClick={() => setFilters(p => ({ ...p, location: '' }))}><X className="w-3 h-3 hover:text-indigo-900" /></button>
                        </span>
                    )}
                    {filters.remote && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700">
                            <Wifi className="w-3 h-3" /> Remote
                            <button onClick={() => setFilters(p => ({ ...p, remote: false }))}><X className="w-3 h-3 hover:text-indigo-900" /></button>
                        </span>
                    )}
                </div>
            )}

            {/* Results */}
            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} height="h-32" lines={2} />)}
                </div>
            ) : filteredJobs.length > 0 ? (
                <div className="space-y-4">
                    {filteredJobs.map((job, i) => (
                        <JobCard
                            key={job.job_id}
                            job={job}
                            index={i}
                            isApplied={userApplications.some(a => a.job_id === job.job_id)}
                            onApply={(j) => { setSelectedJob(j); setIsApplyModalOpen(true); }}
                        />
                    ))}
                </div>
            ) : (
                <GlassCard padding="lg" className="text-center py-20">
                    <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
                    <p className="text-slate-600 font-medium">Try adjusting your search or filters</p>
                    {(searchQuery || showFilters) && (
                        <button
                            onClick={() => { setSearchQuery(''); setFilters({ role: '', experience: '', location: '', remote: false }); }}
                            className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mx-auto"
                        >
                            <X className="w-4 h-4" /> Clear All Filters
                        </button>
                    )}
                </GlassCard>
            )}

            <JobApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} job={selectedJob} />
        </UserLayout>
    );
};

export default JobDiscovery;
