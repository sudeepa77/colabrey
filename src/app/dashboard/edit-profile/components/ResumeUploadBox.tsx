// src/app/dashboard/edit-profile/components/ResumeUploadBox.tsx
'use client';
import { FileText, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ResumeUploadBoxProps {
  resumeFile: File | null;
  onUpdate: (file: File | null) => void;
}

export function ResumeUploadBox({ resumeFile, onUpdate }: ResumeUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate(file);
    }
  };

  const handleRemove = () => {
    onUpdate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#151515] rounded-2xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#1f1f1f] rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-white">Resume</h3>
          <p className="text-xs text-gray-500 mt-0.5">Upload your resume (PDF)</p>
        </div>
      </div>

      {resumeFile ? (
        <div className="bg-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="w-5 h-5 text-white flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{resumeFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(resumeFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="ml-2 p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-[#1f1f1f] rounded-lg p-6 hover:bg-[#2a2a2a] transition-colors flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#2a2a2a]"
        >
          <Upload className="w-6 h-6 text-gray-400" />
          <p className="text-sm text-gray-400">Click to upload resume</p>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
