import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useReducedMotion, motion } from 'framer-motion';

/**
 * AnimatedCounter – Counts up from 0 to `value` with spring physics.
 * Renders instantly when prefers-reduced-motion is set.
 */
const AnimatedCounter = ({ value = 0, duration = 1.2, className = '' }) => {
    const shouldReduce = useReducedMotion();
    const motionVal = useMotionValue(0);
    const springVal = useSpring(motionVal, { stiffness: 60, damping: 20, duration });
    const ref = useRef(null);

    useEffect(() => {
        if (shouldReduce) {
            if (ref.current) ref.current.textContent = value;
            return;
        }
        motionVal.set(0);
        setTimeout(() => motionVal.set(Number(value)), 100);
    }, [value, motionVal, shouldReduce]);

    useEffect(() => {
        if (shouldReduce) return;
        const unsubscribe = springVal.on('change', (v) => {
            if (ref.current) ref.current.textContent = Math.round(v);
        });
        return unsubscribe;
    }, [springVal, shouldReduce]);

    return (
        <span ref={ref} className={className}>
            {shouldReduce ? value : 0}
        </span>
    );
};

export default AnimatedCounter;
