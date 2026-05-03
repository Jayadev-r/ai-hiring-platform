import { File, Upload, X } from 'lucide-react';
import { useState } from 'react';

/**
 * File upload component with drag and drop
 * 
 * @param {Object} props
 * @param {string} props.label - Upload label
 * @param {string} props.accept - Accepted file types
 * @param {string} props.hint - Helper text
 * @param {Function} props.onFileSelect - File selection handler (UI only)
 */
const FileUpload = ({
    label,
    accept = '.pdf,.doc,.docx',
    hint = 'PDF, DOC up to 10MB',
    onFileSelect,
    className = '',
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect && onFileSelect(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect && onFileSelect(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        onFileSelect && onFileSelect(null);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {label}
                </label>
            )}

            {!selectedFile ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-xl
            transition-all duration-300 cursor-pointer group bg-white
            ${isDragging
                            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20'
                            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                        }
          `}
                >
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center justify-center py-8 px-4">
                        <div className={`
              p-3 rounded-full mb-3 transition-colors duration-300 shadow-sm
              ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}
            `}>
                            <Upload className="w-6 h-6" />
                        </div>

                        <p className="text-sm text-slate-600 text-center font-medium">
                            <span className="text-indigo-600 hover:text-indigo-700 transition-colors">Click to upload</span>
                            {' '}or drag and drop
                        </p>

                        {hint && (
                            <p className="text-xs text-slate-500 mt-1 font-medium">{hint}</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl shadow-sm animate-scale-in bg-white border border-slate-200">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <File className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                            {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>

                    <button
                        onClick={removeFile}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
