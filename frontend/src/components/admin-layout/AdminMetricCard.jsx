import React from 'react';
import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';
import { TrendingUp } from 'lucide-react';

/**
 * AdminMetricCard — Professional Edition
 * Clean white card with subtle border, colored accent, and count-up animation.
 */
const AdminMetricCard = ({ label, value, icon: Icon, accentColor, status, delay = 0 }) => {
    const displayValue = useCountUp(value ?? 0, 1400);

    // Derive a soft background from the accent color
    const accentBg = `${accentColor}12`;
    const accentBorder = `${accentColor}30`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            className="bg-white rounded-xl border border-[#e5e7ef] p-6 hover:shadow-md hover:border-[#d1d5e0] transition-all duration-200"
        >
            <div className="flex items-start justify-between mb-5">
                {/* Icon */}
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: accentBg, border: `1px solid ${accentBorder}` }}
                >
                    <Icon size={20} style={{ color: accentColor }} />
                </div>

                {/* Status badge */}
                <span
                    className="text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full"
                    style={{
                        color: accentColor,
                        backgroundColor: accentBg,
                        border: `1px solid ${accentBorder}`
                    }}
                >
                    {status || 'Active'}
                </span>
            </div>

            {/* Value */}
            <div className="space-y-1">
                <h3 className="text-3xl font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {value === null ? '—' : displayValue.toLocaleString()}
                </h3>
                <p className="text-sm font-medium text-[#6b7280]">
                    {label}
                </p>
            </div>

            {/* Bottom trend line (decorative) */}
            <div className="mt-4 flex items-center gap-1.5">
                <TrendingUp size={13} style={{ color: accentColor }} />
                <span className="text-[11px] font-medium" style={{ color: accentColor }}>
                    Live data
                </span>
            </div>
        </motion.div>
    );
};

export default AdminMetricCard;
