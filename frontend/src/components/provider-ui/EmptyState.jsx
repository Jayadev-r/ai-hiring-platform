import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = ""
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-provider-slate-200 bg-provider-slate-50/50 backdrop-blur-sm ${className}`}
        >
            <div className="w-20 h-20 rounded-3xl bg-white shadow-sm border border-provider-slate-100 flex items-center justify-center mb-6 relative group">
                <div className="absolute inset-0 bg-provider-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                {Icon && <Icon className="w-10 h-10 text-provider-slate-300 group-hover:text-provider-blue-500 transition-colors relative z-10" />}
            </div>

            <h3 className="text-xl font-black text-provider-slate-900 mb-2 tracking-tight">
                {title}
            </h3>

            <p className="text-sm font-medium text-provider-slate-500 max-w-sm mb-8 leading-relaxed">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="provider-btn-primary shadow-lg shadow-provider-blue-500/20"
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
};

export default EmptyState;
