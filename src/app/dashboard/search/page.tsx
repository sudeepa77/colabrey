// src/app/dashboard/search/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, Filter as FilterIcon, X } from 'lucide-react';
import Link from 'next/link';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import UserGrid from './components/UserGrid';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  major: string | null;
  year: string | null;
  skills: string[] | null;
  interests: string[] | null;
  email: string;
  created_at: string;
}

interface Filters {
  skills: string[];
  interests: string[];
  major: string;
  year: string;
}

export default function SearchPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // State
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    skills: [],
    interests: [],
    major: '',
    year: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Available filter options
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableInterests, setAvailableInterests] = useState<string[]>([]);
  const [availableMajors, setAvailableMajors] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Initialize
  useEffect(() => {
    initializeSearch();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, allProfiles]);

  async function initializeSearch() {
    try {
      setLoading(true);

      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setCurrentUserId(user.id);

      // Load initial data (smaller limit for faster load)
      await loadProfiles(user.id);

    } catch (err) {
      console.error('Error initializing search:', err);
      toast.error('Failed to load search page');
    } finally {
      setLoading(false);
    }
  }

  async function loadProfiles(userId: string, searchTerm = '') {
    try {
      setSearching(true);

      // ✅ SECURE: Use Supabase's built-in parameterization
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', userId)
        .eq('is_deleted', false)  // ✅ Only show active profiles
        .order('created_at', { ascending: false });

      // ✅ SECURE: Use textSearch for full-text search (prevents SQL injection)
      if (searchTerm.trim().length >= 2) {
        // Use ilike with proper escaping
        const escapedTerm = searchTerm.trim().replace(/[%_\\]/g, '\\$&');
        
        query = query.textSearch('fts', searchTerm, { type: 'websearch' });
      }

      // ✅ PERFORMANCE: Only load 50 profiles (reduced from 100)
      query = query.limit(50);

      const { data, error } = await query;

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      const profiles = data || [];
      setAllProfiles(profiles);
      setDisplayedProfiles(profiles);

      // Extract unique filter options
      extractFilterOptions(profiles);

      // Load additional filter options from full database
      await loadFilterOptions(userId);

    } catch (err) {
      console.error('Error loading profiles:', err);
      toast.error('Failed to load profiles. Please try again.');
      setAllProfiles([]);
      setDisplayedProfiles([]);
    } finally {
      setSearching(false);
    }
  }


  // ✅ NEW: Load filter options from entire database
  async function loadFilterOptions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('skills, interests, major, year')
        .neq('id', userId)
        .eq('is_deleted', false);

      if (error) throw error;

      if (data) {
        extractFilterOptions(data);
      }
    } catch (err) {
      console.error('Error loading filter options:', err);
      // Non-critical error, don't show toast
    }
  }
   
   type FilterSource = {
  skills?: string[] | null;
  interests?: string[] | null;
  major?: string | null;
  year?: string | null;
};

  function extractFilterOptions(profiles: FilterSource[]) {
    const skills = new Set<string>();
    const interests = new Set<string>();
    const majors = new Set<string>();
    const years = new Set<string>();

    profiles.forEach((profile) => {
      profile.skills?.forEach((skill) => skills.add(skill));
      profile.interests?.forEach((interest) => interests.add(interest));
      if (profile.major) majors.add(profile.major);
      if (profile.year) years.add(profile.year);
    });

    setAvailableSkills(Array.from(skills).sort());
    setAvailableInterests(Array.from(interests).sort());
    setAvailableMajors(Array.from(majors).sort());
    setAvailableYears(Array.from(years).sort());
  }

  // Debounced database search
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      
      if (currentUserId) {
        await loadProfiles(currentUserId, query);
      }
    },
    [currentUserId]
  );

  // ✅ IMPROVED: Client-side filtering with better matching
  function applyFilters() {
    let filtered = [...allProfiles];

    // Additional client-side text filtering (for tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((profile) => {
        const nameMatch = profile.full_name?.toLowerCase().includes(query);
        const bioMatch = profile.bio?.toLowerCase().includes(query);
        const majorMatch = profile.major?.toLowerCase().includes(query);
        const skillMatch = profile.skills?.some(s => s.toLowerCase().includes(query));
        const interestMatch = profile.interests?.some(i => i.toLowerCase().includes(query));
        
        return nameMatch || bioMatch || majorMatch || skillMatch || interestMatch;
      });
    }

    // Filter by skills (OR logic - match ANY selected skill)
    if (filters.skills.length > 0) {
      filtered = filtered.filter((profile) =>
        profile.skills?.some((skill) => filters.skills.includes(skill))
      );
    }

    // Filter by interests (OR logic - match ANY selected interest)
    if (filters.interests.length > 0) {
      filtered = filtered.filter((profile) =>
        profile.interests?.some((interest) => filters.interests.includes(interest))
      );
    }

    // Filter by major (exact match)
    if (filters.major) {
      filtered = filtered.filter((profile) => profile.major === filters.major);
    }

    // Filter by year (exact match)
    if (filters.year) {
      filtered = filtered.filter((profile) => profile.year === filters.year);
    }

    setDisplayedProfiles(filtered);
  }

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      skills: [],
      interests: [],
      major: '',
      year: '',
    });
    if (currentUserId) {
      loadProfiles(currentUserId);
    }
  };

  const activeFilterCount = 
    filters.skills.length + 
    filters.interests.length + 
    (filters.major ? 1 : 0) + 
    (filters.year ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Find People</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10"
            >
              <FilterIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            searching={searching}
          />

          {/* Active Filters Display */}
          {(searchQuery || activeFilterCount > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm border border-white/20">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => handleSearch('')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30"
                >
                  {skill}
                  <button
                    onClick={() => toggleSkill(skill)}
                    className="hover:text-blue-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30"
                >
                  {interest}
                  <button
                    onClick={() => toggleInterest(interest)}
                    className="hover:text-purple-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.major && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                  {filters.major}
                  <button
                    onClick={() => updateFilter('major', '')}
                    className="hover:text-green-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.year && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
                  {filters.year}
                  <button
                    onClick={() => updateFilter('year', '')}
                    className="hover:text-orange-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-400 hover:text-white underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Filter Panel */}
      <FilterPanel
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        availableSkills={availableSkills}
        availableInterests={availableInterests}
        availableMajors={availableMajors}
        availableYears={availableYears}
        onToggleSkill={toggleSkill}
        onToggleInterest={toggleInterest}
        onUpdateFilter={updateFilter}
        onClearAll={clearAllFilters}
      />

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">
                       

            {allProfiles.length >= 50 && (
              <span className="text-xs text-gray-500 ml-2">
                (Showing first 50 results)
              </span>
            )}
          </p>
          {searching && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </div>
          )}
        </div>

        <UserGrid profiles={displayedProfiles} />
      </main>
    </div>
  );
}