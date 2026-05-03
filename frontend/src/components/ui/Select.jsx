import { ChevronDown } from 'lucide-react';

/**
 * Select dropdown component
 * 
 * @param {Object} props
 * @param {string} props.label - Select label
 * @param {Array} props.options - Array of { value, label } options
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 */
const Select = ({
    label,
    options = [],
    error,
    placeholder = 'Select an option',
    className = '',
    id,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                    {label}
                </label>
            )}

            <div className="relative group">
                <select
                    id={selectId}
                    className={`
            w-full appearance-none bg-white border rounded-lg
            text-slate-900 border-slate-300
            transition-all duration-200
            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            px-4 py-2.5 pr-10
            ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'hover:border-slate-400'
                        }
          `}
                    {...props}
                >
                    <option value="" disabled className="text-slate-500 bg-white">
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-white text-slate-900 py-2"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180 duration-200">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>

            {error && (
                <p className="mt-1.5 text-sm text-red-500 animate-slide-down">{error}</p>
            )}
        </div>
    );
};

export default Select;
