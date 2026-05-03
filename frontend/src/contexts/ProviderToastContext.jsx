import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/provider-ui/Toast';

const ToastContext = createContext(null);

export const ProviderToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{
            success: (m) => addToast(m, 'success'),
            error: (m) => addToast(m, 'error'),
            info: (m) => addToast(m, 'info'),
            warning: (m) => addToast(m, 'warning')
        }}>
            {children}
            <div className="fixed top-16 right-4 z-[999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useProviderToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useProviderToast must be used within a ProviderToastProvider');
    return context;
};
