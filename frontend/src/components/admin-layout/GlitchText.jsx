import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlitchText
 * Applies a premium CSS-based glitch effect to text.
 */
const GlitchText = ({ text, className = '' }) => {
    return (
        <div className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>
            <motion.span
                className="absolute inset-0 text-[#ff3860] opacity-70 z-0"
                animate={{
                    x: [0, -2, 2, -1, 0],
                    y: [0, 1, -1, 1, 0],
                    clipPath: [
                        'inset(10% 0 80% 0)',
                        'inset(50% 0 10% 0)',
                        'inset(30% 0 50% 0)',
                        'inset(80% 0 5% 0)',
                        'inset(10% 0 80% 0)'
                    ]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
                {text}
            </motion.span>
            <motion.span
                className="absolute inset-0 text-[#00ffe7] opacity-70 z-0"
                animate={{
                    x: [0, 2, -2, 1, 0],
                    y: [0, -1, 1, -1, 0],
                    clipPath: [
                        'inset(40% 0 20% 0)',
                        'inset(10% 0 70% 0)',
                        'inset(60% 0 10% 0)',
                        'inset(20% 0 40% 0)',
                        'inset(40% 0 20% 0)'
                    ]
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
                {text}
            </motion.span>
        </div>
    );
};

export default GlitchText;
