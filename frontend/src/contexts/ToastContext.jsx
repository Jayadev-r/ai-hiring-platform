import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

/* ─── Context ─── */
const ToastContext = createContext(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
};

/* ─── Toast item ─── */
const icons = {
    success: { Icon: CheckCircle, color: 'text-green-400', border: 'border-green-400/30', glow: 'rgba(34,197,94,0.2)' },
    error: { Icon: AlertCircle, color: 'text-red-400', border: 'border-red-400/30', glow: 'rgba(239,68,68,0.2)' },
    info: { Icon: Info, color: 'text-cyan-400', border: 'border-cyan-400/30', glow: 'rgba(6,182,212,0.2)' },
    warning: { Icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-400/30', glow: 'rgba(245,158,11,0.2)' },
};

const ToastItem = ({ id, type = 'info', message, onRemove }) => {
    const { Icon, color, border, glow } = icons[type] || icons.info;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={`glass-card flex items-start gap-3 px-4 py-3 min-w-[280px] max-w-sm border ${border}`}
            style={{ boxShadow: `0 0 20px ${glow}` }}
        >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${color}`} />
            <p className="text-sm text-slate-200 flex-1 leading-snug">{message}</p>
            <button onClick={() => onRemove(id)} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 mt-0.5">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

/* ─── Provider ─── */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg, d) => addToast(msg, 'success', d),
        error: (msg, d) => addToast(msg, 'error', d),
        info: (msg, d) => addToast(msg, 'info', d),
        warning: (msg, d) => addToast(msg, 'warning', d),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast container */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <div key={t.id} className="pointer-events-auto">
                            <ToastItem {...t} onRemove={removeToast} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
