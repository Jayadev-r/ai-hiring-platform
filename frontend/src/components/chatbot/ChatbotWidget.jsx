import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    Minimize2,
    Maximize2,
    Sparkles,
    Paperclip,
    GripHorizontal
} from 'lucide-react';

/**
 * ChatbotWidget — draggable + droppable chat widget.
 * - Drag via the grip handle in the header (or the launcher button itself when closed).
 * - Position is clamped inside the viewport and persisted to localStorage.
 * - Works with both mouse and touch via Pointer Events API.
 */
const STORAGE_KEY = 'chatbot_widget_pos';
const WIDGET_W = 64; // launcher button width
const WIDGET_H = 64; // launcher button height

const getInitialPos = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (_) {}
    // default: bottom-right
    return {
        x: window.innerWidth - WIDGET_W - 24,
        y: window.innerHeight - WIDGET_H - 24,
    };
};

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi there! I'm your AI Hiring Assistant. How can I help you with your journey today?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // --- drag state ---
    const [pos, setPos] = useState(getInitialPos);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const hasDragged = useRef(false); // distinguish click vs drag
    const containerRef = useRef(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) scrollToBottom();
    }, [messages, isOpen, isMinimized, isTyping]);

    // persist position
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    }, [pos]);

    // --- Pointer event drag handlers ---
    const onPointerDown = useCallback((e) => {
        // Only drag with primary button (left-click / touch)
        if (e.button !== undefined && e.button !== 0) return;
        isDragging.current = true;
        hasDragged.current = false;
        dragOffset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        e.preventDefault();
    }, [pos]);

    const onPointerMove = useCallback((e) => {
        if (!isDragging.current) return;
        hasDragged.current = true;

        const newX = clamp(
            e.clientX - dragOffset.current.x,
            0,
            window.innerWidth - WIDGET_W
        );
        const newY = clamp(
            e.clientY - dragOffset.current.y,
            0,
            window.innerHeight - WIDGET_H
        );
        setPos({ x: newX, y: newY });
    }, []);

    const onPointerUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    // Re-clamp on window resize
    useEffect(() => {
        const onResize = () => {
            setPos(prev => ({
                x: clamp(prev.x, 0, window.innerWidth - WIDGET_W),
                y: clamp(prev.y, 0, window.innerHeight - WIDGET_H),
            }));
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // --- Chat logic ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_BASE_URL}/chatbot/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage.text })
            });
            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: data.answer,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } else throw new Error(data.message);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleChat = () => {
        // Don't open/close if we just finished dragging
        if (hasDragged.current) return;
        setIsOpen(prev => !prev);
        setIsMinimized(false);
    };

    // Determine if the chat window should open upward or downward
    const openUpward = pos.y > window.innerHeight / 2;
    // Determine if chat window should open to left or right of the button
    const openLeft = pos.x > window.innerWidth - 420;

    const chatWindowStyle = {
        position: 'absolute',
        width: '360px',
        ...(openUpward
            ? { bottom: WIDGET_H + 12 }
            : { top: WIDGET_H + 12 }),
        ...(openLeft
            ? { right: 0 }
            : { left: 0 }),
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                width: WIDGET_W,
                height: WIDGET_H,
                zIndex: 9999,
                userSelect: 'none',
            }}
        >
            {/* Chat Window — absolutely positioned relative to the launcher */}
            {isOpen && (
                <div
                    style={chatWindowStyle}
                    className={`bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300
                        ${isMinimized ? 'h-14' : 'h-[500px]'}
                    `}
                >
                    {/* Header — also acts as drag handle for the whole widget */}
                    <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 text-white flex items-center justify-between shadow-md cursor-grab active:cursor-grabbing select-none"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        title="Drag to reposition"
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                <Sparkles size={16} className="text-white animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-none">HireX Assistant</h3>
                                <div className="flex items-center mt-1 gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                    <span className="text-[10px] text-blue-100 uppercase tracking-wider font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Drag hint icon */}
                            <GripHorizontal size={14} className="text-white/40 mr-1" />
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsMinimized(v => !v); }}
                                onPointerDown={e => e.stopPropagation()}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                title={isMinimized ? 'Maximize' : 'Minimize'}
                            >
                                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                onPointerDown={e => e.stopPropagation()}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                title="Close"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`flex-shrink-0 mt-1 ${msg.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                                                {msg.sender === 'bot' ? (
                                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                                                        <Bot size={14} />
                                                    </div>
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                                                        <User size={14} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className={`px-3 py-2 rounded-2xl text-sm shadow-sm
                                                    ${msg.sender === 'user'
                                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                                <span className={`text-[10px] mt-1 text-gray-400 font-medium px-1
                                                    ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                                                >
                                                    {msg.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="flex flex-row">
                                            <div className="flex-shrink-0 mr-2">
                                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <Bot size={14} />
                                                </div>
                                            </div>
                                            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1.5 items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2"
                            >
                                <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all border border-transparent focus-within:border-blue-200">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Ask a question..."
                                        className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-700"
                                    />
                                    <button type="button" className="text-gray-400 hover:text-blue-500 transition-colors">
                                        <Paperclip size={16} />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className={`p-2.5 rounded-xl transition-all shadow-md active:scale-95
                                        ${inputValue.trim()
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}

            {/* Launcher Button — draggable when chat is closed */}
            <button
                onClick={toggleChat}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{ width: WIDGET_W, height: WIDGET_H, touchAction: 'none' }}
                className={`group relative flex items-center justify-center rounded-2xl shadow-xl transition-all duration-300 overflow-hidden cursor-grab active:cursor-grabbing
                    ${isOpen
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-2xl hover:scale-105'
                    }`}
                aria-label="Toggle Chatbot"
            >
                {!isOpen && (
                    <>
                        <div className="absolute inset-0 bg-white/20 animate-ping opacity-20 rounded-2xl" />
                        <div className="absolute inset-0 bg-blue-400/20 animate-pulse opacity-30 rounded-full" />
                    </>
                )}
                {isOpen ? (
                    <X size={26} />
                ) : (
                    <div className="relative">
                        <Bot size={30} className="group-hover:translate-y-[-2px] transition-transform duration-300" />
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white" />
                        </div>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatbotWidget;
