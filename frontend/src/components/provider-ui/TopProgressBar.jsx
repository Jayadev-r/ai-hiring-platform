import { motion, AnimatePresence } from 'framer-motion';

const TopProgressBar = ({ loading }) => {
    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ width: 0, opacity: 1 }}
                    animate={{ width: '100%', opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="fixed top-0 left-0 h-[3px] bg-blue-600 z-[100] shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                />
            )}
        </AnimatePresence>
    );
};

export default TopProgressBar;
