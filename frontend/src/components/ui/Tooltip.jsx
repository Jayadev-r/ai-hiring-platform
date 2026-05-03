/**
 * Tooltip component using CSS-only approach for simplicity and performance
 * 
 * @param {Object} props
 * @param {string} props.content - Tooltip text/content
 * @param {string} props.position - top, bottom, left, right
 */
const Tooltip = ({ content, children, position = 'top', className = '' }) => {
    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent border-4',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent border-4',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent border-4',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent border-4',
    };

    return (
        <div className={`group relative inline-block ${className}`}>
            {children}

            {content && (
                <div className={`
                    absolute z-50 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 
                    rounded shadow-xl shadow-black/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    transition-all duration-200 whitespace-nowrap border border-white/10
                    ${positions[position]}
                `}>
                    {content}
                    <div className={`absolute w-0 h-0 ${arrows[position]}`} />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
