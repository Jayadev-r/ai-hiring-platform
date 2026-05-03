import { User, Briefcase, GraduationCap, Code, Award, FolderGit2, FileText, ExternalLink, Mail, Phone, MapPin, Linkedin, Github, Clock } from 'lucide-react';

/**
 * CandidateProfileContent
 * Fully theme-aware — uses CSS variables from ThemeContext for all colors.
 */
const CandidateProfileContent = ({ data, resumeUrl, onViewResume, isSnapshot, snapshotDate }) => {
    const info = data?.personal_info || {};

    // Theme-aware style helpers
    const cardStyle = {
        backgroundColor: 'var(--theme-card-bg, #ffffff)',
        border: '1px solid var(--theme-border, #e2e8f0)',
        color: 'var(--theme-text-primary, #0f172a)',
    };

    const sectionBgStyle = {
        backgroundColor: 'var(--theme-bg, #f8fafc)',
        border: '1px solid var(--theme-border, #e2e8f0)',
    };

    const labelStyle = {
        color: 'var(--theme-text-secondary, #94a3b8)',
    };

    const textPrimary = { color: 'var(--theme-text-primary, #0f172a)' };
    const textSecondary = { color: 'var(--theme-text-secondary, #475569)' };
    const iconBoxStyle = {
        backgroundColor: 'var(--theme-card-bg, #ffffff)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    };

    return (
        <div className="space-y-8">
            {/* Snapshot Badge */}
            {isSnapshot && snapshotDate && (
                <div
                    className="p-4 rounded-xl flex items-center gap-3"
                    style={{
                        backgroundColor: 'var(--theme-hover, #eff6ff)',
                        border: '1px solid var(--theme-border, #bfdbfe)',
                    }}
                >
                    <Clock className="w-5 h-5" style={{ color: 'var(--theme-primary, #2563eb)' }} />
                    <span className="text-sm font-medium" style={textPrimary}>
                        Profile snapshot from <strong className="font-bold" style={{ color: 'var(--theme-primary, #2563eb)' }}>{new Date(snapshotDate).toLocaleDateString()}</strong>
                    </span>
                </div>
            )}

            {/* Profile Info Grid */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm rounded-2xl p-6"
                style={sectionBgStyle}
            >
                {info.email && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={iconBoxStyle}>
                            <Mail className="w-4 h-4" style={labelStyle} />
                        </div>
                        <a
                            href={`mailto:${info.email}`}
                            className="font-semibold truncate transition-colors hover:opacity-80"
                            style={textPrimary}
                            title={info.email}
                        >
                            {info.email}
                        </a>
                    </div>
                )}
                {(info.phone || info.phone_number) && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={iconBoxStyle}>
                            <Phone className="w-4 h-4" style={labelStyle} />
                        </div>
                        <span className="font-semibold" style={textPrimary}>{info.phone || info.phone_number}</span>
                    </div>
                )}
                {info.location && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={iconBoxStyle}>
                            <MapPin className="w-4 h-4" style={labelStyle} />
                        </div>
                        <span className="font-semibold" style={textPrimary}>{info.location}</span>
                    </div>
                )}
                {(info.linkedin || info.linkedin_url) && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={iconBoxStyle}>
                            <Linkedin className="w-4 h-4" style={{ color: 'var(--theme-primary, #0077B5)' }} />
                        </div>
                        <a
                            href={info.linkedin || info.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold truncate transition-colors hover:opacity-80"
                            style={textPrimary}
                            title={info.linkedin || info.linkedin_url}
                        >
                            LinkedIn Profile
                        </a>
                    </div>
                )}
                {(info.github || info.github_url) && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={iconBoxStyle}>
                            <Github className="w-4 h-4" style={textPrimary} />
                        </div>
                        <a
                            href={info.github || info.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold truncate transition-colors hover:opacity-80"
                            style={textPrimary}
                            title={info.github || info.github_url}
                        >
                            GitHub Portfolio
                        </a>
                    </div>
                )}
            </div>

            {/* About */}
            {(info.about || info.profile_description) && (
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 ml-1" style={labelStyle}>Executive Summary</h4>
                    <p
                        className="text-sm whitespace-pre-line leading-relaxed rounded-2xl p-6 shadow-sm"
                        style={{ ...cardStyle, color: 'var(--theme-text-secondary, #475569)' }}
                    >
                        {info.about || info.profile_description}
                    </p>
                </div>
            )}

            {/* Resume Button */}
            {resumeUrl && (
                <button
                    onClick={onViewResume}
                    className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-colors shadow-sm"
                    style={{
                        backgroundColor: 'var(--theme-card-bg, #ffffff)',
                        border: '2px solid var(--theme-border, #e2e8f0)',
                        color: 'var(--theme-text-secondary, #64748b)',
                    }}
                >
                    <FileText className="w-5 h-5" />
                    Extract Original Resume
                </button>
            )}

            {/* Skills */}
            {data?.skills?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 ml-1 flex items-center gap-2" style={labelStyle}>
                        <Code className="w-3.5 h-3.5" /> Technical Matrix
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg"
                                style={{
                                    backgroundColor: 'var(--theme-hover, #eff6ff)',
                                    color: 'var(--theme-primary, #3b82f6)',
                                    border: '1px solid var(--theme-border, #bfdbfe)',
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {data?.experience?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 ml-1 flex items-center gap-2" style={labelStyle}>
                        <Briefcase className="w-3.5 h-3.5" /> Career Trajectory
                    </h4>
                    <div className="space-y-4">
                        {data.experience.map((exp, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-colors"
                                style={cardStyle}
                            >
                                <div
                                    className="absolute top-0 left-0 w-1 h-full transition-colors"
                                    style={{ backgroundColor: 'var(--theme-border, #e2e8f0)' }}
                                />
                                <h5 className="font-black text-lg tracking-tight" style={textPrimary}>{exp.job_title || exp.title}</h5>
                                <p className="text-sm font-bold mb-1" style={{ color: 'var(--theme-primary, #2563eb)' }}>{exp.company || exp.company_name}</p>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-4" style={labelStyle}>
                                    <Clock className="w-3 h-3" />
                                    {exp.start_date || exp.startDate} - {exp.is_current || exp.current ? 'Present' : (exp.end_date || exp.endDate)}
                                </div>
                                {(exp.description) && (
                                    <p className="text-sm leading-relaxed font-medium" style={textSecondary}>{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data?.education?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 ml-1 flex items-center gap-2" style={labelStyle}>
                        <GraduationCap className="w-3.5 h-3.5" /> Academic Foundation
                    </h4>
                    <div className="space-y-4">
                        {data.education.map((edu, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-colors"
                                style={cardStyle}
                            >
                                <div
                                    className="absolute top-0 left-0 w-1 h-full transition-colors"
                                    style={{ backgroundColor: 'var(--theme-border, #e2e8f0)' }}
                                />
                                <h5 className="font-black text-lg tracking-tight" style={textPrimary}>{edu.degree}</h5>
                                <p className="text-sm font-bold mb-1" style={{ color: '#10b981' }}>{edu.institution || edu.school}</p>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={labelStyle}>
                                    <Clock className="w-3 h-3" />
                                    {edu.start_date || edu.startDate} - {edu.end_date || edu.endDate || edu.graduation_year}
                                </div>
                                {(edu.gpa || edu.grade) && (
                                    <div
                                        className="inline-flex px-2 py-1 rounded text-xs font-black mt-2"
                                        style={{
                                            backgroundColor: 'var(--theme-bg, #f1f5f9)',
                                            color: 'var(--theme-text-secondary, #64748b)',
                                        }}
                                    >
                                        GPA: {edu.gpa || edu.grade}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data?.projects?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 ml-1 flex items-center gap-2" style={labelStyle}>
                        <FolderGit2 className="w-3.5 h-3.5" /> Key Implementations
                    </h4>
                    <div className="space-y-4">
                        {data.projects.map((proj, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-colors"
                                style={cardStyle}
                            >
                                <div
                                    className="absolute top-0 left-0 w-1 h-full transition-colors"
                                    style={{ backgroundColor: 'var(--theme-border, #e2e8f0)' }}
                                />
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-black text-lg tracking-tight" style={textPrimary}>{proj.project_title || proj.title}</h5>
                                    {(proj.project_link || proj.link) && (
                                        <a
                                            href={proj.project_link || proj.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 rounded-lg transition-colors hover:opacity-80"
                                            style={{
                                                backgroundColor: 'var(--theme-bg, #f8fafc)',
                                                color: 'var(--theme-text-secondary, #94a3b8)',
                                            }}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                {(proj.project_description || proj.description) && (
                                    <p className="text-sm leading-relaxed font-medium" style={textSecondary}>{proj.project_description || proj.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            {data?.achievements?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 ml-1 flex items-center gap-2" style={labelStyle}>
                        <Award className="w-3.5 h-3.5" /> Distinctions
                    </h4>
                    <div className="space-y-3">
                        {data.achievements.map((ach, i) => (
                            <div key={i} className="p-5 rounded-2xl shadow-sm flex gap-4" style={cardStyle}>
                                <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#f59e0b' }} />
                                <div>
                                    <h5 className="font-black" style={textPrimary}>{ach.title}</h5>
                                    {ach.description && (
                                        <p className="text-sm mt-1 font-medium" style={textSecondary}>{ach.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Screening Question Answers */}
            {data?.answers?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 ml-1 flex items-center gap-2" style={labelStyle}>
                        <FileText className="w-3.5 h-3.5" /> Analytical Responses
                    </h4>
                    <div className="space-y-4">
                        {data.answers.map((qa, i) => (
                            <div key={i} className="p-6 rounded-2xl shadow-sm" style={cardStyle}>
                                <div className="text-sm font-bold mb-3 uppercase tracking-wider flex items-start gap-2" style={textSecondary}>
                                    <span style={{ color: 'var(--theme-primary, #2563eb)' }}>Q.</span> {qa.question}
                                </div>
                                <div
                                    className="rounded-xl p-5"
                                    style={{
                                        backgroundColor: 'var(--theme-bg, #f8fafc)',
                                        border: '1px solid var(--theme-border, #e2e8f0)',
                                    }}
                                >
                                    <p className="text-sm font-medium leading-relaxed italic" style={textPrimary}>"{qa.answer}"</p>
                                </div>
                                {qa.expected_answer && (
                                    <div
                                        className="mt-4 p-4 rounded-xl"
                                        style={{
                                            backgroundColor: 'rgba(245, 158, 11, 0.08)',
                                            border: '1px solid rgba(245, 158, 11, 0.25)',
                                        }}
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#d97706' }}>Target Baseline</p>
                                        <p className="text-sm font-medium" style={{ color: '#b45309' }}>{qa.expected_answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateProfileContent;
