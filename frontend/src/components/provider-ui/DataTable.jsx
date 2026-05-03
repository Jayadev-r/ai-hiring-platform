import { Search } from 'lucide-react';
import SkeletonCard from './SkeletonCard';

const DataTable = ({ columns, data, loading, emptyMessage = 'No data found', onRowClick }) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <SkeletonCard key={i} lines={1} height="h-12" />
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="provider-panel flex flex-col items-center justify-center py-12 px-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                    <Search className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="provider-panel overflow-hidden shadow-sm">
            <div className="overflow-x-auto provider-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, i) => (
                            <tr
                                key={i}
                                onClick={() => onRowClick?.(row)}
                                className={`group transition-colors duration-150 ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''} provider-row-hover`}
                            >
                                {columns.map((col, j) => (
                                    <td key={j} className={`px-6 py-4 text-sm text-slate-600 ${col.className || ''}`}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
