import React from 'react';
import { motion } from 'framer-motion';
import useTypingEffect from '../../hooks/useTypingEffect';
import { CheckCircle, Terminal } from 'lucide-react';

const SYSTEM_LINES = [
    '✓ Admin session authenticated',
    '✓ Connected to HireX platform database',
    '✓ Access level: SUPER_ADMIN',
    '✓ User verification monitoring active',
    '✓ Account management enabled',
    '✓ Session impersonation available (debug)',
    '✓ Audit log access granted',
    '▸ System status: Operational',
];

/**
 * AdminTerminalPanel — Professional Edition
 * A clean activity log panel replacing the cyber terminal.
 */
const AdminTerminalPanel = () => {
    const { displayedText, isDone } = useTypingEffect(SYSTEM_LINES, 22);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="bg-white rounded-xl border border-[#e5e7ef] overflow-hidden hover:shadow-md hover:border-[#d1d5e0] transition-all duration-200"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f8]">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center">
                        <Terminal size={14} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-[#111827]">Session Log</p>
                        <p className="text-[10px] text-[#9ca3af]">Current admin session</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span className="text-[10px] text-[#6b7280] font-medium">Active</span>
                </div>
            </div>

            {/* Log Content */}
            <div className="p-5 min-h-[200px] space-y-2">
                {SYSTEM_LINES.map((line, i) => {
                    const isVisible = displayedText.includes(line.substring(0, 5));
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -8 }}
                            transition={{ duration: 0.25, delay: i * 0.12 }}
                            className="flex items-start gap-2"
                        >
                            {line.startsWith('✓') ? (
                                <CheckCircle size={13} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                            ) : (
                                <div className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                                </div>
                            )}
                            <span className={`text-[12px] font-mono leading-relaxed ${line.startsWith('▸') ? 'text-[#4F46E5] font-semibold' : 'text-[#374151]'}`}>
                                {line.replace('✓ ', '').replace('▸ ', '')}
                            </span>
                        </motion.div>
                    );
                })}
                {!isDone && (
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5" />
                        <span className="inline-block w-1.5 h-4 bg-[#4F46E5] animate-pulse rounded-sm" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminTerminalPanel;
