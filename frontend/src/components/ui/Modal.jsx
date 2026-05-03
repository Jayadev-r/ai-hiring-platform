import { X } from 'lucide-react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Glassmorphism Modal — drop-in replacement for the old light Modal.
 * All props are identical; behaviour is unchanged.
 *
 * @param {boolean}          isOpen
 * @param {Function}         onClose
 * @param {string}           title
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'} size
 * @param {React.ReactNode}  children
 * @param {string}           className
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    size = 'md',
    children,
    className = '',
}) => {
    useEffect(() => {
        const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal panel */}
                    <motion.div
                        className={`relative w-full ${sizes[size]} rounded-2xl overflow-hidden ${className}`}
                        style={{
                            background: 'rgba(10, 15, 46, 0.85)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(6,182,212,0.06)',
                        }}
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 16 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
                                <h2 className="font-heading text-lg font-bold text-white tracking-tight">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 text-slate-200">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

/**
 * Modal footer for actions — glass-aware version.
 */
export const ModalFooter = ({ children, className = '' }) => (
    <div className={`flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/[0.08] ${className}`}>
        {children}
    </div>
);

export default Modal;
