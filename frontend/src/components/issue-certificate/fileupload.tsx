import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.csv',
  maxSizeMB = 30,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    if (accept) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
      if (!acceptedExtensions.includes(fileExtension)) {
        setError(`Invalid file type. Please upload a ${accept} file.`);
        return;
      }
    }

    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-200 ${
            dragActive
              ? 'border-[#3D876C] bg-emerald-500/10'
              : 'border-border bg-background hover:border-[#3D876C]/50 hover:bg-emerald-500/5'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className={`p-3 rounded-full bg-emerald-500/10 text-[#3D876C] mb-4 transition-transform duration-200 ${dragActive ? 'scale-110' : ''}`}>
              <Upload className="w-8 h-8" />
            </div>

            <p className="mb-2 text-sm text-foreground font-medium">
              Drag &amp; drop your CSV file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Max. File Size: <span className="font-semibold">{maxSizeMB}MB</span>
            </p>

            <button
              type="button"
              onClick={onButtonClick}
              className="inline-flex items-center text-white bg-[#3D876C] hover:bg-[#2C6450] focus:ring-4 focus:ring-emerald-500/20 shadow-sm font-semibold rounded-xl text-sm px-4 py-2.5 transition-colors focus:outline-none cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Browse file
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-64 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-6 text-center">
          <div className="p-3 rounded-full bg-emerald-500/10 text-[#3D876C] mb-3">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-semibold text-foreground max-w-md truncate">
            {selectedFile.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <button
            type="button"
            onClick={removeFile}
            className="mt-4 inline-flex items-center text-muted-foreground hover:text-red-500 bg-card hover:bg-red-500/10 border border-border hover:border-red-500/20 font-semibold rounded-xl text-xs px-3 py-2 transition-all shadow-sm focus:outline-none cursor-pointer"
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Remove file
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>
      )}

      <input
        ref={fileInputRef}
        id="dropzone-file-2"
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default FileUpload;
