import { Briefcase, Clock, DollarSign, MapPin, Wifi, CheckCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * Job card for displaying job listings
 * 
 * @param {Object} props
 * @param {Object} props.job - Job data
 * @param {Function} props.onApply - Apply handler (UI only)
 * @param {boolean} props.showMatchScore - Show match score
 */
const JobCard = ({
    job,
    onApply,
    isApplied = false,
    showMatchScore = true,
    className = '',
}) => {
    const {
        title, job_title,
        company, company_name,
        companyLogo, company_logo,
        location,
        type, job_type,
        salary, salary_min, salary_max,
        skills = [], required_skills,
        remote,
        posted, created_at,
        matchScore,
        applicants,
    } = job;

    // Normalize Data
    const displayTitle = title || job_title;
    const displayCompany = company || company_name;
    const displayLogo = companyLogo || company_logo;
    const displayType = type || job_type;
    const displayPosted = posted || (created_at ? new Date(created_at).toLocaleDateString() : 'Recently');

    // Parse skills if string
    let displaySkills = skills;
    if (required_skills && typeof required_skills === 'string') {
        displaySkills = required_skills.split(',').map(s => s.trim());
    } else if (required_skills && Array.isArray(required_skills)) {
        displaySkills = required_skills;
    }

    // Format Salary
    let displaySalary = salary;
    if (!salary && salary_min && salary_max) {
        displaySalary = `$${salary_min.toLocaleString()} - $${salary_max.toLocaleString()}`;
    } else if (!salary) {
        displaySalary = 'Competitive';
    }

    return (
        <div
            className={`
        border rounded-xl p-6
        hover:border-purple-500/50 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]
        transition-all duration-300 hover:scale-[1.01]
        ${className}
      `}
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                {displayLogo ? (
                    <img
                        src={displayLogo}
                        alt={displayCompany}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-purple-300" style={{ background: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.2)' }}>
                        {displayCompany?.charAt(0) || 'C'}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">
                        {displayTitle}
                    </h3>
                    <p className="text-sm text-slate-400">{displayCompany}</p>
                </div>

                {showMatchScore && matchScore && (
                    <div className="flex-shrink-0">
                        <div className={`
              px-3 py-1.5 rounded-full text-sm font-semibold border backdrop-blur-md
              ${matchScore >= 90 ? 'text-emerald-400' :
                                matchScore >= 75 ? 'text-amber-400' :
                                    'text-slate-300'}
            `} style={{
                                background: matchScore >= 90 ? 'rgba(52,211,153,0.1)' : matchScore >= 75 ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.05)',
                                borderColor: matchScore >= 90 ? 'rgba(52,211,153,0.2)' : matchScore >= 75 ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.1)'
                            }}>
                            {matchScore}% Match
                        </div>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-wrap items-center gap-3 mb-5 text-sm text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{displayType}</span>
                </div>
                {displaySalary && (
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{displaySalary}</span>
                    </div>
                )}
                {remote && (
                    <div className="flex items-center gap-1 text-emerald-600">
                        <Wifi className="w-4 h-4" />
                        <span>Remote</span>
                    </div>
                )}
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {displaySkills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="default" size="sm">
                        {skill}
                    </Badge>
                ))}
                {displaySkills.length > 4 && (
                    <Badge variant="default" size="sm">
                        +{displaySkills.length - 4} more
                    </Badge>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-white/[0.08] mt-2">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{displayPosted}</span>
                    </div>
                    {applicants && (
                        <span>• {applicants} applicants</span>
                    )}
                </div>

                <Button
                    size="sm"
                    disabled={isApplied}
                    variant={isApplied ? "outline" : "primary"}
                    onClick={(e) => {
                        if (!isApplied && onApply) onApply(e);
                    }}
                >
                    {isApplied ? <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Applied</span> : 'Apply Now'}
                </Button>
            </div>
        </div>
    );
};

export default JobCard;
