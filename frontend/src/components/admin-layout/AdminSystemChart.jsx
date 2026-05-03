import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const dummyData = [
    { name: '00:00', val: 400 },
    { name: '04:00', val: 300 },
    { name: '08:00', val: 600 },
    { name: '12:00', val: 800 },
    { name: '16:00', val: 500 },
    { name: '20:00', val: 700 },
    { name: '23:59', val: 900 },
];

/**
 * AdminSystemChart — Professional Edition
 * Clean white area chart for visualizing system activity.
 */
const AdminSystemChart = ({ title, data = dummyData, color = "#4F46E5" }) => {
    const gradId = `grad-${color.replace('#', '')}`;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-[#e5e7ef] p-6 hover:shadow-md hover:border-[#d1d5e0] transition-all duration-200"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm font-semibold text-[#111827]">Activity Overview</p>
                    <p className="text-[11px] text-[#9ca3af] mt-0.5">{title}</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span className="text-[10px] font-medium text-[#6b7280]">Live</span>
                </div>
            </div>

            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 4, right: 2, left: -30, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke="#e5e7ef"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#9ca3af' }}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7ef',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontFamily: 'Inter',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                color: '#111827'
                            }}
                            itemStyle={{ color: color }}
                            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 2' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="val"
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#${gradId})`}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default AdminSystemChart;
