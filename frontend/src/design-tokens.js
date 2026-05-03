/**
 * HireX Job Seeker Portal – Design Tokens
 * Single source of truth for all glassmorphism styles, glow values, and animation durations.
 */

export const tokens = {
    // Glow shadows
    glowCyan: '0 0 24px rgba(0, 255, 255, 0.35), 0 0 48px rgba(0, 255, 255, 0.15)',
    glowPurple: '0 0 24px rgba(147, 51, 234, 0.35), 0 0 48px rgba(147, 51, 234, 0.15)',
    glowGreen: '0 0 24px rgba(34, 197, 94, 0.35), 0 0 48px rgba(34, 197, 94, 0.15)',
    glowAmber: '0 0 24px rgba(251, 191, 36, 0.30), 0 0 48px rgba(251, 191, 36, 0.12)',
    glowRed: '0 0 24px rgba(239, 68, 68, 0.35), 0 0 48px rgba(239, 68, 68, 0.15)',
    glowWhite: '0 0 20px rgba(255, 255, 255, 0.15)',

    // Glassmorphism
    blur: 'blur(14px)',
    blurHeavy: 'blur(24px)',
    borderGlass: '1px solid rgba(255, 255, 255, 0.10)',
    borderGlassLight: '1px solid rgba(255, 255, 255, 0.18)',
    bgGlass: 'rgba(255, 255, 255, 0.05)',
    bgGlassMedium: 'rgba(255, 255, 255, 0.08)',
    bgGlassDark: 'rgba(0, 0, 0, 0.35)',

    // Color palette
    cyan: '#06b6d4',
    cyanLight: '#67e8f9',
    purple: '#9333ea',
    green: '#22c55e',
    amber: '#f59e0b',
    red: '#ef4444',

    // Typography
    fontHeading: "'Space Grotesk', sans-serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",

    // Animation durations
    durationFast: 0.15,
    durationNormal: 0.3,
    durationSlow: 0.6,

    // Spring configs for Framer Motion
    springBouncy: { type: 'spring', stiffness: 400, damping: 25 },
    springSmooth: { type: 'spring', stiffness: 200, damping: 30 },
    springGentle: { type: 'spring', stiffness: 120, damping: 20 },
};

// Framer Motion colour score ring gradient stops
export const scoreRingColors = (score) => {
    if (score >= 80) return ['#22c55e', '#06b6d4']; // green → cyan
    if (score >= 60) return ['#06b6d4', '#9333ea']; // cyan → purple
    if (score >= 40) return ['#f59e0b', '#06b6d4']; // amber → cyan
    return ['#ef4444', '#f59e0b'];                   // red → amber
};

export default tokens;
