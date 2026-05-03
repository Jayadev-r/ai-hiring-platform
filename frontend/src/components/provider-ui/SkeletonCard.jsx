const SkeletonCard = ({ lines = 3, height = 'h-32', className = '' }) => {
    return (
        <div className={`provider-panel p-5 overflow-hidden relative ${height} ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent -translate-x-full animate-shimmer" style={{ backgroundSize: '1000px 100%' }} />
            <div className="space-y-3 relative z-10">
                {[...Array(lines)].map((_, i) => (
                    <div
                        key={i}
                        className="h-4 bg-slate-100 rounded-full"
                        style={{ width: `${100 - (i * 15)}%`, opacity: 1 - (i * 0.1) }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SkeletonCard;
