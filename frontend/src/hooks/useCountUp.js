import { useState, useEffect } from 'react';

/**
 * useCountUp Hook
 * Animates a number from 0 to a target value over a specified duration.
 * @param {number} target - The final value to reach.
 * @param {number} duration - Total animation duration in ms.
 * @returns {number} The current animated value.
 */
const useCountUp = (target, duration = 1400) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setCount(Math.floor(progress * target));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [target, duration]);

    return count;
};

export default useCountUp;
