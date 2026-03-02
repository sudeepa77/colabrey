// src/app/dashboard/edit-profile/components/InterestsSection.tsx
'use client';
import { Plus, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface InterestsSectionProps {
  selectedSkills: string[];
  selectedInterests: string[];
  onOpenModal: () => void;
  onRemoveSkill: (skill: string) => void;
  onRemoveInterest: (interest: string) => void;
}

export function InterestsSection({
  selectedSkills,
  selectedInterests,
  onOpenModal,
  onRemoveSkill,
  onRemoveInterest,
}: InterestsSectionProps) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const displayCount = 6;

  const displayedSkills = showAllSkills ? selectedSkills : selectedSkills.slice(0, displayCount);
  const displayedInterests = showAllInterests ? selectedInterests : selectedInterests.slice(0, displayCount);
  
  const hasMoreSkills = selectedSkills.length > displayCount;
  const hasMoreInterests = selectedInterests.length > displayCount;

  return (
    <div className="bg-[#151515] rounded-2xl p-6 space-y-6">
      {/* Skills Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg text-white mb-0.5">Skills</h2>
            <p className="text-xs text-gray-500">Your technical and professional skills</p>
          </div>
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 px-3 py-2 bg-[#1f1f1f] rounded-lg text-white hover:bg-[#2a2a2a] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {selectedSkills.length > 0 ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {displayedSkills.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-full flex items-center gap-2 group relative text-sm"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => onRemoveSkill(skill)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            
            {hasMoreSkills && (
              <button
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <span>{showAllSkills ? 'Show less' : `Show more (${selectedSkills.length - displayCount} more)`}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllSkills ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-[#2a2a2a] rounded-lg">
            <p className="text-gray-500 text-sm">No skills added yet</p>
          </div>
        )}
      </div>

      {/* Interests Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg text-white mb-0.5">Interests</h2>
            <p className="text-xs text-gray-500">Topics you're passionate about</p>
          </div>
        </div>

        {selectedInterests.length > 0 ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {displayedInterests.map((interest) => (
                <div
                  key={interest}
                  className="px-3 py-1.5 bg-purple-500 text-white rounded-full flex items-center gap-2 group relative text-sm"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => onRemoveInterest(interest)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            
            {hasMoreInterests && (
              <button
                onClick={() => setShowAllInterests(!showAllInterests)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <span>{showAllInterests ? 'Show less' : `Show more (${selectedInterests.length - displayCount} more)`}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllInterests ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-[#2a2a2a] rounded-lg">
            <p className="text-gray-500 text-sm">No interests added yet</p>
          </div>
        )}
      </div>
    </div>
  );
}