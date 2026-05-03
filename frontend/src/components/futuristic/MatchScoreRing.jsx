import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { scoreRingColors } from '../../design-tokens';

/**
 * MatchScoreRing – SVG radial progress ring with animated fill, gradient,
 * and dynamic glow color based on score value.
 *
 * Props:
 *   score     {number}  0–100
 *   size      {number}  Diameter in px (default 80)
 *   label     {string}  Label below the score
 *   thickness {number}  Stroke width (default 6)
 */
const MatchScoreRing = ({ score = 0, size = 80, label = '', thickness = 6 }) => {
    const shouldReduce = useReducedMotion();
    const id = useId();
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(score, 0), 100);
    const offset = circumference - (progress / 100) * circumference;

    const [colorStart, colorStop] = scoreRingColors(score);

    const gradientId = `ring-gradient-${id}`;

    return (
        <div className="flex flex-col items-center gap-1 select-none">
            <div
                className="relative flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                {/* Glow backdrop */}
                <div
                    className="absolute inset-0 rounded-full blur-md opacity-30"
                    style={{ background: colorStop }}
                />

                <svg width={size} height={size} className="-rotate-90">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colorStart} />
                            <stop offset="100%" stopColor={colorStop} />
                        </linearGradient>
                    </defs>

                    {/* Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={thickness}
                    />

                    {/* Progress arc */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={thickness}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: shouldReduce ? offset : offset }}
                        transition={shouldReduce
                            ? { duration: 0 }
                            : { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
                        }
                    />
                </svg>

                {/* Score label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="font-mono-hirex font-bold leading-none"
                        style={{
                            fontSize: size * 0.22,
                            color: colorStop,
                            textShadow: `0 0 8px ${colorStop}`,
                        }}
                    >
                        {progress}%
                    </span>
                </div>
            </div>

            {label && (
                <span className="text-xs text-slate-400 font-medium">{label}</span>
            )}
        </div>
    );
};

export default MatchScoreRing;
