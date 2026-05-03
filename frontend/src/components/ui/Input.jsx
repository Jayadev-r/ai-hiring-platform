/**
 * Input component with label and focus states
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.success - Success message
 * @param {string} props.hint - Helper text
 * @param {React.ReactNode} props.leftIcon - Icon on left side
 * @param {React.ReactNode} props.rightIcon - Icon on right side
 */
const Input = ({
    label,
    error,
    success,
    hint,
    leftIcon,
    rightIcon,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                    {label}
                </label>
            )}

            <div className="relative group">
                {leftIcon && (
                    <div className={`
            absolute left-3 top-1/2 -translate-y-1/2 
            ${error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-indigo-600'}
            transition-colors duration-200
          `}>
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    className={`
            w-full rounded-lg bg-white
            text-slate-900 placeholder:text-slate-400
            transition-all duration-200 border border-slate-300
            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
            ${leftIcon ? 'pl-10' : 'px-4'}
            ${rightIcon ? 'pr-10' : 'px-4'}
            py-2.5
            ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : success
                                ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-200'
                                : 'hover:border-slate-400'
                        }
          `}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-sm text-error-600 animate-slide-down flex items-center gap-1">
                    {error}
                </p>
            )}

            {success && (
                <p className="mt-1.5 text-sm text-success-600 animate-slide-down">
                    {success}
                </p>
            )}

            {hint && !error && !success && (
                <p className="mt-1.5 text-sm text-neutral-500">{hint}</p>
            )}
        </div>
    );
};

export default Input;
