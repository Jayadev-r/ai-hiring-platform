import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Note: Error Boundaries must be class components in React
class ErrorBoundaryInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Provider UI Error Boundary Caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full provider-panel p-8 text-center border-rose-200 bg-rose-50/30"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-sm border border-rose-100 flex items-center justify-center mx-auto mb-6 relative group">
                            <div className="absolute inset-0 bg-rose-500/10 rounded-3xl opacity-100 blur-xl" />
                            <AlertTriangle className="w-10 h-10 text-rose-500 relative z-10" />
                        </div>

                        <h2 className="text-xl font-black text-slate-900 mb-2">Component Crashed</h2>
                        <p className="text-sm font-medium text-slate-500 mb-6">
                            We're sorry, but something went wrong while loading this view. Our team has been notified.
                        </p>

                        <div className="p-4 bg-white rounded-xl border border-rose-100 text-left overflow-auto max-h-32 mb-8 shadow-inner">
                            <p className="text-xs font-mono text-rose-600 mb-1 font-bold">Error Details:</p>
                            <code className="text-[10px] text-slate-600 font-mono break-words">
                                {this.state.error?.toString()}
                            </code>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 provider-btn-secondary border-slate-200 flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Reload
                            </button>
                            <button
                                onClick={() => {
                                    this.setState({ hasError: false });
                                    this.props.navigate('/provider/dashboard');
                                }}
                                className="flex-1 provider-btn-primary bg-rose-600 hover:bg-rose-700 shadow-rose-200 flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" /> Dashboard
                            </button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Wrapper to use hooks like useNavigate inside a class component
const ProviderErrorBoundary = ({ children }) => {
    const navigate = useNavigate();
    return <ErrorBoundaryInner navigate={navigate}>{children}</ErrorBoundaryInner>;
};

export default ProviderErrorBoundary;
