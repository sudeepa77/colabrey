// app/dashboard/components/UserSummary.tsx
import { Profile } from '@/types/user/database';
import Image from 'next/image';
import Link from 'next/link';

interface UserSummaryProps {
  profile: Profile;
}

export default function UserSummary({ profile }: UserSummaryProps) {
  const initials = profile.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || 'User'}
              width={100}
              height={100}
              className="rounded-full object-cover border-4 border-neutral-800"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center text-white text-3xl font-medium border-4 border-neutral-700">
              {initials}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-1">
            {profile.full_name || 'Anonymous User'}
          </h2>

          <p className="text-blue-500 font-medium mb-4">
            {profile.major || 'Student'}
          </p>

          <p className="text-gray-400 mb-6 max-w-2xl">
            {profile.bio || 'No bio yet. Update your profile to share more about yourself!'}
          </p>

          <Link
            href="/dashboard/edit-profile"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}