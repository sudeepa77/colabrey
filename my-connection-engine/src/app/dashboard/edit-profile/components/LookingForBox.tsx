// src/app/dashboard/edit-profile/components/LookingForBox.tsx
'use client';
import { Linkedin, Globe } from 'lucide-react';
import { useState, useRef } from 'react';

interface LookingForBoxProps {
  linkedinUrl: string;
  portfolioUrl: string;
  onUpdate: (field: string, value: string) => void;
}

export function LookingForBox({ linkedinUrl, portfolioUrl, onUpdate }: LookingForBoxProps) {
  const [isEditingLinkedin, setIsEditingLinkedin] = useState(false);
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const linkedinInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const handleLinkedinClick = () => {
    setIsEditingLinkedin(true);
    setTimeout(() => linkedinInputRef.current?.focus(), 0);
  };

  const handlePortfolioClick = () => {
    setIsEditingPortfolio(true);
    setTimeout(() => portfolioInputRef.current?.focus(), 0);
  };

  return (
    <div className="bg-[#151515] rounded-2xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#1f1f1f] rounded-xl flex items-center justify-center flex-shrink-0">
          <Globe className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-white">Social Links</h3>
          <p className="text-xs text-gray-500 mt-0.5">LinkedIn and portfolio</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* LinkedIn */}
        <div>
          {isEditingLinkedin || linkedinUrl ? (
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                ref={linkedinInputRef}
                type="url"
                value={linkedinUrl}
                onChange={(e) => onUpdate('linkedin_url', e.target.value)}
                onBlur={() => setIsEditingLinkedin(false)}
                placeholder="https://linkedin.com/in/yourname"
                className="flex-1 bg-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
              />
            </div>
          ) : (
            <div
              onClick={handleLinkedinClick}
              className="cursor-pointer text-gray-500 hover:text-gray-400 transition-colors text-sm p-3 bg-[#1f1f1f] rounded-lg flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" />
              <span>Add LinkedIn URL</span>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div>
          {isEditingPortfolio || portfolioUrl ? (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                ref={portfolioInputRef}
                type="url"
                value={portfolioUrl}
                onChange={(e) => onUpdate('portfolio_url', e.target.value)}
                onBlur={() => setIsEditingPortfolio(false)}
                placeholder="https://yourportfolio.com"
                className="flex-1 bg-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
              />
            </div>
          ) : (
            <div
              onClick={handlePortfolioClick}
              className="cursor-pointer text-gray-500 hover:text-gray-400 transition-colors text-sm p-3 bg-[#1f1f1f] rounded-lg flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Add Portfolio URL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}