import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    Clock,
    DollarSign,
    MapPin,
    Plus,
    Users,
    Trash2,
    LayoutGrid,
    List,
    Search,
    MoreHorizontal,
    ChevronLeft,
    GraduationCap,
    HelpCircle,
    CheckCircle2,
    X
} from 'lucide-react';
import { ProviderLayout } from '../../components/provider-layout';
import {
    StatusBadge,
    DataTable,
    TopProgressBar,
    SkeletonCard,
    EmptyState
} from '../../components/provider-ui';
import { useProviderToast } from '../../contexts/ProviderToastContext';
import useDebounce from '../../hooks/useDebounce';
import api from '../../api/axios';
import { updateJobStatus, deleteJob } from '../../api/jobs';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Job Management Page
 * Rebuilt with a professional command center aesthetic, dual views, and refined CRUD workflows.
 */
const JobPosting = () => {
    const toast = useProviderToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [editingJobId, setEditingJobId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [filterStatus, setFilterStatus] = useState('All');
    const [jobToDelete, setJobToDelete] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        job_title: '',
        department: '',
        job_type: 'Full-time',
        experience_level: 'Junior',
        location: '',
        salary_min: '',
        salary_max: '',
        job_description: '',
        required_skills: '',
        required_education: '',
        remote: false,
        require_education: false,
        require_skills: false
    });

    // Dynamic Requirements State
    const [requirements, setRequirements] = useState([
        { requirement_text: '', is_mandatory: true }
    ]);

    // Dynamic Questions State
    const [questions, setQuestions] = useState([
        { question_text: '', question_type: 'text', options: [], is_required: true, expected_answer: '' }
    ]);

    // Job Expectations State
    const [expectations, setExpectations] = useState({
        expected_experience_years: '',
        expected_education: '',
        notes: ''
    });

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/jobs/recruiter');
            if (response.data.success) {
                setJobs(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            toast.error('Failed to load job listings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Filter Logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.job_title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            job.department.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Form Handlers
    const addRequirement = () => setRequirements([...requirements, { requirement_text: '', is_mandatory: true }]);
    const removeRequirement = (index) => {
        const newReqs = [...requirements];
        newReqs.splice(index, 1);
        setRequirements(newReqs);
    };
    const updateRequirement = (index, field, value) => {
        const newReqs = [...requirements];
        newReqs[index][field] = value;
        setRequirements(newReqs);
    };

    const addQuestion = () => setQuestions([...questions, { question_text: '', question_type: 'text', options: [], is_required: true, expected_answer: '' }]);
    const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));
    const updateQuestion = (index, field, value) => {
        const newQs = [...questions];
        if (field === 'options') {
            newQs[index].options = value.split(',').map(o => o.trim());
        } else {
            newQs[index][field] = value;
        }
        setQuestions(newQs);
    };

    const handleSaveJob = async (e) => {
        if (e) e.preventDefault();
        try {
            const payload = {
                ...formData,
                salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
                salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
                requirements: requirements.filter(r => r.requirement_text.trim() !== ''),
                questions: questions.filter(q => q.question_text.trim() !== ''),
                job_expectations: {
                    expected_experience_years: expectations.expected_experience_years ? parseInt(expectations.expected_experience_years) : null,
                    expected_education: expectations.expected_education || null,
                    notes: expectations.notes || null
                }
            };

            const response = editingJobId
                ? await api.put(`/jobs/${editingJobId}`, payload)
                : await api.post('/jobs', payload);

            if (response.data.success) {
                toast.success(editingJobId ? 'Job updated successfully' : 'Job published successfully');
                setShowForm(false);
                fetchJobs();
            }
        } catch (error) {
            console.error('Error saving job:', error);
            toast.error(error.response?.data?.message || 'Failed to save job');
        }
    };

    const handleEditClick = async (job) => {
        setEditingJobId(job.job_id);
        setFormData({
            job_title: job.job_title,
            department: job.department,
            job_type: job.job_type,
            experience_level: job.experience_level,
            location: job.location || '',
            salary_min: job.salary_min || '',
            salary_max: job.salary_max || '',
            job_description: job.job_description || '',
            required_skills: job.required_skills || '',
            required_education: job.required_education || '',
            remote: job.location?.toLowerCase() === 'remote',
            require_education: job.require_education || false,
            require_skills: job.require_skills || false
        });

        try {
            const res = await api.get(`/jobs/${job.job_id}`);
            if (res.data.success) {
                const fullJob = res.data.data;
                setRequirements(fullJob.requirements?.length > 0 ? fullJob.requirements : [{ requirement_text: '', is_mandatory: true }]);
                setQuestions(fullJob.questions?.length > 0 ? fullJob.questions : [{ question_text: '', question_type: 'text', options: [], is_required: true, expected_answer: '' }]);
                setExpectations(fullJob.expectations || { expected_experience_years: '', expected_education: '', notes: '' });
                setShowForm(true);
            }
        } catch (err) {
            toast.error("Failed to load job details");
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            await updateJobStatus(jobId, newStatus);
            toast.success(`Job status updated to ${newStatus}`);
            fetchJobs();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const confirmDelete = async (jobId) => {
        try {
            await deleteJob(jobId);
            toast.success('Job deleted successfully');
            setJobToDelete(null);
            fetchJobs();
        } catch (error) {
            toast.error('Failed to delete job');
        }
    };

    // Table Columns
    const columns = [
        {
            header: 'Position',
            accessor: 'job_title',
            render: (job) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{job.job_title}</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tight">{job.department}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (job) => <StatusBadge status={job.status} />
        },
        {
            header: 'Details',
            accessor: 'details',
            render: (job) => (
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location || 'Remote'}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {job.salary_min?.toLocaleString()}
                    </div>
                </div>
            )
        },
        {
            header: 'Applicants',
            accessor: 'applicant_count',
            render: (job) => (
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{job.applicant_count || 0}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (job) => (
                <div className="flex justify-end items-center gap-2">
                    <button
                        onClick={() => handleEditClick(job)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Edit Job"
                    >
                        <Briefcase className="w-4 h-4" />
                    </button>
                    {jobToDelete === job.job_id ? (
                        <div className="flex items-center gap-1">
                            <button onClick={() => confirmDelete(job.job_id)} className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">Verify</button>
                            <button onClick={() => setJobToDelete(null)} className="px-2 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded">Cancel</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setJobToDelete(job.job_id)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Job"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    if (showForm) {
        return (
            <ProviderLayout>
                <div className="max-w-4xl mx-auto pb-32">
                    <button
                        onClick={() => setShowForm(false)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Pipeline
                    </button>

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {editingJobId ? 'Edit Position' : 'Create New Position'}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">Define role requirements, screening logic, and expectations</p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveJob} className="space-y-6">
                        {/* Section 1: Basic Info */}
                        <div className="provider-panel p-6 space-y-6">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
                                <Briefcase className="w-3.5 h-3.5" />
                                Role Architecture
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Job Title</label>
                                    <input
                                        value={formData.job_title}
                                        onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                                        className="provider-input w-full"
                                        placeholder="e.g. Senior Machine Learning Engineer"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Department</label>
                                    <input
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="provider-input w-full"
                                        placeholder="e.g. R&D / Engineering"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Job Type</label>
                                    <select
                                        value={formData.job_type}
                                        onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                                        className="provider-input w-full"
                                    >
                                        <option>Full-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                        <option>Part-time</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Required Experience</label>
                                    <select
                                        value={formData.experience_level}
                                        onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                        className="provider-input w-full"
                                    >
                                        <option>Fresher</option>
                                        <option>Junior</option>
                                        <option>Mid</option>
                                        <option>Senior</option>
                                        <option>Lead</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="provider-input w-full pl-9"
                                            placeholder="Remote, Bangalore, etc."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Description</label>
                                <textarea
                                    value={formData.job_description}
                                    onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                                    rows={8}
                                    className="provider-input w-full resize-none leading-relaxed"
                                    placeholder="Outline role responsibilities, team impact, and vision..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 2: Compensation & Skills */}
                        <div className="provider-panel p-6 space-y-6">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
                                <DollarSign className="w-3.5 h-3.5" />
                                Talent Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Salary Range (Min)</label>
                                    <input
                                        type="number"
                                        value={formData.salary_min}
                                        onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                                        className="provider-input w-full font-mono"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Salary Range (Max)</label>
                                    <input
                                        type="number"
                                        value={formData.salary_max}
                                        onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                                        className="provider-input w-full font-mono"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Primary Skills (Comma Separated)</label>
                                    <input
                                        value={formData.required_skills}
                                        onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                                        className="provider-input w-full"
                                        placeholder="React, AWS, Node.js, Python..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: AI Screening Logic */}
                        <div className="provider-panel p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5" />
                                    Screening Requirements
                                </h2>
                                <button
                                    type="button"
                                    onClick={addRequirement}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                                >
                                    + Add Item
                                </button>
                            </div>
                            <div className="space-y-3">
                                {requirements.map((req, idx) => (
                                    <div key={idx} className="flex gap-3 group">
                                        <input
                                            value={req.requirement_text}
                                            onChange={(e) => updateRequirement(idx, 'requirement_text', e.target.value)}
                                            className="provider-input flex-1"
                                            placeholder="e.g. 3+ years experience in React"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(idx)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 4: Questionnaire */}
                        <div className="provider-panel p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    Active Screening Questions
                                </h2>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                                >
                                    + Add Question
                                </button>
                            </div>
                            <div className="space-y-6">
                                {questions.map((q, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Question #{idx + 1}</span>
                                            <button type="button" onClick={() => removeQuestion(idx)} className="text-slate-400 hover:text-red-500">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <input
                                            value={q.question_text}
                                            onChange={(e) => updateQuestion(idx, 'question_text', e.target.value)}
                                            className="provider-input w-full bg-white"
                                            placeholder="Question text..."
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <select
                                                value={q.question_type}
                                                onChange={(e) => updateQuestion(idx, 'question_type', e.target.value)}
                                                className="provider-input w-full bg-white"
                                            >
                                                <option value="text">Short Text</option>
                                                <option value="number">Number</option>
                                                <option value="boolean">Yes/No</option>
                                                <option value="dropdown">Dropdown</option>
                                            </select>
                                            <div className="flex items-center gap-2 px-3">
                                                <input
                                                    type="checkbox"
                                                    checked={q.is_required}
                                                    onChange={(e) => updateQuestion(idx, 'is_required', e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-300"
                                                />
                                                <span className="text-xs text-slate-600 font-medium tracking-tight">Required Response</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sticky Action Bar */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40">
                            <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
                                <div className="text-xs text-slate-400 font-mono hidden md:block italic">
                                    Fields with * are required for platform indexing
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 md:flex-none provider-btn-secondary px-8"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 md:flex-none provider-btn-primary px-12"
                                    >
                                        {editingJobId ? 'Update Role' : 'Publish Role'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </ProviderLayout>
        );
    }

    return (
        <ProviderLayout>
            <TopProgressBar loading={loading} />

            {/* View Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Job Pipeline</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage active roles and track candidate acquisition</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            setEditingJobId(null);
                            setFormData({
                                job_title: '', department: '', job_type: 'Full-time', experience_level: 'Junior',
                                location: '', salary_min: '', salary_max: '', job_description: '',
                                required_skills: '', required_education: '', remote: false,
                                require_education: false, require_skills: false
                            });
                            setRequirements([{ requirement_text: '', is_mandatory: true }]);
                            setQuestions([{ question_text: '', question_type: 'text', options: [], is_required: true, expected_answer: '' }]);
                            setExpectations({ expected_experience_years: '', expected_education: '', notes: '' });
                            setShowForm(true);
                        }}
                        className="provider-btn-primary ripple-btn flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Position
                    </button>
                </div>
            </div>

            {/* Sticky Filter Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6 sticky top-[80px] z-40 bg-white/80 backdrop-blur-xl p-4 -mx-4 rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] provider-panel">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search positions, teams, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="provider-input w-full pl-10 bg-slate-50/50"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="provider-input w-full md:w-36 text-xs font-semibold bg-slate-50/50"
                    >
                        <option>All Status</option>
                        <option>Open</option>
                        <option>Closed</option>
                        <option>Draft</option>
                    </select>
                </div>
            </div>

            {/* Main Content View */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <DataTable
                            columns={columns}
                            data={filteredJobs}
                            loading={loading && jobs.length === 0}
                            emptyMessage="No positions match your search criteria."
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid-view"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.98 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                            <motion.div
                                key={job.job_id}
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                className="provider-panel p-6 group hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Status Dot Pulse */}
                                <div className="absolute top-6 right-6 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${job.status === 'Open' ? 'bg-green-500' : job.status === 'Closed' ? 'bg-rose-500' : 'bg-slate-400'}`} />
                                    <StatusBadge status={job.status} />
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                        <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleEditClick(job)}>
                                    {job.job_title}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1 mb-4">{job.department}</p>

                                <div className="space-y-2 mb-6 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{job.location || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{job.applicant_count || 0} Candidates</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="text-[10px] text-slate-400">
                                        Posted {new Date(job.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEditClick(job)}
                                            className="px-3 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            MANAGE
                                        </button>
                                        {jobToDelete === job.job_id ? (
                                            <div className="flex items-center gap-1 ml-2">
                                                <button onClick={() => confirmDelete(job.job_id)} className="px-2 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded">Yes</button>
                                                <button onClick={() => setJobToDelete(null)} className="px-2 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded">No</button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setJobToDelete(job.job_id)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors relative z-10"
                                                title="Delete Job"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full">
                                <EmptyState
                                    icon={Briefcase}
                                    title="No positions found"
                                    description="Try adjusting your filters or search query to find what you're looking for."
                                    actionLabel="Clear Filters"
                                    onAction={() => {
                                        setSearchQuery('');
                                        setFilterStatus('All');
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </ProviderLayout>
    );
};

export default JobPosting;
