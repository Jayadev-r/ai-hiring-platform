/**
 * Card component with elevation and refined borders
 * Supports both light (default) and dark contexts
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional classes
 * @param {boolean} props.hover - Enable hover lift effect
 * @param {boolean} props.flat - Remove shadow for flat style
 * @param {'sm' | 'md' | 'lg' | 'none'} props.padding - Padding size
 * @param {'light' | 'dark'} props.variant - Card theme variant
 */
const Card = ({
    children,
    className = '',
    hover = false,
    flat = false,
    padding = 'md',
    variant = 'light',
    onClick,
    ...props
}) => {
    const paddingSizes = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const variantStyles =
        variant === 'dark'
            ? 'bg-white/[0.03] border border-white/[0.08] backdrop-blur-md'
            : 'bg-white border border-slate-200/80 backdrop-blur-sm';

    const hoverStyles = hover
        ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'
        : '';

    const shadowStyles = flat ? '' : variant === 'dark' ? 'shadow-sm' : 'shadow-sm shadow-slate-200/60';

    return (
        <div
            className={`
        ${variantStyles}
        rounded-xl
        transition-all duration-300
        ${shadowStyles}
        ${paddingSizes[padding]}
        ${hoverStyles}
        ${className}
      `}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Card Header component
 */
export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-5 ${className}`}>
        {children}
    </div>
);

/**
 * Card Title component
 */
export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-bold text-slate-800 tracking-tight ${className}`}>
        {children}
    </h3>
);

/**
 * Card Description component
 */
export const CardDescription = ({ children, className = '' }) => (
    <p className={`text-sm text-slate-500 mt-1.5 leading-relaxed ${className}`}>
        {children}
    </p>
);

/**
 * Card Content component
 */
export const CardContent = ({ children, className = '' }) => (
    <div className={className}>
        {children}
    </div>
);

/**
 * Card Footer component
 */
export const CardFooter = ({ children, className = '' }) => (
    <div className={`mt-6 pt-6 border-t border-slate-100 flex items-center ${className}`}>
        {children}
    </div>
);

export default Card;
