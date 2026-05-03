import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import RadialNav from './RadialNav';
import AICompanionOrb from './AICompanionOrb';
import ScrollToTop from './ScrollToTop';

/**
 * UserLayout – Master wrapper for all Job Seeker portal pages.
 *
 * Provides:
 *   • Animated gradient mesh + particle background
 *   • Framer Motion page transition (fade + slide)
 *   • Radial floating navigation orb (bottom-right)
 *   • AI Companion orb / command palette (bottom-left)
 *   • ScrollToTop on route change
 */
const UserLayout = ({ children }) => {
    const { pathname } = useLocation();

    return (
        <div className="relative min-h-screen overflow-x-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* === Background layer === */}
            <ParticleBackground />

            {/* === Scroll reset === */}
            <ScrollToTop />

            {/* === Page content with transition === */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    className="relative z-10 min-h-screen"
                    style={{ paddingBottom: '6rem' /* room for floating orbs */ }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className="max-w-7xl mx-auto px-6 pt-8">
                        {children}
                    </div>
                </motion.main>
            </AnimatePresence>

            {/* === Floating navigation orbs === */}
            <RadialNav />
            <AICompanionOrb />
        </div>
    );
};

export default UserLayout;
