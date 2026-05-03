import { motion, useReducedMotion } from 'framer-motion';

/**
 * AILoader – "Neural scan" AI thinking animation.
 * Replaces standard spinners across the user portal.
 */
const AILoader = ({ text = 'Processing...', size = 'md' }) => {
    const shouldReduce = useReducedMotion();

    const sizes = {
        sm: { ring: 40, bar: 'h-1', text: 'text-xs', gap: 'gap-3' },
        md: { ring: 64, bar: 'h-1.5', text: 'text-sm', gap: 'gap-4' },
        lg: { ring: 96, bar: 'h-2', text: 'text-base', gap: 'gap-5' },
    };
    const s = sizes[size] || sizes.md;

    const dots = [0, 1, 2, 3];

    return (
        <div className={`flex flex-col items-center justify-center ${s.gap} py-12`}>
            {/* Rotating outer ring */}
            <div className="relative" style={{ width: s.ring, height: s.ring }}>
                {/* Static glow */}
                <div
                    className="absolute inset-0 rounded-full opacity-20 blur-md"
                    style={{ background: 'rgba(99,102,241,0.6)' }}
                />

                {/* Spinning gradient arc */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent, #6366f1, transparent)',
                        borderRadius: '50%',
                    }}
                    animate={shouldReduce ? {} : { rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner dark circle */}
                <div
                    className="absolute rounded-full bg-white shadow-sm border border-slate-100"
                    style={{
                        inset: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Neural scan bar  */}
                    <motion.div
                        className="w-4/5 absolute"
                        style={{
                            height: 1.5,
                            background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
                        }}
                        animate={shouldReduce ? {} : { top: ['20%', '80%', '20%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 mt-2">
                {dots.map((i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                        animate={shouldReduce ? {} : { opacity: [0.2, 1, 0.2] }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            <span className={`${s.text} text-slate-400 font-medium font-heading tracking-wide`}>
                {text}
            </span>
        </div>
    );
};

export default AILoader;
