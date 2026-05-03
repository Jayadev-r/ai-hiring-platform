/**
 * SkeletonCard – Glassmorphism skeleton shimmer loader.
 * Used as card placeholder while API data is fetching.
 *
 * Props:
 *   lines  {number}  Number of shimmer lines (default 3)
 *   height {string}  Tailwind height class for the main block (default 'h-32')
 */
const SkeletonCard = ({ lines = 3, height = 'h-32', className = '' }) => {
    return (
        <div className={`glass-card p-6 overflow-hidden ${className}`}>
            {/* Main shimmer block */}
            <div className={`w-full ${height} rounded-lg skeleton-shimmer mb-4`} />

            {/* Shimmer lines */}
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-3 rounded-full skeleton-shimmer mb-3"
                    style={{ width: `${100 - i * 15}%` }}
                />
            ))}
        </div>
    );
};

export const SkeletonText = ({ width = 'w-full', height = 'h-4' }) => (
    <div className={`${width} ${height} rounded-full skeleton-shimmer`} />
);

export const SkeletonAvatar = ({ size = 'w-12 h-12' }) => (
    <div className={`${size} rounded-full skeleton-shimmer`} />
);

export default SkeletonCard;
