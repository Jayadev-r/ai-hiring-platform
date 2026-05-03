/**
 * Badge component for status indicators
 * 
 * @param {Object} props
 * @param {'success' | 'warning' | 'error' | 'info' | 'default' | 'neutral' | 'primary'} props.variant - Badge color variant
 * @param {'sm' | 'md'} props.size - Badge size
 * @param {boolean} props.dot - Show status dot
 * @param {React.ReactNode} props.children - Badge content
 */
const Badge = ({
    variant = 'default',
    size = 'md',
    dot = false,
    children,
    className = '',
    ...props
}) => {
    // Variant styles (Light Professional Theme)
    const variants = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200',
        default: 'bg-slate-100 text-slate-700 border-slate-200',
        neutral: 'bg-slate-50 text-slate-600 border-slate-200',
        primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };

    // Dot colors
    const dotColors = {
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        default: 'bg-slate-500',
        neutral: 'bg-slate-500',
        primary: 'bg-indigo-500',
    };

    // Size styles
    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full border
        ${variants[variant] || variants.default}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default} animate-pulse`} />
            )}
            {children}
        </span>
    );
};

export default Badge;
