
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Bot, Sliders, Play, Pause, Save } from 'lucide-react';
import { Button } from '../ui';

const AutoApplyModal = ({ isOpen, onClose, active, onToggle }) => {
    const [settings, setSettings] = useState({
        dailyLimit: 15,
        minMatch: 85,
        remoteOnly: true,
        locations: ['San Francisco', 'New York', 'Remote'],
        keywords: ['React', 'Node.js', 'AI']
    });

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center font-sans">
            <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" style={{ background: 'rgba(15,20,55,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.15)' }}>
                            <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Auto-Apply Agent</h2>
                            <p className="text-sm text-slate-400">Autonomous Application Bot Configuration</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/[0.08] rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="p-4 rounded-xl border flex items-center justify-between transition-colors" style={{ background: active ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)', borderColor: active ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${active ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-600'}`} />
                            <div>
                                <h3 className="font-semibold text-white">Agent Status: {active ? <span className="text-green-400">Running</span> : <span className="text-slate-400">Paused</span>}</h3>
                                <p className="text-sm text-slate-400">{active ? 'Currently scanning based on rules below.' : 'Agent is sleeping.'}</p>
                            </div>
                        </div>
                        <Button
                            onClick={onToggle}
                            className={active ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30'}
                            style={{ border: '1px solid' }}
                        >
                            {active ? <><Pause className="w-4 h-4 mr-2" /> Pause Agent</> : <><Play className="w-4 h-4 mr-2" /> Start Agent</>}
                        </Button>
                    </div>

                    <div className="border-t border-white/[0.08] pt-6 mt-6">
                        <h3 className="flex items-center gap-2 font-bold text-white mb-6">
                            <Sliders className="w-4 h-4 text-purple-400" /> Configuration Rules
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Daily Application Limit</label>
                                <input type="number" value={settings.dailyLimit} onChange={e => setSettings({ ...settings, dailyLimit: e.target.value })} className="w-full p-2.5 rounded-lg bg-black/20 border-white/[0.08] text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Min. Match Score %</label>
                                <input type="number" value={settings.minMatch} onChange={e => setSettings({ ...settings, minMatch: e.target.value })} className="w-full p-2.5 rounded-lg bg-black/20 border-white/[0.08] text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Locations</label>
                                <div className="p-3 rounded-lg flex flex-wrap gap-2.5" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {settings.locations.map(l => (
                                        <span key={l} className="px-2.5 py-1 rounded-md text-sm flex items-center gap-1.5 text-slate-200" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {l} <X className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-red-400 transition-colors" />
                                        </span>
                                    ))}
                                    <button className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline px-2 transition-colors">+ Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-white/[0.08] flex justify-end gap-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/[0.05]">Cancel</Button>
                    <Button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 border-none">
                        <Save className="w-4 h-4 mr-2" /> Save Settings
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AutoApplyModal;
