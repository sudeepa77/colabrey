// src/app/dashboard/edit-profile/components/GithubLinkBox.tsx
'use client';
import { Github } from 'lucide-react';
import { useState } from 'react';

interface GithubLinkBoxProps {
  githubUrl: string;
  onUpdate: (url: string) => void;
}

export function GithubLinkBox({ githubUrl, onUpdate }: GithubLinkBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(githubUrl);

  const handleSave = () => {
    onUpdate(tempUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUrl(githubUrl);
    setIsEditing(false);
  };

  const handleClick = () => {
    if (!githubUrl) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-[#151515] rounded-2xl p-6">
        <div className="space-y-3">
          <p className="text-sm text-gray-400">GitHub URL</p>
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://github.com/username"
            className="w-full bg-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 bg-[#1f1f1f] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (githubUrl) {
    return (
      <div className="bg-[#151515] rounded-2xl p-6 group cursor-pointer" onClick={() => setIsEditing(true)}>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 bg-[#1f1f1f] rounded-xl flex items-center justify-center group-hover:bg-[#2a2a2a] transition-colors">
            <Github className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs text-gray-500 text-center">GitHub</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-[#151515] rounded-2xl p-6 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-[#1f1f1f] rounded-xl flex items-center justify-center">
          <Github className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 text-center">Add GitHub</p>
      </div>
    </div>
  );
}
