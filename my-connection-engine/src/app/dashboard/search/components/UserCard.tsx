// src/app/dashboard/search/components/UserCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, Calendar, GraduationCap } from 'lucide-react';

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

interface UserCardProps {
  profile: Profile;
}

export default function UserCard({ profile }: UserCardProps) {
  const initials = profile.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all group hover:shadow-xl hover:shadow-blue-500/10">
      {/* Header with Avatar & Name */}
      <div className="flex items-start gap-4 mb-4">
        <Link href={`/dashboard/profile/${profile.id}`} className="flex-shrink-0">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || 'User'}
              width={64}
              height={64}
              className="rounded-full object-cover ring-2 ring-gray-800 group-hover:ring-blue-500 transition-all"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold ring-2 ring-gray-800 group-hover:ring-blue-500 transition-all">
              {initials}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/dashboard/profile/${profile.id}`}>
            <h3 className="text-lg font-semibold text-white truncate hover:text-blue-400 transition-colors">
              {profile.full_name || 'Anonymous'}
            </h3>
          </Link>
          
          {/* Education Info */}
          <div className="mt-1 space-y-1">
            {profile.major && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{profile.major}</span>
              </div>
            )}
            {profile.year && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{profile.year}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">Skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 font-medium"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 3 && (
              <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full font-medium">
                +{profile.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">Interests</p>
          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 2).map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30 font-medium"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 2 && (
              <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full font-medium">
                +{profile.interests.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
        <Link
          href={`/dashboard/profile/${profile.id}`}
          className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-center text-sm font-medium border border-white/10"
        >
          View Profile
        </Link>
        <Link
          href={`/dashboard/messages?user=${profile.id}`}
          className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center justify-center shadow-lg shadow-blue-500/30"
          title="Send Message"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}