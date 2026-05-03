import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * TiltCard – 3D perspective tilt wrapper driven by cursor position.
 * Automatically disabled when prefers-reduced-motion is set.
 */
const TiltCard = ({ children, className = '', strength = 8 }) => {
    const shouldReduce = useReducedMotion();
    const ref = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glowX, setGlowX] = useState(50);
    const [glowY, setGlowY] = useState(50);

    if (shouldReduce) {
        return <div className={className}>{children}</div>;
    }

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = e.clientX - centerX;
        const y = e.clientY - centerY;
        const maxX = rect.width / 2;
        const maxY = rect.height / 2;

        setRotateY((x / maxX) * strength);
        setRotateX(-(y / maxY) * strength);
        setGlowX(((e.clientX - rect.left) / rect.width) * 100);
        setGlowY(((e.clientY - rect.top) / rect.height) * 100);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setGlowX(50);
        setGlowY(50);
    };

    return (
        <motion.div
            ref={ref}
            className={`relative ${className}`}
            style={{ perspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.5 }}
        >
            {/* Dynamic glow highlight following cursor */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(6,182,212,0.06), transparent 60%)`,
                }}
            />
            {children}
        </motion.div>
    );
};

export default TiltCard;
