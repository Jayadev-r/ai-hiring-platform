import React, { useState, useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Loader2, BookOpen, Clock, Target, X } from 'lucide-react';
import axios from '../../api/axios';

const CareerRoadmapModal = ({ isOpen, onClose }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [skill, setSkill] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [loading, setLoading] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [error, setError] = useState('');

    const generateRoadmap = async () => {
        if (!skill.trim()) return;
        setLoading(true);
        setError('');
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);

        try {
            const res = await axios.post('/career-roadmap/generate', { skill, currentLevel: level });
            if (res.data.success) {
                const { nodes: apiNodes, edges: apiEdges } = res.data.data;

                const formattedNodes = apiNodes.map(n => ({
                    ...n,
                    type: 'default',
                    draggable: false,
                    selectable: true,
                    style: {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: '2px solid #5a67d8',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        minWidth: 220,
                        minHeight: 80,
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff',
                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        lineHeight: '1.4'
                    }
                }));

                const formattedEdges = apiEdges.map(e => ({
                    ...e,
                    animated: true,
                    style: { stroke: '#8b5cf6', strokeWidth: 3 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#8b5cf6',
                        width: 25,
                        height: 25
                    },
                }));

                setNodes(formattedNodes);
                setEdges(formattedEdges);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="rounded-2xl w-[95vw] h-[90vh] flex flex-col overflow-hidden" style={{ background: 'rgba(10,15,46,0.95)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
                {/* Header */}
                <div className="p-6 border-b border-white/[0.08] flex items-center justify-between" style={{ background: 'rgba(10,15,46,0.98)' }}>
                    <div>
                        <h2 className="font-heading text-2xl font-bold text-white">AI Career Roadmap</h2>
                        <p className="text-sm text-slate-400 mt-1">Visualize your <span className="text-cyan-400">learning journey</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-4 border-b border-white/[0.08] flex gap-4 items-end" style={{ background: 'rgba(15,20,55,0.90)' }}>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Skill</label>
                        <input
                            type="text"
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            placeholder="e.g. React Native, Data Science"
                            className="w-full p-2 rounded-lg text-sm text-white placeholder-slate-500"
                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                            onKeyDown={(e) => e.key === 'Enter' && generateRoadmap()}
                        />
                    </div>
                    <div className="w-48">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Level</label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full p-2 rounded-lg text-sm text-white"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                        >
                            <option value="Beginner" style={{ background: '#0a0f2e' }}>Beginner</option>
                            <option value="Intermediate" style={{ background: '#0a0f2e' }}>Intermediate</option>
                            <option value="Advanced" style={{ background: '#0a0f2e' }}>Advanced</option>
                        </select>
                    </div>
                    <button
                        onClick={generateRoadmap}
                        disabled={loading || !skill}
                        className="btn-neon-purple px-6 py-2 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 h-[38px] text-sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                        Generate
                    </button>
                </div>

                {/* Graph Area */}
                <div className="flex-1 relative" style={{ background: '#080d25' }}>
                    {error && (
                        <div className="absolute top-4 left-4 z-10 bg-red-400/10 text-red-400 px-4 py-2 rounded-lg text-sm border border-red-400/30">
                            {error}
                        </div>
                    )}

                    {nodes.length === 0 && !loading && !error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                            <Target className="w-12 h-12 mb-2 opacity-20" />
                            <p>Enter a skill to visualize your learning path</p>
                        </div>
                    )}

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={true}
                        fitView
                        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
                        minZoom={0.5}
                        maxZoom={1.5}
                        attributionPosition="bottom-left"
                    >
                        <Controls style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                        <MiniMap nodeStrokeColor="#7c3aed" nodeColor="#4c1d95" style={{ background: 'rgba(10,15,46,0.9)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <Background color="#1e293b" gap={16} />
                    </ReactFlow>

                    {/* Node Details Drawer */}
                    {selectedNode && (
                        <div className="absolute top-4 right-4 w-80 rounded-xl overflow-hidden z-20" style={{ background: 'rgba(10,15,46,0.96)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            <div className="p-4 border-b border-white/[0.08] flex justify-between items-start" style={{ background: 'rgba(124,58,237,0.15)' }}>
                                <div>
                                    <h3 className="font-bold text-white">{selectedNode.data.label}</h3>
                                    <div className="flex items-center gap-1 text-xs text-purple-400 mt-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{selectedNode.data.estimated_time || 'Self-paced'}</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-slate-300 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4 max-h-[60vh] overflow-y-auto">
                                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                    {selectedNode.data.description}
                                </p>

                                {selectedNode.data.resources && selectedNode.data.resources.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" /> Resources
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedNode.data.resources.map((res, idx) => (
                                                <li key={idx}>
                                                    <a
                                                        href={res.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline block truncate transition-colors"
                                                    >
                                                        {res.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmapModal;
