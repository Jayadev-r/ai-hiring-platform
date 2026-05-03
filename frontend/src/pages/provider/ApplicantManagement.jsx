import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
    Search,
    Users,
    MoreHorizontal,
    Mail,
    MapPin,
    Briefcase,
    Filter,
    Star,
    Clock,
    ChevronRight,
    LayoutGrid,
    List,
    Download,
    CheckCircle2,
    XCircle,
    ArrowRight,
    GripVertical
} from 'lucide-react';
import { ProviderLayout } from '../../components/provider-layout';
import { StatusBadge, DataTable, SkeletonCard, TopProgressBar, Toast } from '../../components/provider-ui';
import { useProviderToast } from '../../contexts/ProviderToastContext';
import { getAllRecruiterApplications, updateApplicationStatus } from '../../api/applications';
import ApplicantDetailsModal from '../../components/shared/ApplicantDetailsModal';
import { CandidateProfilePanel } from '../../components/shared';
import useDebounce from '../../hooks/useDebounce';

const PIPELINE_STAGES = [
    { id: 'applied', label: 'Applied', color: 'blue' },
    { id: 'reviewing', label: 'Reviewing', color: 'indigo' },
    { id: 'shortlisted', label: 'Shortlisted', color: 'violet' },
    { id: 'interview', label: 'Interview', color: 'amber' },
    { id: 'accepted', label: 'Hired', color: 'emerald' },
    { id: 'rejected', label: 'Rejected', color: 'slate' }
];

