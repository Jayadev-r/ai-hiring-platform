import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Camera,
    Globe,
    MapPin,
    Linkedin,
    Twitter,
    UploadCloud,
    Save,
    Trash2,
    Users,
    ArrowUpRight,
    Briefcase,
    ShieldCheck,
    Mail,
    Phone,
    Globe2,
    Fingerprint,
    CheckCircle2
} from 'lucide-react';
import { ProviderLayout } from '../../components/provider-layout';
import { TopProgressBar, StatusBadge } from '../../components/provider-ui';
import { useProviderToast } from '../../contexts/ProviderToastContext';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Employer Branding Studio
 * Rebuilt as a high-fidelity control center for corporate identity.
 */
const CompanyProfile = () => {
    const { user } = useAuth();
    const toast = useProviderToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website_url: '',
        location: '',
        description: '',
        linkedin_url: '',
        twitter_url: ''
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);

    useEffect(() => {
        fetchCompanyProfile();
    }, []);

    const fetchCompanyProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/companies/mine');
            if (response.data.company) {
                const { name, industry, website_url, location, description, linkedin_url, twitter_url, logo } = response.data.company;
                setFormData({
                    name: name || '',
                    industry: industry || '',
                    website_url: website_url || '',
                    location: location || '',
                    description: description || '',
                    linkedin_url: linkedin_url || '',
                    twitter_url: twitter_url || ''
                });
                if (logo) {
                    setLogoPreview(logo);
                }
            }
        } catch (error) {
            toast.error('Failed to synchronize identity data.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Identity media must be under 2MB');
                return;
            }
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            setSaving(true);
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (logoFile) data.append('logo', logoFile);

            const response = await api.post('/companies', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                toast.success('Corporate identity synchronized successfully');
                fetchCompanyProfile();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to sync identity');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProviderLayout>
            <TopProgressBar loading={loading || saving} />

            <div className="max-w-[1400px] mx-auto px-6 py-10">
                {/* Header Context */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        {/* Company Logo Header */}
                        <div className="w-20 h-20 rounded-2xl bg-provider-slate-50 border border-provider-slate-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 className="w-8 h-8 text-provider-slate-300" />
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-provider-slate-500 mb-1">
                                <Fingerprint className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Company Protocol</span>
                            </div>
                            <h1 className="text-4xl font-black text-provider-slate-900 tracking-tight">
                                {formData.name || 'Identity Console'}
                            </h1>
                            <p className="text-sm font-medium text-provider-slate-400 mt-2">Structure your employer brand and corporate presence.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Visual Identity */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <div className="provider-panel p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-provider-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />

                            <h2 className="text-[10px] font-black uppercase tracking-wider text-provider-slate-400 mb-6 flex items-center gap-2">
                                <Camera className="w-3 h-3" />
                                Visual Core
                            </h2>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative aspect-square w-full max-w-[200px] mx-auto rounded-3xl bg-provider-slate-50 border-2 border-dashed border-provider-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-provider-blue-400 transition-all overflow-hidden"
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-provider-slate-400 text-center px-4">
                                        <UploadCloud className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="text-xs font-black uppercase tracking-tighter leading-none">Drop Architecture<br /><span className="text-[10px] opacity-50">or click to browse</span></p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-provider-blue-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Camera className="w-8 h-8 text-white scale-125" />
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />

                            <div className="mt-10 space-y-4">
                                <div className="p-4 bg-provider-slate-50 rounded-2xl border border-provider-slate-100">
                                    <div className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest mb-3">Verification Matrix</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-provider-slate-600">Active Jobs</span>
                                            <span className="text-xs font-black text-provider-slate-900">04</span>
                                        </div>
                                        <div className="flex items-center justify-between text-provider-blue-600">
                                            <span className="text-xs font-bold">Reliability</span>
                                            <div className="flex items-center gap-1 font-black text-xs">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="provider-panel p-6 border-none shadow-xl">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-provider-slate-400 mb-4">Master Credentials</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-provider-blue-600 flex items-center justify-center font-black text-xl">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-black truncate tracking-tight">{user?.name}</div>
                                    <div className="text-[10px] font-medium text-provider-slate-400 truncate uppercase tracking-widest">{user?.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Data Architecture */}
                    <div className="lg:col-span-8 space-y-8 pb-32">
                        <div className="provider-panel p-10 space-y-12 shadow-sm border-none">
                            <section>
                                <h2 className="text-sm font-black uppercase tracking-widest text-provider-slate-400 mb-8 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-provider-blue-600" />
                                    Base Infrastructure
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-provider-slate-500 uppercase tracking-widest ml-1">Company Legal Handle</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="provider-input w-full h-14 text-lg font-black tracking-tight"
                                            placeholder="HireX Global"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-provider-slate-500 uppercase tracking-widest ml-1">Industry Sector</label>
                                        <input
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                            className="provider-input w-full h-12 font-bold"
                                            placeholder="DeepTech / AI Automation"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-provider-slate-500 uppercase tracking-widest ml-1">Geographic HQ</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-provider-slate-400" />
                                            <input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="provider-input w-full pl-10 h-12 font-bold"
                                                placeholder="Bangalore, Hybrid"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-provider-slate-500 uppercase tracking-widest ml-1">Digital Coordinates (Website)</label>
                                        <div className="relative">
                                            <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-provider-slate-400" />
                                            <input
                                                name="website_url"
                                                value={formData.website_url}
                                                onChange={handleInputChange}
                                                className="provider-input w-full pl-10 h-12 font-bold"
                                                placeholder="https://hirex.ai"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-black uppercase tracking-widest text-provider-slate-400 mb-8 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-provider-blue-600" />
                                    The Manifesto
                                </h2>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-provider-slate-500 uppercase tracking-widest ml-1">Mission & Culture Statement</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="provider-input w-full min-h-[150px] py-4 px-6 font-medium leading-relaxed resize-none"
                                        placeholder="We are building the future of algorithmic hiring..."
                                    />
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-black uppercase tracking-widest text-provider-slate-400 mb-8 flex items-center gap-2">
                                    <ArrowUpRight className="w-4 h-4 text-provider-blue-600" />
                                    Social Expansion
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center bg-provider-slate-50 border-r border-provider-slate-200 rounded-l-2xl group-focus-within:bg-provider-blue-50 group-focus-within:border-provider-blue-200 transition-colors">
                                            <Linkedin className="w-4 h-4 text-[#0077B5]" />
                                        </div>
                                        <input
                                            name="linkedin_url"
                                            value={formData.linkedin_url}
                                            onChange={handleInputChange}
                                            className="provider-input w-full pl-16 h-12 font-bold"
                                            placeholder="LinkedIn Handle"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center bg-provider-slate-50 border-r border-provider-slate-200 rounded-l-2xl group-focus-within:bg-provider-blue-50 group-focus-within:border-provider-blue-200 transition-colors">
                                            <Twitter className="w-4 h-4 text-provider-slate-900" />
                                        </div>
                                        <input
                                            name="twitter_url"
                                            value={formData.twitter_url}
                                            onChange={handleInputChange}
                                            className="provider-input w-full pl-16 h-12 font-bold"
                                            placeholder="X / Twitter Handle"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </form>

                {/* Global Commit Bar */}
                <div
                    className="fixed bottom-0 left-0 right-0 backdrop-blur-2xl border-t px-6 py-6 z-[100]"
                    style={{ backgroundColor: 'var(--theme-card-bg)', borderTopColor: 'var(--theme-border)' }}
                >
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-px bg-provider-slate-200" />
                            <p className="text-[10px] font-black text-provider-slate-400 uppercase tracking-widest">Master Identity Sync Status: <span className={saving ? "text-amber-600" : "text-emerald-600"}>{saving ? "PROCESSING..." : "VERIFIED"}</span></p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="provider-btn-secondary px-8 h-12 font-black uppercase text-xs tracking-widest shadow-sm"
                            >
                                Revert Identity
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="provider-btn-primary px-12 h-12 font-black uppercase text-xs tracking-widest shadow-2xl shadow-provider-blue-200 flex items-center gap-2 min-w-[200px] justify-center"
                            >
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Sync Architecture
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProviderLayout>
    );
};

export default CompanyProfile;
