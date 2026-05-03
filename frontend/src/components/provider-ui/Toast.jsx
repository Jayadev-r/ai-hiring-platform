import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    const icons = {
        success: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        error: <XCircle className="w-4 h-4 text-red-600" />,
        warning: <AlertCircle className="w-4 h-4 text-amber-600" />,
        info: <Info className="w-4 h-4 text-blue-600" />,
    };

    const colors = {
        success: 'border-emerald-500',
        error: 'border-red-500',
        warning: 'border-amber-500',
        info: 'border-blue-500',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-white border-l-4 ${colors[type]} shadow-lg rounded-r-lg p-4 min-w-[300px] flex items-start gap-3 pointer-events-auto`}
        >
            <div className="mt-0.5">{icons[type]}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close toast"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default Toast;
