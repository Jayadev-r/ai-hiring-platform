import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';

/**
 * Table component with sorting and empty state support
 */
export const Table = ({ children, className = '' }) => (
    <div className="overflow-x-auto rounded-xl border border-white/[0.08] shadow-sm backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <table className={`w-full text-sm ${className}`}>
            {children}
        </table>
    </div>
);

/**
 * Table Head
 */
export const TableHead = ({ children, className = '' }) => (
    <thead className={`border-b border-white/[0.08] bg-white/[0.02] ${className}`}>
        {children}
    </thead>
);

/**
 * Table Body
 */
export const TableBody = ({ children, className = '' }) => (
    <tbody className={`divide-y divide-white/[0.05] ${className}`}>
        {children}
    </tbody>
);

/**
 * Table Row
 */
export const TableRow = ({ children, className = '', hover = true, onClick }) => (
    <tr
        className={`
      ${hover ? 'hover:bg-white/[0.04] transition-colors duration-150' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      even:bg-white/[0.01]
      ${className}
    `}
        onClick={onClick}
    >
        {children}
    </tr>
);

/**
 * Table Header Cell
 */
export const TableHeader = ({
    children,
    className = '',
    sortable = false,
    sortDirection,
    onSort,
}) => (
    <th
        className={`
      px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider
      ${sortable ? 'cursor-pointer hover:text-white hover:bg-white/[0.04] transition-colors select-none' : ''}
      ${className}
    `}
        onClick={sortable ? onSort : undefined}
    >
        <div className="flex items-center gap-1.5">
            {children}
            {sortable && (
                <span className="text-slate-500">
                    {sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                    ) : sortDirection === 'desc' ? (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                    ) : (
                        <ChevronsUpDown className="w-4 h-4" />
                    )}
                </span>
            )}
        </div>
    </th>
);

/**
 * Table Cell
 */
export const TableCell = ({ children, className = '' }) => (
    <td className={`px-6 py-4 text-slate-300 whitespace-nowrap ${className}`}>
        {children}
    </td>
);

/**
 * Empty State for Table
 */
export const TableEmpty = ({
    message = 'No data found',
    description = '',
    icon: Icon,
    colSpan = 1
}) => (
    <tr>
        <td colSpan={colSpan} className="px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
                {Icon ? (
                    <div className="p-4 rounded-full bg-white/[0.05] text-slate-400 shadow-inner">
                        <Icon className="w-8 h-8" />
                    </div>
                ) : null}
                <div className="space-y-1">
                    <p className="text-white font-medium text-base">{message}</p>
                    {description && <p className="text-slate-400 text-sm max-w-sm mx-auto">{description}</p>}
                </div>
            </div>
        </td>
    </tr>
);

export default Table;
