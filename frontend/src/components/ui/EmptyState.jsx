import { Search } from 'lucide-react';
import React from 'react';
import Button from './Button'; // Assuming you have a Button component

const EmptyState = ({
    icon: Icon = Search,
    title = "No items found",
    description = "We couldn't find what you're looking for.",
    action,
    className
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className || ''}`}>
            <div className="p-4 rounded-full mb-4 border border-white/5 shadow-inner" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <Icon className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
                {title}
            </h3>
            <p className="text-slate-400 max-w-sm mb-6">
                {description}
            </p>
            {action && (
                <div className="flex gap-2">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
