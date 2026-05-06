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
import { Loader2, BookOpen, Clock, Target, X, ArrowLeft } from 'lucide-react';
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
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                        border: '2px solid #312e81',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        minWidth: 220,
                        minHeight: 80,
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#ffffff',
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
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
                    style: { stroke: '#6366f1', strokeWidth: 3 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#6366f1',
                        width: 20,
                        height: 20
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
            <div className="rounded-3xl w-[95vw] h-[90vh] flex flex-col overflow-hidden bg-white shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-indigo-600 mr-1"
                            title="Back"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                            <Target className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="font-heading text-xl font-bold text-slate-900">AI Career Roadmap</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Visualize your <span className="text-indigo-500">learning journey</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-4 border-b border-slate-100 flex gap-4 items-end bg-slate-50">
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Target Skill</label>
                        <input
                            type="text"
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            placeholder="e.g. React Native, Data Science"
                            className="w-full p-2.5 rounded-xl text-sm text-slate-900 bg-white border border-slate-200 outline-none focus:border-indigo-500 placeholder-slate-400 font-medium"
                            onKeyDown={(e) => e.key === 'Enter' && generateRoadmap()}
                        />
                    </div>
                    <div className="w-48">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Current Level</label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full p-2.5 rounded-xl text-sm text-slate-900 bg-white border border-slate-200 outline-none focus:border-indigo-500 font-bold"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <button
                        onClick={generateRoadmap}
                        disabled={loading || !skill}
                        className="btn-indigo px-6 py-2.5 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 h-[42px] text-sm shadow-md transition-all active:scale-95"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                        Generate Roadmap
                    </button>
                </div>

                {/* Graph Area */}
                <div className="flex-1 relative bg-slate-50">
                    {error && (
                        <div className="m-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
                            <X className="w-4 h-4" />
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
                        <Background color="#cbd5e1" gap={20} />
                        <Controls className="bg-white border border-slate-200 rounded-lg shadow-md" />
                    </ReactFlow>

                    {/* Node Details Drawer */}
                    {selectedNode && (
                        <div className="absolute top-4 right-4 w-80 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 animate-in slide-in-from-right-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900">Step Details</h3>
                                <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-slate-100 rounded-full">
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Skill Topic</h4>
                                        <p className="text-sm font-bold text-slate-900">{selectedNode.data.label}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Time</h4>
                                        <p className="text-sm font-bold text-slate-900">{selectedNode.data.estimated_time || '2-4 weeks'}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 leading-relaxed">
                                    {selectedNode.data.description}
                                </div>

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
