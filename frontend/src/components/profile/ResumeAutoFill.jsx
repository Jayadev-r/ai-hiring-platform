import { useState } from 'react';
import { Upload, FileText, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui';

/**
 * ResumeAutoFill Component
 * Allows users to upload resume and auto-fill profile data
 */
const ResumeAutoFill = ({ onExtractComplete }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [message, setMessage] = useState('');

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            if (selectedFile.type !== 'application/pdf' &&
                !selectedFile.type.includes('word')) {
                setStatus('error');
                setMessage('Please upload a PDF or DOCX file');
                return;
            }

            // Validate file size (5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setStatus('error');
                setMessage('File size must be less than 5MB');
                return;
            }

            setFile(selectedFile);
            setStatus(null);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus('error');
            setMessage('Please select a file first');
            return;
        }

        setUploading(true);
        setStatus(null);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('autoSave', 'true'); // Auto-save to DB

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/candidates/parse-resume', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                setMessage('Resume parsed and profile updated successfully!');

                // Call parent callback with extracted data
                if (onExtractComplete) {
                    onExtractComplete(result.data);
                }

                // Reload page after 2 seconds to show updated profile
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setStatus('error');
                setMessage(result.message || 'Failed to parse resume');
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            setStatus('error');
            setMessage('Failed to upload resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 font-heading">Auto-Fill from Resume</h3>
            </div>

            <p className="text-sm text-slate-600 font-medium mb-4">
                Upload your resume (PDF or DOCX) and we'll automatically extract and fill your profile information.
            </p>

            <div className="space-y-4">
                {/* File Input */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors bg-slate-50">
                    <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <label
                        htmlFor="resume-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        <Upload className="w-10 h-10 text-indigo-400" />
                        <span className="text-sm font-semibold text-slate-700">
                            {file ? file.name : 'Click to upload resume'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">PDF or DOCX (Max 5MB)</span>
                    </label>
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">{message}</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-700">{message}</span>
                    </div>
                )}

                {/* Upload Button */}
                <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    loading={uploading}
                    className="w-full"
                >
                    {uploading ? (
                        <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Parsing Resume...
                        </>
                    ) : (
                        'Upload & Auto-Fill Profile'
                    )}
                </Button>
            </div>

            {/* Info Note */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-700">
                    <strong>Note:</strong> The auto-fill feature uses pattern matching to extract information.
                    Please review the filled data and make corrections if needed.
                </p>
            </div>
        </div>
    );
};

export default ResumeAutoFill;
