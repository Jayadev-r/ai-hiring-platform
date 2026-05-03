/**
 * Textarea component for multi-line input
 * 
 * @param {Object} props
 * @param {string} props.label - Textarea label
 * @param {string} props.error - Error message
 * @param {string} props.hint - Helper text
 * @param {number} props.rows - Number of rows
 */
const Textarea = ({
    label,
    error,
    hint,
    rows = 4,
    className = '',
    id,
    ...props
}) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                    {label}
                </label>
            )}

            <textarea
                id={textareaId}
                rows={rows}
                className={`
          w-full bg-white border rounded-lg
          text-slate-900 placeholder:text-slate-400
          transition-all duration-200 border-slate-300
          focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0
          disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          px-4 py-3 resize-none
          ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'hover:border-slate-400'
                    }
        `}
                {...props}
            />

            {error && (
                <p className="mt-1.5 text-sm text-red-500 animate-slide-down flex items-center gap-1">
                    {error}
                </p>
            )}

            {hint && !error && (
                <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
            )}
        </div>
    );
};

export default Textarea;
