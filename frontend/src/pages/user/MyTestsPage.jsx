import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Calendar, Building2, FileText, CheckCircle,
    AlertCircle, Award, Timer, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import UserLayout from '../../components/user-layout/UserLayout';
import GlassCard from '../../components/futuristic/GlassCard';
import AILoader from '../../components/futuristic/AILoader';
import MatchScoreRing from '../../components/futuristic/MatchScoreRing';
import { getMyTests } from '../../services/testService';

/* ── Tab config ─────────────────────────────────────────── */
const TABS = [
    { key: 'ongoing', label: 'Ongoing', accent: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
    { key: 'upcoming', label: 'Upcoming', accent: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
    { key: 'completed', label: 'Completed', accent: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
];

/* ── Test card ──────────────────────────────────────────── */
const TestCard = ({ test, section, navigate, index }) => {
    const scorePercentage = test.max_score > 0 ? Math.round((test.total_score / test.max_score) * 100) : null;

    const formatDateTime = (date, time) => {
        if (!date) return 'N/A';
        try { return new Date(`${date}T${time || '00:00'}`).toLocaleString(); } catch { return `${date} ${time}`; }
    };

    const getTimeUntil = (date, time) => {
        if (!date) return '';
        const target = new Date(`${date}T${time || '00:00'}`);
        const diff = target - new Date();
        if (diff <= 0) return 'Starting now';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
        >
            <GlassCard hover glow={section === 'ongoing' ? 'green' : section === 'upcoming' ? 'amber' : 'cyan'} padding="md" animate={false}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-slate-900 text-base mb-1">{test.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                            <Building2 className="w-3.5 h-3.5" />
                            {test.company_name} — {test.job_title}
                        </div>
                        {test.description && (
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{test.description}</p>
                        )}
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5 text-indigo-500" />{test.duration_minutes} min</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-500" />Starts: {formatDateTime(test.start_date, test.start_time)}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-500" />Ends: {formatDateTime(test.end_date, test.end_time)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {section === 'ongoing' && (
                            <button
                                onClick={() => navigate(`/user/tests/${test.id}/attempt`)}
                                className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                {test.attempt_id && test.attempt_status === 'in_progress' ? 'Resume Test' : 'Start Test'}
                            </button>
                        )}

                        {section === 'upcoming' && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30">
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-xs font-semibold text-amber-300">
                                    Starts in {getTimeUntil(test.start_date, test.start_time)}
                                </span>
                            </div>
                        )}

                        {section === 'completed' && (
                            <div className="flex flex-col items-end gap-2">
                                {test.expired && !test.attempt_id ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-400/10 border border-red-400/30 text-red-400">
                                        <AlertCircle className="w-3.5 h-3.5" /> Expired
                                    </span>
                                ) : (
                                    <>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-400/10 border border-green-400/30 text-green-400">
                                            <CheckCircle className="w-3.5 h-3.5" /> Submitted
                                        </span>
                                        {test.results_published && scorePercentage !== null && (
                                            <MatchScoreRing score={scorePercentage} size={56} thickness={4} />
                                        )}
                                        {test.results_published ? (
                                            <button
                                                onClick={() => navigate(`/user/tests/${test.id}/results`)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-400/10 border border-purple-400/30 text-purple-400 hover:bg-purple-400/20 transition-colors"
                                            >
                                                <Award className="w-3.5 h-3.5" /> View Results
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-slate-600">Results pending</span>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
};

/* ── Page ─────────────────────────────────────────────────── */
const MyTestsPage = () => {
    const [data, setData] = useState({ upcoming: [], ongoing: [], completed: [] });
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('ongoing');
    const navigate = useNavigate();

    useEffect(() => { fetchMyTests(); }, []);

    const fetchMyTests = async () => {
        try {
            setLoading(true);
            const res = await getMyTests();
            const d = res.data || { upcoming: [], ongoing: [], completed: [] };
            setData(d);
            if (d.ongoing?.length > 0) setActiveSection('ongoing');
            else if (d.upcoming?.length > 0) setActiveSection('upcoming');
            else setActiveSection('completed');
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserLayout>
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    <h1 className="font-heading text-4xl font-bold text-slate-900">My Tests</h1>
                </div>
                <p className="text-slate-500">View and take your assigned assessments</p>
            </motion.div>

            {loading ? (
                <AILoader text="Loading tests..." size="md" />
            ) : (
                <>
                    {/* Futuristic pill tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-slate-100 w-fit rounded-xl border border-slate-200">
                        {TABS.map(tab => {
                            const count = data[tab.key]?.length || 0;
                            const isActive = activeSection === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveSection(tab.key)}
                                    className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${isActive ? `${tab.bg} ${tab.border} border ${tab.accent} shadow-sm bg-white` : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab.label}
                                    {count > 0 && (
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Test cards */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {data[activeSection]?.length === 0 ? (
                                <GlassCard padding="lg" className="text-center py-16">
                                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                                        {activeSection === 'ongoing' ? 'No ongoing tests' : activeSection === 'upcoming' ? 'No upcoming tests' : 'No completed tests'}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium">
                                        {activeSection === 'ongoing' ? 'Check back when a test window opens' : activeSection === 'upcoming' ? "You'll be notified when tests are assigned" : 'Your completed tests will appear here'}
                                    </p>
                                </GlassCard>
                            ) : (
                                data[activeSection].map((test, i) => (
                                    <TestCard key={`${test.id}-${activeSection}`} test={test} section={activeSection} navigate={navigate} index={i} />
                                ))
                            )}
                        </motion.div>
                    </AnimatePresence>
                </>
            )}
        </UserLayout>
    );
};

export default MyTestsPage;
