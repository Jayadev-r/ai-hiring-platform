import { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useReducedMotion, motion } from 'framer-motion';

/**
 * ParticleBackground – Full-screen animated background with:
 *  • Animated aurora/nebula blobs (CSS + Framer Motion)
 *  • Neural grid overlay
 *  • Floating tsParticles mesh (cursor repulsion)
 *
 * Falls back to a static gradient when prefers-reduced-motion is set.
 */
const ParticleBackground = () => {
    const shouldReduce = useReducedMotion();

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const options = useMemo(() => ({
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: 'repulse' },
                resize: true,
            },
            modes: {
                repulse: { distance: 90, duration: 0.4 },
            },
        },
        particles: {
            color: { value: ['#4F46E5', '#0891b2', '#7c3aed', '#ec4899'] },
            links: {
                color: '#4F46E5',
                distance: 140,
                enable: true,
                opacity: 0.15,
                width: 1,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: { default: 'bounce' },
                random: true,
                speed: 0.9,
                straight: false,
            },
            number: {
                value: 60,
                density: { enable: true, area: 900 },
            },
            opacity: {
                value: { min: 0.1, max: 0.4 },
                animation: { enable: true, speed: 0.5, sync: false },
            },
            shape: { type: 'circle' },
            size: {
                value: { min: 1, max: 3 },
                animation: { enable: true, speed: 1.5, sync: false },
            },
        },
        detectRetina: true,
    }), []);

    if (shouldReduce) {
        return (
            <div
                className="fixed inset-0 neural-grid"
                style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(79,70,229,0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.04) 0%, transparent 60%), var(--theme-bg)' }}
            />
        );
    }

    return (
        <>
            {/* ── Base theme gradient ── */}
            <div
                className="fixed inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 20% 15%, rgba(79,70,229,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 85%, rgba(124,58,237,0.06) 0%, transparent 50%), radial-gradient(ellipse at 55% 50%, rgba(8,145,178,0.04) 0%, transparent 60%), var(--theme-bg)',
                    zIndex: 0,
                }}
            />

            {/* ── Neural grid overlay ── */}
            <div className="fixed inset-0 neural-grid opacity-60" style={{ zIndex: 0 }} />

            {/* ── Aurora / nebula blobs – Framer animated ── */}
            {/* Indigo blob — top-left, slow drift */}
            <motion.div
                className="fixed rounded-full pointer-events-none"
                style={{
                    width: 520, height: 520,
                    left: '-8%', top: '-8%',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, rgba(79,70,229,0.03) 50%, transparent 70%)',
                    filter: 'blur(70px)',
                    zIndex: 0,
                }}
                animate={{
                    x: [0, 60, -30, 0],
                    y: [0, 40, 80, 0],
                    scale: [1, 1.15, 0.95, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Purple blob — bottom-right, mid drift */}
            <motion.div
                className="fixed rounded-full pointer-events-none"
                style={{
                    width: 480, height: 480,
                    right: '-6%', bottom: '-6%',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.03) 50%, transparent 70%)',
                    filter: 'blur(70px)',
                    zIndex: 0,
                }}
                animate={{
                    x: [0, -50, 30, 0],
                    y: [0, -40, -80, 0],
                    scale: [1, 1.12, 0.92, 1],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* Cyan accent blob — centre-right */}
            <motion.div
                className="fixed rounded-full pointer-events-none"
                style={{
                    width: 340, height: 340,
                    right: '15%', top: '30%',
                    background: 'radial-gradient(circle, rgba(8,145,178,0.08) 0%, transparent 65%)',
                    filter: 'blur(60px)',
                    zIndex: 0,
                }}
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -30, 50, 0],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
            />

            {/* Pink/magenta accent — top-right */}
            <motion.div
                className="fixed rounded-full pointer-events-none"
                style={{
                    width: 260, height: 260,
                    right: '5%', top: '5%',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 65%)',
                    filter: 'blur(55px)',
                    zIndex: 0,
                }}
                animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />

            {/* ── tsParticles mesh ── */}
            <Particles
                id="hirex-particles"
                init={particlesInit}
                options={options}
                className="fixed inset-0"
                style={{ zIndex: 0 }}
            />
        </>
    );
};

export default ParticleBackground;
