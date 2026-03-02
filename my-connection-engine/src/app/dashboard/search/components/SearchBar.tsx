// src/app/dashboard/search/components/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  searching: boolean;
}

export default function SearchBar({ onSearch, searching }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      
      <input
        type="text"
        placeholder="Search by name, bio, major, skills, or interests..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-24 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {searching && (
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        )}
        {query && !searching && (
          <button
            onClick={handleClear}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Typing indicator */}
      {query !== debouncedQuery && (
        <div className="absolute left-4 -bottom-6 text-xs text-gray-500">
          Searching...
        </div>
      )}
    </div>
  );
}