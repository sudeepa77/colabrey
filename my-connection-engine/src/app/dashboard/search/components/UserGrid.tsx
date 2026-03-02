// src/app/dashboard/search/components/UserGrid.tsx
'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import ConnectionButton from '@/components/ui/ConnectionButton';

interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  major: string | null;
  year: string | null;
  skills: string[] | null;
  interests: string[] | null;
}

interface UserGridProps {
  profiles: Profile[];
}

export default function UserGrid({ profiles }: UserGridProps) {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No users found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => {
        const initials = profile.full_name
          ?.split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'U';

        return (
          <div
            key={profile.id}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all"
          >
            {/* Avatar */}
            <Link 
              href={`/dashboard/profile/${profile.id}`}
              className="block mb-4"
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-neutral-800 hover:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-neutral-700 hover:border-blue-500 flex items-center justify-center text-white text-2xl font-bold mx-auto transition-colors">
                  {initials}
                </div>
              )}
            </Link>

            {/* Info */}
            <div className="text-center mb-4">
              <Link href={`/dashboard/profile/${profile.id}`}>
                <h3 className="text-lg font-bold text-white hover:text-blue-400 transition-colors mb-1">
                  {profile.full_name || 'Anonymous User'}
                </h3>
              </Link>
              {profile.major && (
                <p className="text-sm text-gray-400 mb-2">{profile.major}</p>
              )}
              {profile.bio && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Skills/Interests */}
            {(profile.skills?.length || profile.interests?.length) && (
              <div className="flex flex-wrap gap-1 mb-4 justify-center">
                {profile.skills?.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
                  >
                    {skill}
                  </span>
                ))}
                {(profile.skills?.length || 0) > 3 && (
                  <span className="px-2 py-1 bg-neutral-800 text-gray-400 text-xs rounded-full">
                    +{(profile.skills?.length || 0) - 3}
                  </span>
                )}
              </div>
            )}

            {/* ✅ Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <ConnectionButton 
                userId={profile.id}
                className="text-xs py-2"
              />
              <Link
                href={`/dashboard/messages?user=${profile.id}`}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                Message
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}