import { Eye, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, FileUpload } from '../ui';

const ResumeUpload = ({ hasResume, resumeFile, onSelectFile, onDelete, pViewResume, onReupload }) => {
    return (
        <Card className="mb-6">
            <CardHeader><CardTitle>Resume</CardTitle></CardHeader>
            <CardContent>
                {hasResume ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                            <span>✓ Resume uploaded</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary" onClick={pViewResume} leftIcon={<Eye className="w-4 h-4" />}>
                                View Resume
                            </Button>
                            <Button variant="outline" onClick={onDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
                                Delete Resume
                            </Button>
                            {/* Replace resume – native file input wrapped in styled label */}
                            <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors border border-transparent">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) onReupload(file);
                                    }}
                                />
                                <Upload className="w-4 h-4" /> Replace Resume
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Full drag-and-drop upload zone when no resume exists */}
                        <FileUpload
                            label="Upload Your Resume (PDF)"
                            accept=".pdf"
                            hint="PDF only · Max 10MB · Click 'Save Profile' after selecting to upload"
                            onFileSelect={onSelectFile}
                        />
                        {resumeFile && (
                            <p className="text-sm font-medium text-emerald-600">
                                ✓ <strong>{resumeFile.name}</strong> selected — Click <strong>"Save Profile"</strong> to upload.
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ResumeUpload;
