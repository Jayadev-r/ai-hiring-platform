import { Component } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * ErrorBoundary – Catches React runtime errors within the user portal.
 * Renders a futuristic "System Anomaly Detected" glass fallback UI.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info);
    }

    handleReload() {
        window.location.reload();
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="min-h-screen flex items-center justify-center p-6"
                style={{ background: 'radial-gradient(ellipse at center, #0a0f2e 0%, #020617 100%)' }}>
                <div className="glass-card max-w-md w-full p-8 text-center border-red-400/20"
                    style={{ boxShadow: '0 0 40px rgba(239,68,68,0.15)' }}>
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mx-auto mb-5">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>

                    {/* Heading */}
                    <h2 className="font-heading text-2xl font-bold text-white mb-2">
                        System Anomaly Detected
                    </h2>
                    <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                        An unexpected error occurred in this session. Your progress has been preserved.
                    </p>

                    {/* Error detail */}
                    {this.state.error && (
                        <div className="bg-red-950/40 border border-red-400/20 rounded-lg p-3 mb-6 text-left">
                            <code className="font-mono-hirex text-xs text-red-300 break-words">
                                {this.state.error.message}
                            </code>
                        </div>
                    )}

                    {/* CTA */}
                    <button
                        onClick={this.handleReload.bind(this)}
                        className="btn-neon-cyan px-6 py-2.5 rounded-lg flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Session
                    </button>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