// Sortable Item Component for Kanban Card
const SortableApplicantCard = ({ app, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: app.id, data: { status: app.status } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative"
            onClick={(e) => {
                // Don't trigger click if we're dragging via the grip handle
                if (e.defaultPrevented) return;
                onClick(app);
            }}
        >
            <div className={`provider-panel p-4 cursor-pointer hover:border-provider-blue-300 transition-colors group relative overflow-hidden backdrop-blur-md bg-white/90 ${isDragging ? 'border-provider-blue-500 shadow-xl scale-105 z-50' : ''}`}>
                <div className="flex items-start gap-3 mb-3">
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="opacity-0 group-hover:opacity-100 absolute left-1 top-1/2 -translate-y-1/2 p-1 cursor-grab active:cursor-grabbing text-provider-slate-300 hover:text-provider-blue-500 transition-colors"
                        onClick={(e) => e.preventDefault()}
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>

                    <img
                        src={app.avatar}
                        alt={app.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm ml-4"
                    />
                    <div className="flex-1 min-w-0 pr-6">
                        <h4 className="text-sm font-bold text-provider-slate-900 truncate group-hover:text-provider-blue-600 transition-colors">
                            {app.name}
                        </h4>
                        <p className="text-[11px] text-provider-slate-500 font-bold truncate">
                            {app.appliedFor}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3 ml-4">
                    <div className="flex-1 h-1.5 bg-provider-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${app.matchScore > 85 ? 'bg-emerald-500' : app.matchScore > 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${app.matchScore}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-black text-provider-slate-700">
                        {app.matchScore}%
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5 ml-4">
                    {app.skills.slice(0, 2).map((skill, si) => (
                        <span key={si} className="text-[9px] font-bold px-1.5 py-0.5 bg-provider-slate-100 text-provider-slate-600 rounded-md">
                            {skill}
                        </span>
                    ))}
                    {app.skills.length > 2 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 text-provider-slate-400">
                            +{app.skills.length - 2}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Droppable Column Component
const KanbanColumn = ({ stage, items, onCardClick, isOver }) => {
    return (
        <div className="flex-shrink-0 w-80 snap-start flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${stage.color}-500`} />
                    <h3 className="text-sm font-black text-provider-slate-900 uppercase tracking-widest">
                        {stage.label}
                    </h3>
                    <motion.span
                        key={items.length}
                        initial={{ scale: 1.5, color: '#2563eb' }}
                        animate={{ scale: 1, color: '#64748b' }}
                        className="bg-provider-slate-100 text-provider-slate-500 text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                    >
                        {items.length}
                    </motion.span>
                </div>
            </div>

            <div
                className={`flex-1 min-h-[500px] p-2 rounded-3xl border-2 border-dashed transition-colors flex flex-col gap-3
                    ${isOver ? 'border-provider-blue-400 bg-provider-blue-50/50' : 'border-provider-slate-200 bg-provider-slate-50/50'}`}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <AnimatePresence>
                        {items.map((app) => (
                            <motion.div
                                key={app.id}
                                layoutId={`card-${app.id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <SortableApplicantCard app={app} onClick={onCardClick} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </SortableContext>

                {items.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <span className="text-xs font-bold text-provider-slate-400 uppercase tracking-widest text-center px-8 border border-provider-slate-200 rounded-2xl py-8 border-dashed bg-white/50 w-full">Drop Candidates Here</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const ApplicantManagement = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('pipeline');
    const [searchQuery, setSearchQuery] = useState('');
    const [jobFilter, setJobFilter] = useState('all');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const { addToast } = useProviderToast();

    // Modal & Panel State
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePanelOpen, setProfilePanelOpen] = useState(false);
    const [profilePanelAppId, setProfilePanelAppId] = useState(null);
    const [profilePanelCandidateName, setProfilePanelCandidateName] = useState('');

    // DnD State
    const [activeId, setActiveId] = useState(null);
    const [activeApp, setActiveApp] = useState(null);
    const [overColumn, setOverColumn] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires 5px of movement before dragging starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const result = await getAllRecruiterApplications();
            if (result.success) {
                const mapped = result.data.map(app => ({
                    ...app,
                    id: app.id.toString(), // DnD kit needs string ids
                    name: app.candidate_name,
                    email: app.candidate_email,
                    avatar: app.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate_name)}&background=random`,
                    title: 'Candidate',
                    location: app.location || 'Remote',
                    experience: app.experience ? `${app.experience} yrs` : 'N/A',
                    skills: app.skills ? (typeof app.skills === 'string' ? app.skills.split(',') : app.skills) : [],
                    appliedFor: app.job_title,
                    appliedDate: new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    status: (app.status || 'applied').toLowerCase(),
                    matchScore: app.match_score || Math.floor(Math.random() * 30) + 70,
                }));
                // Manually normalize statuses to fit the 6 columns
                const validStatuses = PIPELINE_STAGES.map(s => s.id);
                const normalized = mapped.map(app => {
                    let st = app.status;
                    if (st === 'new') st = 'applied';
                    if (!validStatuses.includes(st)) st = 'applied';
                    return { ...app, status: st };
                });
                setApplicants(normalized);
            }
        } catch (error) {
            console.error('Failed to fetch applicants:', error);
            addToast('error', 'Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            const result = await updateApplicationStatus(appId, newStatus);
            if (result.success) {
                setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
                addToast('success', `Applicant moved to ${newStatus}`);

                if (selectedApplicant?.id === appId) {
                    setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (error) {
            console.error("Failed to update status", error);
            addToast('error', 'Failed to update applicant status');
        }
    };

    const handleViewProfile = (app) => {
        setProfilePanelAppId(app.id);
        setProfilePanelCandidateName(app.name);
        setProfilePanelOpen(true);
    };

    const uniqueJobs = useMemo(() =>
        Array.from(new Set(applicants.map(a => a.appliedFor))).filter(Boolean)
        , [applicants]);

    const filteredApplicants = useMemo(() => {
        return applicants.filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                app.appliedFor?.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesJob = jobFilter === 'all' || app.appliedFor === jobFilter;
            return matchesSearch && matchesJob;
        });
    }, [applicants, debouncedSearch, jobFilter]);

    // Derived clustered state for columns
    const columns = useMemo(() => {
        const cols = {};
        PIPELINE_STAGES.forEach(stage => cols[stage.id] = []);
        filteredApplicants.forEach(app => {
            cols[app.status]?.push(app);
        });
        return cols;
    }, [filteredApplicants]);

    // DnD Event Handlers
    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        setActiveApp(applicants.find(a => a.id === active.id));
    };

    const handleDragOver = (event) => {
        const { over } = event;
        if (over) {
            // Find which column we're hovering over
            const overId = over.id;
            // Check if hovering directly over a column container or a card within it
            const targetColumn = PIPELINE_STAGES.find(s => s.id === overId) ? overId : applicants.find(a => a.id === overId)?.status;
            setOverColumn(targetColumn);
        } else {
            setOverColumn(null);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveApp(null);
        setOverColumn(null);

        if (!over) return;

        const activeAppId = active.id;
        const currentApp = applicants.find(a => a.id === activeAppId);
        if (!currentApp) return;

        // Determine drop target (column ID or another card's ID)
        let targetStatus = over.id;
        const isTargetAColumn = PIPELINE_STAGES.some(s => s.id === targetStatus);

        if (!isTargetAColumn) {
            // Dropped over another card, get its status
            const overCard = applicants.find(a => a.id === over.id);
            if (overCard) targetStatus = overCard.status;
        }

        // Must be a valid pipeline stage
        if (!PIPELINE_STAGES.some(s => s.id === targetStatus)) return;

        // Valid move
        if (currentApp.status !== targetStatus) {
            // Optimistic update
            setApplicants(prev => prev.map(app =>
                app.id === activeAppId ? { ...app, status: targetStatus } : app
            ));

            // API Call
            try {
                const result = await updateApplicationStatus(activeAppId, targetStatus);
                if (result.success) {
                    addToast('success', `Moved to ${PIPELINE_STAGES.find(s => s.id === targetStatus).label}`);
                } else {
                    // Revert on failure
                    setApplicants(prev => prev.map(app =>
                        app.id === activeAppId ? { ...app, status: currentApp.status } : app
                    ));
                    addToast('error', 'Failed to move candidate');
                }
            } catch (err) {
                // Revert on throw
                setApplicants(prev => prev.map(app =>
                    app.id === activeAppId ? { ...app, status: currentApp.status } : app
                ));
                addToast('error', 'Network error while moving');
            }
        }
    };

    return (
        <ProviderLayout>
            <TopProgressBar loading={loading} />

            <div className="max-w-[1600px] mx-auto px-6 py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-provider-blue-600 mb-2">
                            <Users className="w-5 h-5" />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Talent Acquisition</span>
                        </div>
                        <h1 className="text-4xl font-black text-provider-slate-900 tracking-tight">
                            Applicant <span className="text-provider-blue-600">Pipeline</span>
                        </h1>
                        <p className="text-sm font-medium text-provider-slate-500 mt-2 max-w-2xl">
                            Drag-and-drop candidates through the operational funnel to manage recruitment velocity.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="inline-flex p-1 bg-provider-slate-100 rounded-xl border border-provider-slate-200 shadow-inner">
                            <button
                                onClick={() => setViewMode('pipeline')}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'pipeline'
                                    ? 'bg-white text-provider-blue-600 shadow-sm border border-provider-slate-200'
                                    : 'text-provider-slate-500 hover:text-provider-slate-700'
                                    }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Kanban
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'list'
                                    ? 'bg-white text-provider-blue-600 shadow-sm border border-provider-slate-200'
                                    : 'text-provider-slate-500 hover:text-provider-slate-700'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                Manifest
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sticky Filter Bar Overlaying Mesh Background */}
                <div className="provider-panel p-4 mb-8 flex flex-wrap items-center gap-4 bg-white/80 backdrop-blur-xl sticky top-[88px] z-40 border-provider-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-provider-slate-400" />
                        <input
                            type="text"
                            placeholder="Locate candidate by name, protocol, or skill..."
                            className="w-full bg-provider-slate-50 border border-provider-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-provider-slate-900 placeholder:text-provider-slate-400 focus:outline-none focus:ring-2 focus:ring-provider-blue-500 focus:border-transparent transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 px-4 py-3 bg-provider-slate-50 border border-provider-slate-200 rounded-xl">
                            <Filter className="w-4 h-4 text-provider-slate-500" />
                            <select
                                className="bg-transparent text-xs font-black uppercase tracking-widest text-provider-slate-700 focus:outline-none cursor-pointer"
                                value={jobFilter}
                                onChange={(e) => setJobFilter(e.target.value)}
                            >
                                <option value="all">Global Matrix</option>
                                {uniqueJobs.map(job => (
                                    <option key={job} value={job}>{job}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
                    >
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} className="h-96" />)}
                    </motion.div>
                ) : viewMode === 'pipeline' ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-6 overflow-x-auto pb-12 snap-x scroll-smooth provider-scrollbar">
                            {PIPELINE_STAGES.map((stage) => (
                                <SortableContext
                                    key={stage.id}
                                    id={stage.id} // The column itself needs to be a valid drop target
                                    items={columns[stage.id]?.map(i => i.id) || []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <KanbanColumn
                                        stage={stage}
                                        items={columns[stage.id] || []}
                                        onCardClick={handleViewProfile}
                                        isOver={overColumn === stage.id}
                                    />
                                </SortableContext>
                            ))}
                        </div>

                        {/* Drag Overlay for smooth following */}
                        <DragOverlay zIndex={100}>
                            {activeApp ? (
                                <div className="opacity-90 rotate-2 scale-105 pointer-events-none">
                                    <SortableApplicantCard app={activeApp} onClick={() => { }} />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    // Minimalist List View 
                    <div className="provider-panel overflow-hidden border-provider-slate-200 shadow-sm">
                        <table className="w-full">
                            <thead className="bg-provider-slate-50 border-b border-provider-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-provider-slate-400">Identity</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-provider-slate-400">Protocol</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-provider-slate-400">AI Compatibility</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-provider-slate-400">Current Phase</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-provider-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-provider-slate-50">
                                {filteredApplicants.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-provider-blue-50/50 transition-colors group cursor-pointer"
                                        onClick={() => handleViewProfile(app)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={app.avatar} alt="P" className="w-10 h-10 rounded-xl" />
                                                <div>
                                                    <div className="text-sm font-bold text-provider-slate-900">{app.name}</div>
                                                    <div className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-provider-slate-900">{app.appliedFor}</div>
                                            <div className="text-xs text-provider-slate-500">{app.experience} EXP</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-provider-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${app.matchScore > 85 ? 'bg-emerald-500' : 'bg-provider-blue-500'}`} style={{ width: `${app.matchScore}%` }} />
                                                </div>
                                                <span className="text-xs font-black text-provider-slate-700">{app.matchScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={app.status} />
                                            <div
                                                className="provider-panel p-4 flex items-center justify-between mb-3 group provider-row-hover"
                                            ><button className="p-2 bg-provider-slate-50 text-provider-slate-400 rounded-xl hover:bg-white hover:text-provider-blue-600 transition-colors shadow-sm border border-transparent hover:border-provider-slate-200">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredApplicants.length === 0 && (
                            <div className="p-16 text-center">
                                <Users className="w-12 h-12 text-provider-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-provider-slate-900">No applicants found</h3>
                                <p className="text-sm text-provider-slate-500 mt-2">Adjust your search parameters to find candidates.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Application Detail Overlays */}
            <CandidateProfilePanel
                isOpen={profilePanelOpen}
                onClose={() => setProfilePanelOpen(false)}
                applicationId={profilePanelAppId}
                candidateName={profilePanelCandidateName}
            />

            {selectedApplicant && (
                <ApplicantDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    applicant={selectedApplicant}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </ProviderLayout>
    );
};

export default ApplicantManagement;
