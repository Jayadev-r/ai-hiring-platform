const StatusBadge = ({ status }) => {
    const getStyles = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'open':
            case 'active':
            case 'accepted':
            case 'published':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'closed':
            case 'rejected':
            case 'inactive':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'shortlisted':
            case 'applied':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'interview':
                return 'bg-violet-50 text-violet-700 border-violet-200';
            case 'test':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getStyles(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
