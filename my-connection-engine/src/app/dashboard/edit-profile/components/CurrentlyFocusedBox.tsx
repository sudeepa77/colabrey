// src/app/dashboard/edit-profile/components/CurrentlyFocusedBox.tsx
'use client'; 
import { GraduationCap } from 'lucide-react';
import { useState, useRef } from 'react';

interface CurrentlyFocusedBoxProps {
  major: string;
  year: string;
  onUpdate: (field: string, value: string) => void;
}

export function CurrentlyFocusedBox({ major, year, onUpdate }: CurrentlyFocusedBoxProps) {
  const [isEditingMajor, setIsEditingMajor] = useState(false);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const majorInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  const handleMajorClick = () => {
    setIsEditingMajor(true);
    setTimeout(() => majorInputRef.current?.focus(), 0);
  };

  const handleYearClick = () => {
    setIsEditingYear(true);
    setTimeout(() => yearInputRef.current?.focus(), 0);
  };

  return (
    <div className="bg-[#151515] rounded-2xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#1f1f1f] rounded-xl flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-white">Education</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your major and year</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Major */}
        {isEditingMajor || major ? (
          <input
            ref={majorInputRef}
            type="text"
            value={major}
            onChange={(e) => onUpdate('major', e.target.value)}
            onBlur={() => setIsEditingMajor(false)}
            placeholder="e.g., Computer Science, Mechanical Engineering"
            className="w-full bg-[#1f1f1f] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
          />
        ) : (
          <div
            onClick={handleMajorClick}
            className="cursor-pointer text-gray-500 hover:text-gray-400 transition-colors text-sm p-4 bg-[#1f1f1f] rounded-lg"
          >
            Click to add your major...
          </div>
        )}

        {/* Year */}
        {isEditingYear || year ? (
          <input
            ref={yearInputRef}
            type="text"
            value={year}
            onChange={(e) => onUpdate('year', e.target.value)}
            onBlur={() => setIsEditingYear(false)}
            placeholder="e.g., 2nd Year, Final Year, Class of 2025"
            className="w-full bg-[#1f1f1f] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
          />
        ) : (
          <div
            onClick={handleYearClick}
            className="cursor-pointer text-gray-500 hover:text-gray-400 transition-colors text-sm p-4 bg-[#1f1f1f] rounded-lg"
          >
            Click to add your year...
          </div>
        )}
      </div>
    </div>
  );
}