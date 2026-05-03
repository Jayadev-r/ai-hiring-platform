import { Calendar, CheckCircle, ClipboardCheck, FileText, MapPin, Star, User, XCircle, Video } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * Applicant card for recruiter view
 * All action buttons are always visible so the recruiter can change status at any time.
 */
const ApplicantCard = ({
    applicant,
    onViewResume,
    onViewProfile,
    onShortlist,
    onInterview,
    onAccept,
    onReject,
    className = '',
}) => {
    const {
        name,
        email,
        avatar,
        title,
        location,
        experience,
        skills,
        appliedFor,
        appliedDate,
        status,
        matchScore,
        source,
    } = applicant;

    const statusConfig = {
        applied: { label: 'Applied', color: 'info' },
        new: { label: 'New', color: 'info' },
        reviewing: { label: 'Reviewing', color: 'warning' },
        shortlisted: { label: 'Shortlisted', color: 'success' },
        shortlisted_for_test: { label: 'Test Scheduled', color: 'warning' },
        interview: { label: 'Interview', color: 'warning' },
        accepted: { label: 'Accepted', color: 'success' },
        rejected: { label: 'Rejected', color: 'error' },
    };

    const normalizedStatus = (status || 'applied').toLowerCase();
    const statusInfo = statusConfig[normalizedStatus] || statusConfig.applied;

    return (
        <div
            className={`
        border rounded-xl p-6
        hover:border-purple-500/50 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]
        transition-all duration-300
        ${className}
      `}
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <img
                    src={avatar}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{name}</h3>
                        <Badge variant={statusInfo.color} size="sm">
                            {statusInfo.label}
                        </Badge>
                    </div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="text-xs text-slate-500">{email}</p>
                </div>

                {/* Match Score */}
                <div className="flex-shrink-0 text-center">
                    <div className={`
            w-14 h-14 rounded-full flex items-center justify-center
            text-lg font-bold border-2 backdrop-blur-md
            ${matchScore >= 90 ? 'text-emerald-400 border-emerald-400/30' :
                            matchScore >= 75 ? 'text-amber-400 border-amber-400/30' :
                                'text-slate-300 border-white/10'}
          `} style={{ background: matchScore >= 90 ? 'rgba(52,211,153,0.1)' : matchScore >= 75 ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.05)' }}>
                        {matchScore}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Match</p>
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{experience} experience</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Applied {appliedDate}</span>
                </div>
            </div>

            {/* Applied For */}
            <p className="text-sm text-slate-400 mb-3">
                Applied for: <span className="text-cyan-400 font-medium">{appliedFor}</span>
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {skills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="default" size="sm">
                        {skill}
                    </Badge>
                ))}
                {skills.length > 5 && (
                    <Badge variant="default" size="sm">
                        +{skills.length - 5}
                    </Badge>
                )}
            </div>

            {/* Source Tag */}
            {source && (
                <p className="text-xs text-slate-500 mb-4">
                    Source: {source}
                </p>
            )}

            {/* Actions — Always visible so recruiter can change status at any time */}
            <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-white/[0.08] mt-2">
                <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<FileText className="w-4 h-4" />}
                    onClick={onViewResume}
                >
                    Resume
                </Button>

                {onViewProfile && (
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<User className="w-4 h-4" />}
                        onClick={onViewProfile}
                    >
                        Profile
                    </Button>
                )}

                <div className="w-full mt-2 flex flex-wrap gap-2">
                    <Button
                        variant={normalizedStatus === 'shortlisted' ? 'primary' : 'outline'}
                        size="sm"
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        onClick={() => onShortlist && onShortlist()}
                        disabled={normalizedStatus === 'shortlisted'}
                    >
                        Shortlist
                    </Button>
                    <Button
                        variant={normalizedStatus === 'shortlisted_for_test' ? 'warning' : 'outline'}
                        size="sm"
                        leftIcon={<ClipboardCheck className="w-3.5 h-3.5" />}
                        onClick={() => onShortlist && onShortlist('shortlisted_for_test')}
                        disabled={normalizedStatus === 'shortlisted_for_test'}
                    >
                        Test
                    </Button>
                    <Button
                        variant={normalizedStatus === 'interview' ? 'primary' : 'outline'}
                        size="sm"
                        leftIcon={<Video className="w-3.5 h-3.5" />}
                        onClick={() => onInterview && onInterview()}
                        disabled={normalizedStatus === 'interview'}
                    >
                        Interview
                    </Button>
                    <Button
                        variant={normalizedStatus === 'accepted' ? 'success' : 'outline'}
                        size="sm"
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        onClick={() => onAccept && onAccept()}
                        disabled={normalizedStatus === 'accepted'}
                    >
                        Accept
                    </Button>
                    <Button
                        variant={normalizedStatus === 'rejected' ? 'danger' : 'outline'}
                        size="sm"
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                        onClick={() => onReject && onReject()}
                        disabled={normalizedStatus === 'rejected'}
                    >
                        Reject
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ApplicantCard;
