
import React, { useState, useEffect } from 'react';
import { X, Save, Check, AlertCircle, Plus, Trash2, ChevronRight, ChevronDown, Wand2, Type, Layout, List } from 'lucide-react';
import { Button } from '../ui';
import axios from '../../api/axios';

const ResumeEditor = ({ isOpen, onClose, originalText, optimizedData, onSaveSuccess }) => {
    const [resume, setResume] = useState(optimizedData.optimized_resume);
    const [meta, setMeta] = useState({
        matchScore: optimizedData.match_score,
        missingRequired: optimizedData.missing_required_skills,
        missingPreferred: optimizedData.missing_preferred_skills,
        suggestions: optimizedData.suggestions
    });
    const [activeSection, setActiveSection] = useState('summary');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const response = await axios.post('/ai/resume/save-optimized', {
                optimized_resume: resume,
                resume_name: `Optimized_Resume_${new Date().toLocaleDateString()}.pdf`
            });

            if (response.data.success) {
                onSaveSuccess && onSaveSuccess(response.data.data);
                onClose();
            }
        } catch (err) {
            console.error('Save failed:', err);
            setError(err.response?.data?.error || 'Failed to save optimized resume.');
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (section, field, value) => {
        setResume(prev => ({
            ...prev,
            [section]: value
        }));
    };

    const updateArrayField = (section, index, field, value) => {
        const newArr = [...resume[section]];
        newArr[index] = { ...newArr[index], [field]: value };
        updateField(section, null, newArr);
    };

    const addListItem = (section, template) => {
        setResume(prev => ({
            ...prev,
            [section]: [...prev[section], template]
        }));
    };

    const removeListItem = (section, index) => {
        setResume(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-md flex flex-col font-sans overflow-hidden p-4">
            <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
                {/* Nav Bar */}
                <div className="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                            <Wand2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="font-heading text-lg font-bold text-slate-900">Resume Studio</h2>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Match: {meta.matchScore}%</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-indigo-500">Groq AI Optimized</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                            Discard Changes
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-md transition-all font-bold"
                        >
                            {isSaving ? 'Saving...' : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Resume
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Pane: Guidance & Original */}
                    <div className="w-1/4 border-r border-slate-100 flex flex-col overflow-hidden bg-slate-50">
                        <div className="p-4 border-b border-slate-100 bg-white">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                AI Suggestions
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Summary Suggestion */}
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                    <Layout className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Summary Insight</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                    "{meta.suggestions.improve_summary}"
                                </p>
                            </div>

                            {/* Gaps */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[10px] font-bold text-red-500 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                        <AlertCircle className="w-3 h-3" /> Missing Critical Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {meta.missingRequired.map((s, i) => (
                                            <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold text-amber-600 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                        <Plus className="w-3 h-3" /> Recommended Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {meta.missingPreferred.map((s, i) => (
                                            <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-200">
                                <h4 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Original Draft</h4>
                                <div className="bg-white p-4 rounded-2xl text-[11px] text-slate-600 font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto border border-slate-200 shadow-inner">
                                    {originalText}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Pane: Editor */}
                    <div className="flex-1 flex overflow-hidden bg-white">
                        {/* Navigation Sidebar */}
                        <div className="w-48 border-r border-slate-100 py-4 bg-slate-50/50">
                            <nav className="px-3 space-y-1.5">
                                {[
                                    { id: 'summary', name: 'Summary', icon: Type },
                                    { id: 'skills', name: 'Key Skills', icon: Layout },
                                    { id: 'experience', name: 'Experience', icon: List },
                                    { id: 'projects', name: 'Projects', icon: Wand2 },
                                    { id: 'education', name: 'Education', icon: Check }
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-bold ${activeSection === item.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Main Workspace */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-slate-50/30">
                            <div className="max-w-3xl mx-auto rounded-3xl min-h-[1000px] p-12 text-slate-900 bg-white shadow-xl border border-slate-100">
                                {/* Editor UI based on activeSection */}
                                {activeSection === 'summary' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold border-b-2 border-indigo-100 pb-2 mb-6 text-slate-900">Professional Summary</h3>
                                        <textarea
                                            className="w-full h-[300px] border-none focus:ring-0 text-slate-700 text-sm leading-relaxed p-0 resize-none font-serif bg-transparent placeholder-slate-400 font-medium"
                                            value={resume.summary}
                                            onChange={(e) => updateField('summary', null, e.target.value)}
                                            placeholder="Write a compelling summary..."
                                        />
                                    </div>
                                )}

                                {activeSection === 'skills' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold border-b-2 border-indigo-100 pb-2 mb-6 text-slate-900">Technical Skills</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {resume.skills.map((skill, i) => (
                                                <div key={i} className="group flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-colors border border-slate-200 bg-slate-50 hover:border-indigo-300">
                                                    <input
                                                        className="bg-transparent border-none p-0 focus:ring-0 w-auto min-w-[50px] text-slate-700 placeholder-slate-400 font-bold"
                                                        value={skill}
                                                        onChange={(e) => {
                                                            const newSkills = [...resume.skills];
                                                            newSkills[i] = e.target.value;
                                                            updateField('skills', null, newSkills);
                                                        }}
                                                    />
                                                    <button onClick={() => removeListItem('skills', i)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addListItem('skills', 'New Skill')}
                                                className="px-4 py-1.5 border border-dashed border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-sm transition-all flex items-center gap-2 font-bold bg-white shadow-sm hover:shadow-md"
                                            >
                                                <Plus className="w-3 h-3" /> Add Skill
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'experience' && (
                                    <div className="space-y-8">
                                        <h3 className="text-xl font-bold border-b-2 border-indigo-100 pb-2 mb-6 text-slate-900">Work Experience</h3>
                                        {resume.experience.map((exp, i) => (
                                            <div key={i} className="relative group p-6 rounded-2xl transition-all border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg hover:border-indigo-100">
                                                <button
                                                    onClick={() => removeListItem('experience', i)}
                                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <div className="flex gap-4 mb-4">
                                                    <input
                                                        className="flex-1 text-lg font-bold border-none focus:ring-0 p-0 bg-transparent text-slate-900 placeholder-slate-400"
                                                        value={exp.title}
                                                        onChange={(e) => updateArrayField('experience', i, 'title', e.target.value)}
                                                        placeholder="Job Title"
                                                    />
                                                    <input
                                                        className="text-right text-sm font-bold border-none focus:ring-0 p-0 bg-transparent text-slate-500 placeholder-slate-400"
                                                        value={exp.duration}
                                                        onChange={(e) => updateArrayField('experience', i, 'duration', e.target.value)}
                                                        placeholder="Dates"
                                                    />
                                                </div>
                                                <input
                                                    className="w-full text-md font-bold text-indigo-600 mb-4 border-none focus:ring-0 p-0 bg-transparent placeholder-indigo-300"
                                                    value={exp.company}
                                                    onChange={(e) => updateArrayField('experience', i, 'company', e.target.value)}
                                                    placeholder="Company Name"
                                                />
                                                <div className="space-y-2">
                                                    {exp.responsibilities.map((resp, ri) => (
                                                        <div key={ri} className="flex gap-3 group/item">
                                                            <span className="text-indigo-400 mt-1.5">•</span>
                                                            <textarea
                                                                className="flex-1 text-sm border-none focus:ring-0 p-0 resize-none min-h-[20px] bg-transparent text-slate-600 placeholder-slate-400 font-medium"
                                                                rows={1}
                                                                value={resp}
                                                                onChange={(e) => {
                                                                    const newResps = [...exp.responsibilities];
                                                                    newResps[ri] = e.target.value;
                                                                    updateArrayField('experience', i, 'responsibilities', newResps);
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => {
                                                            const newResps = [...exp.responsibilities, 'New responsibility bullet...'];
                                                            updateArrayField('experience', i, 'responsibilities', newResps);
                                                        }}
                                                        className="ml-6 text-[10px] uppercase tracking-widest text-indigo-500 font-bold hover:underline"
                                                    >
                                                        + Add Bullet Point
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            onClick={() => addListItem('experience', { company: 'Company', title: 'Title', duration: 'Date - Date', responsibilities: ['Key achievement...', 'Project lead...'] })}
                                            className="w-full py-6 transition-all border-dashed border-2 border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/50 font-bold rounded-2xl shadow-sm"
                                        >
                                            <Plus className="w-5 h-5 mr-2" /> Add Experience Block
                                        </Button>
                                    </div>
                                )}

                                {activeSection === 'projects' && (
                                    <div className="space-y-8">
                                        <h3 className="text-xl font-bold border-b-2 border-indigo-100 pb-2 mb-6 text-slate-900">Key Projects</h3>
                                        {resume.projects.map((proj, i) => (
                                            <div key={i} className="relative group p-6 rounded-2xl transition-all border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg hover:border-indigo-100">
                                                <button
                                                    onClick={() => removeListItem('projects', i)}
                                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <input
                                                    className="w-full text-lg font-bold border-none focus:ring-0 p-0 mb-2 bg-transparent text-slate-900 placeholder-slate-400"
                                                    value={proj.title}
                                                    onChange={(e) => updateArrayField('projects', i, 'title', e.target.value)}
                                                    placeholder="Project Title"
                                                />
                                                <textarea
                                                    className="w-full text-sm border-none focus:ring-0 p-0 resize-none mb-4 bg-transparent text-slate-600 placeholder-slate-400 font-medium"
                                                    value={proj.description}
                                                    onChange={(e) => updateArrayField('projects', i, 'description', e.target.value)}
                                                    placeholder="Describe the impact and tech stack..."
                                                />
                                                <div className="flex flex-wrap gap-2">
                                                    {proj.technologies.map((tech, ti) => (
                                                        <span key={ti} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md italic bg-white border border-slate-200 text-slate-600 shadow-sm">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            onClick={() => addListItem('projects', { title: 'Personal Project', description: 'Brief description of what you built...', technologies: ['React', 'Node.js'] })}
                                            className="w-full py-6 transition-all border-dashed border-2 border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/50 font-bold rounded-2xl shadow-sm"
                                        >
                                            <Plus className="w-5 h-5 mr-2" /> Add Project
                                        </Button>
                                    </div>
                                )}

                                {activeSection === 'education' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold border-b-2 border-indigo-100 pb-2 mb-6 text-slate-900">Education</h3>
                                        <textarea
                                            className="w-full h-[200px] border-none focus:ring-0 text-md p-0 resize-none font-serif bg-transparent text-slate-700 placeholder-slate-400 font-medium"
                                            value={resume.education}
                                            onChange={(e) => updateField('education', null, e.target.value)}
                                            placeholder="University Name, Degree, Graduation Year..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="absolute bottom-20 right-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl shadow-2xl animate-in slide-in-from-bottom flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-bold">{error}</span>
                        <button onClick={() => setError(null)} className="hover:bg-red-100 p-1 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeEditor;
