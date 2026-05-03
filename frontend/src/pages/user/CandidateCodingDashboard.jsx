import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Clock, Award, ChevronRight, FileCode, Search, AlertCircle, Info } from 'lucide-react';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import TiltCard from '../../components/futuristic/TiltCard';
import AILoader from '../../components/futuristic/AILoader';
import codingService from '../../services/codingService';

/* ── Test card ────────────────────────────────────────────── */
const CodingTestCard = ({ test, navigate, index }) => {
    const isCompleted = parseInt(test.submission_count) > 0;

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
            <TiltCard className="group h-full">
                <GlassCard hover glow={isCompleted ? 'green' : 'purple'} padding="lg" animate={false} className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110 duration-300 ${isCompleted ? 'bg-green-400/10 border-green-400/30' : 'bg-purple-400/10 border-purple-400/30'}`}>
                            <Code2 className={`w-6 h-6 ${isCompleted ? 'text-green-400' : 'text-purple-400'}`} />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isCompleted ? 'bg-green-400/10 border-green-400/30 text-green-400' : 'bg-amber-400/10 border-amber-400/30 text-amber-400'}`}>
                            {isCompleted ? 'Completed' : 'Pending'}
                        </span>
                    </div>

                    {/* Info */}
                    <h3 className="font-heading font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">{test.title}</h3>
                    <p className="text-xs text-slate-500 mb-4">{test.job_title} at {test.company_name}</p>

                    <div className="flex gap-4 text-xs text-slate-600 mb-5 flex-1">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{test.time_limit} min</span>
                        <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" />{test.total_marks} marks</span>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-slate-200">
                        {isCompleted ? (
                            test.results_published ? (
                                <button onClick={() => navigate(`/user/coding-tests/${test.id}/results`)}
                                    className="w-full btn-neon-cyan py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                                    View Score <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold text-center flex items-center justify-center gap-2">
                                    <Info className="w-4 h-4" /> Awaiting Results
                                </div>
                            )
                        ) : (
                            <button onClick={() => navigate(`/user/coding-tests/${test.id}/attempt`)}
                                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                Start Coding Test <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </GlassCard>
            </TiltCard>
        </motion.div>
    );
};

/* ── Page ─────────────────────────────────────────────────── */
const CandidateCodingDashboard = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchMyTests(); }, []);

    const fetchMyTests = async () => {
        try {
            setLoading(true);
            const res = await codingService.getMyCodingTests();
            setTests(res.data || []);
        } catch (error) { console.error('Error fetching candidate coding tests:', error); }
        finally { setLoading(false); }
    };

    const filteredTests = tests.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.job_title.toLowerCase().includes(searchTerm.toLowerCase()));
    const ongoingTests = filteredTests.filter(t => parseInt(t.submission_count) === 0);
    const completedTests = filteredTests.filter(t => parseInt(t.submission_count) > 0);

    return (
        <UserLayout>
            <motion.div className="mb-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Code2 className="w-7 h-7 text-indigo-600" />
                    <h1 className="font-heading text-4xl font-bold text-slate-900">Coding Tests</h1>
                </div>
                <p className="text-slate-500">Showcase your skills through algorithmic challenges</p>
            </motion.div>

            {/* Search */}
            <motion.div className="relative mb-10 max-w-xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input type="text" placeholder="Search tests or jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input w-full pl-12 pr-5 py-3.5 text-sm" />
            </motion.div>

            {loading ? (
                <AILoader text="Syncing tests..." size="md" />
            ) : tests.length === 0 ? (
                <GlassCard padding="lg" className="text-center py-20 max-w-lg mx-auto">
                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-6">
                        <FileCode className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">No coding tests assigned</h3>
                    <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">When a recruiter invites you to a coding challenge, it will appear here.</p>
                </GlassCard>
            ) : (
                <div className="space-y-10">
                    {ongoingTests.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Challenges</h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 border border-amber-400/30 text-amber-400">{ongoingTests.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {ongoingTests.map((test, i) => <CodingTestCard key={test.id} test={test} navigate={navigate} index={i} />)}
                            </div>
                        </section>
                    )}
                    {completedTests.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completed Sessions</h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-400/10 border border-green-400/30 text-green-400">{completedTests.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {completedTests.map((test, i) => <CodingTestCard key={test.id} test={test} navigate={navigate} index={i} />)}
                            </div>
                        </section>
                    )}
                    {filteredTests.length === 0 && (
                        <div className="text-center py-16">
                            <AlertCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-600 text-sm font-medium uppercase tracking-wider">No matching tests found</p>
                        </div>
                    )}
                </div>
            )}
        </UserLayout>
    );
};

export default CandidateCodingDashboard;
