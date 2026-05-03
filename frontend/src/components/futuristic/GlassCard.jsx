import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * GlassCard – Core reusable glassmorphism card component.
 * Supports hover lift, glow color variants, and size variants.
 */
const GlassCard = ({
    children,
    className = '',
    hover = false,
    glow = null,       // 'cyan' | 'purple' | 'green' | 'amber' | 'red' | null
    padding = 'md',    // 'none' | 'sm' | 'md' | 'lg'
    animate = true,
    onClick,
    ...props
}) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const glowClasses = {
        cyan: 'hover:border-cyan-400/40 hover:shadow-glow-cyan',
        purple: 'hover:border-purple-400/40 hover:shadow-glow-purple',
        green: 'hover:border-green-400/40 hover:shadow-glow-green',
        amber: 'hover:border-amber-400/40 hover:shadow-glow-amber',
        red: 'hover:border-red-400/40 hover:shadow-glow-red',
    };

    const card = (
        <div
            className={clsx(
                'glass-card relative overflow-hidden',
                paddings[padding],
                hover && 'transition-all duration-300 cursor-pointer',
                hover && glow && glowClasses[glow],
                hover && !glow && 'hover:border-white/20 hover:bg-white/[0.08] hover:-translate-y-0.5',
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );

    if (!animate) return card;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
            {card}
        </motion.div>
    );
};

export default GlassCard;
