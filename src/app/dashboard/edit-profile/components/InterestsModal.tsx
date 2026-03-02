// src/app/dashboard/edit-profile/components/InterestsModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { X, ArrowLeft, Plus } from 'lucide-react';

interface InterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkills: string[];
  selectedInterests: string[];
  onUpdateSkills: (skills: string[]) => void;
  onUpdateInterests: (interests: string[]) => void;
}

// Technical Skills
const skillCategories = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Machine Learning',
  'Data Science', 'UI/UX Design', 'Mobile Development', 'DevOps', 'Cloud Computing',
  'Cybersecurity', 'Blockchain', 'Game Development', 'AI', 'Web Development',
  'Database Management', 'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure',
];

// Interest Categories
const interestCategories = [
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'sports', label: 'Sports', emoji: '⚾' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'travel', label: 'Travel', emoji: '📍' },
  { id: 'food', label: 'Food', emoji: '🍴' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', emoji: '💼' },
];

const categoryInterests: Record<string, string[]> = {
  technology: ['AI', 'Web3', 'Robotics', 'IoT', 'VR/AR', 'Quantum Computing'],
  art: ['Painting', 'Digital Art', 'Photography', 'Sculpture', 'Street Art'],
  sports: ['Football', 'Basketball', 'Cricket', 'Tennis', 'Running', 'Cycling'],
  music: ['Playing Instruments', 'Production', 'DJing', 'Singing', 'Music Theory'],
  gaming: ['PC Gaming', 'Console Gaming', 'Esports', 'Game Design', 'Streaming'],
  travel: ['Backpacking', 'Adventure Travel', 'Cultural Tourism', 'Photography'],
  food: ['Cooking', 'Baking', 'Food Photography', 'Restaurant Reviews'],
  entrepreneurship: ['Startups', 'Business Strategy', 'Marketing', 'Product Management'],
};

export function InterestsModal({
  isOpen,
  onClose,
  selectedSkills,
  selectedInterests,
  onUpdateSkills,
  onUpdateInterests,
}: InterestsModalProps) {
  const [activeTab, setActiveTab] = useState<'skills' | 'interests'>('skills');
  const [localSkills, setLocalSkills] = useState<string[]>(selectedSkills);
  const [localInterests, setLocalInterests] = useState<string[]>(selectedInterests);
  const [customSkill, setCustomSkill] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [interestStep, setInterestStep] = useState<'categories' | 'details'>('categories');

  useEffect(() => {
    if (isOpen) {
      setLocalSkills(selectedSkills);
      setLocalInterests(selectedInterests);
      setActiveTab('skills');
      setInterestStep('categories');
      setSelectedCategories([]);
    }
  }, [isOpen, selectedSkills, selectedInterests]);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setLocalSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setLocalInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !localSkills.includes(customSkill.trim())) {
      setLocalSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !localInterests.includes(customInterest.trim())) {
      setLocalInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleSave = () => {
    onUpdateSkills(localSkills);
    onUpdateInterests(localInterests);
    onClose();
  };

  const allDetailedInterests = selectedCategories.flatMap(
    catId => categoryInterests[catId] || []
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#151515] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <h2 className="text-xl font-bold text-white">Add Skills & Interests</h2>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Save
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'skills'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#1f1f1f] text-gray-400 hover:text-white'
              }`}
            >
              Skills ({localSkills.length})
            </button>
            <button
              onClick={() => setActiveTab('interests')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'interests'
                  ? 'bg-purple-500 text-white'
                  : 'bg-[#1f1f1f] text-gray-400 hover:text-white'
              }`}
            >
              Interests ({localInterests.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {activeTab === 'skills' ? (
            <div>
              <h3 className="text-white text-lg mb-4">Select your skills</h3>
              
              {/* Skill Pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                {skillCategories.map((skill) => {
                  const isSelected = localSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full transition-all border ${
                        isSelected
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-transparent text-white border-[#3a3a3a] hover:border-gray-500'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                  placeholder="Add a custom skill..."
                  className="flex-1 bg-[#1f1f1f] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : interestStep === 'categories' ? (
            <div>
              <h3 className="text-white text-lg mb-4">Choose interest categories</h3>
              
              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {interestCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all border-2 ${
                        isSelected
                          ? 'bg-[#2a2a2a] border-purple-500'
                          : 'bg-transparent border-[#2a2a2a] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="text-3xl">{category.emoji}</div>
                      <span className="text-white text-sm">{category.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setInterestStep('details')}
                disabled={selectedCategories.length === 0}
                className={`w-full mt-6 py-3 rounded-lg transition-all ${
                  selectedCategories.length > 0
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'
                }`}
              >
                Continue {selectedCategories.length > 0 && `(${selectedCategories.length})`}
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setInterestStep('categories')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <h3 className="text-white text-lg mb-4">Select specific interests</h3>
              
              {/* Interest Pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                {allDetailedInterests.map((interest) => {
                  const isSelected = localInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full transition-all border ${
                        isSelected
                          ? 'bg-purple-500 text-white border-purple-500'
                          : 'bg-transparent text-white border-[#3a3a3a] hover:border-gray-500'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Interest */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomInterest()}
                  placeholder="Add a custom interest..."
                  className="flex-1 bg-[#1f1f1f] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddCustomInterest}
                  className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}