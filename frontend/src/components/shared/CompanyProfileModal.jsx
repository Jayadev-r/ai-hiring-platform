import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building2, Globe, Linkedin, Twitter, Loader2, Calendar } from 'lucide-react';
import { getPublicCompany } from '../../api/companies';

const CompanyProfileModal = ({ isOpen, onClose, companyId }) => {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && companyId) {
            setLoading(true);
            setError(null);
            getPublicCompany(companyId)
                .then(res => {
                    if (res.success) {
                        setCompany(res.company);
                    } else {
                        setError('Failed to load company profile.');
                    }
                })
                .catch(err => {
                    console.error(err);
                    setError('An error occurred while loading the company profile.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, companyId]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/50"
                    >
                        {/* Header & Controls */}
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100/80 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
                                    <p className="text-sm font-bold tracking-widest uppercase">Loading Profile...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-20 text-red-500 text-center">
                                    <Building2 className="w-12 h-12 mb-4 opacity-50" />
                                    <p className="font-bold text-lg">{error}</p>
                                    <button onClick={onClose} className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200">Close</button>
                                </div>
                            ) : company && (
                                <div className="space-y-8">
                                    {/* Company Header */}
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                                        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-200 flex items-center justify-center shadow-inner shrink-0 p-3">
                                            {company.logo ? (
                                                <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <Building2 className="w-10 h-10 text-slate-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-heading font-black text-slate-900 mb-2">{company.name}</h2>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-semibold text-slate-600">
                                                {company.industry && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                                                        <Building2 className="w-4 h-4" /> {company.industry}
                                                    </span>
                                                )}
                                                {company.location && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                                                        <MapPin className="w-4 h-4 text-slate-400" /> {company.location}
                                                    </span>
                                                )}
                                                {company.created_at && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                                                        <Calendar className="w-4 h-4 text-slate-400" /> Joined {new Date(company.created_at).getFullYear()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {company.description && (
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div> About Us
                                            </h3>
                                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-600 leading-relaxed font-medium">
                                                {company.description.split('\n').map((para, i) => (
                                                    <p key={i} className="mb-2 last:mb-0">{para}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Social Links */}
                                    <div className="pt-4 border-t border-slate-100">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Connect</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {company.website_url && (
                                                <a href={company.website_url.startsWith('http') ? company.website_url : `https://${company.website_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all">
                                                    <Globe className="w-4 h-4" /> Website
                                                </a>
                                            )}
                                            {company.linkedin_url && (
                                                <a href={company.linkedin_url.startsWith('http') ? company.linkedin_url : `https://${company.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-xl font-bold text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all">
                                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                                </a>
                                            )}
                                            {company.twitter_url && (
                                                <a href={company.twitter_url.startsWith('http') ? company.twitter_url : `https://${company.twitter_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-black/5 border border-black/10 rounded-xl font-bold text-black hover:bg-black hover:text-white transition-all">
                                                    <Twitter className="w-4 h-4" /> Twitter
                                                </a>
                                            )}
                                            {!company.website_url && !company.linkedin_url && !company.twitter_url && (
                                                <p className="text-slate-400 font-medium italic text-sm">No external links provided.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CompanyProfileModal;
