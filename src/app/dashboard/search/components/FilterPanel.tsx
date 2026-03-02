// src/app/dashboard/search/components/FilterPanel.tsx
import { X, Target, Sparkles, GraduationCap, Calendar } from 'lucide-react';

interface Filters {
  skills: string[];
  interests: string[];
  major: string;
  year: string;
}

interface FilterPanelProps {
  show: boolean;
  onClose: () => void;
  filters: Filters;
  availableSkills: string[];
  availableInterests: string[];
  availableMajors: string[];
  availableYears: string[];
  onToggleSkill: (skill: string) => void;
  onToggleInterest: (interest: string) => void;
  onUpdateFilter: (key: keyof Filters, value: string) => void;
  onClearAll: () => void;
}

export default function FilterPanel({
  show,
  onClose,
  filters,
  availableSkills,
  availableInterests,
  availableMajors,
  availableYears,
  onToggleSkill,
  onToggleInterest,
  onUpdateFilter,
  onClearAll,
}: FilterPanelProps) {
  if (!show) return null;

  const hasActiveFilters = 
    filters.skills.length > 0 || 
    filters.interests.length > 0 || 
    filters.major || 
    filters.year;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-[#1a1a1a] border-l border-gray-800 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Filters</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Skills Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Skills</h3>
              {filters.skills.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold">
                  {filters.skills.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSkills.length > 0 ? (
                availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => onToggleSkill(skill)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filters.skills.includes(skill)
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {skill}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No skills available</p>
              )}
            </div>
          </div>

          {/* Interests Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Interests</h3>
              {filters.interests.length > 0 && (
                <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-semibold">
                  {filters.interests.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableInterests.length > 0 ? (
                availableInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => onToggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filters.interests.includes(interest)
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {interest}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No interests available</p>
              )}
            </div>
          </div>

          {/* Major Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Major</h3>
            </div>
            <select
              value={filters.major}
              onChange={(e) => onUpdateFilter('major', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Majors</option>
              {availableMajors.map((major) => (
                <option key={major} value={major} className="bg-[#1a1a1a]">
                  {major}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Year</h3>
            </div>
            <select
              value={filters.year}
              onChange={(e) => onUpdateFilter('year', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year} className="bg-[#1a1a1a]">
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all border border-red-500/30 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}