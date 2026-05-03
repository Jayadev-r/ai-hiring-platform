import { motion, AnimatePresence } from 'framer-motion';
import WorkspaceDock from './WorkspaceDock';
import ProviderErrorBoundary from './ProviderErrorBoundary';

const ProviderLayout = ({ children }) => {
    return (
        <div className="provider-root min-h-screen provider-bg-grid">
            <WorkspaceDock />
            <motion.main
                className="max-w-7xl mx-auto pt-20 pb-12 px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
            >
                <ProviderErrorBoundary>
                    {children}
                </ProviderErrorBoundary>
            </motion.main>
        </div >
    );
};

export default ProviderLayout;
