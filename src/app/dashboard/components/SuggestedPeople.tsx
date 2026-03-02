// app/dashboard/components/SuggestedPeople.tsx
import { SuggestedUser } from '@/types/user/database';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';
import ConnectionButton from '@/components/ui/ConnectionButton';


interface SuggestedPeopleProps {
  users: SuggestedUser[];
}

export default function SuggestedPeople({ users }: SuggestedPeopleProps) {
  if (users.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Suggested Connections
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No suggestions yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 h-fit sticky top-6">
      <div className="flex items-center fix justify-between mb-6">
        <h3 className="text-lg font-bold text-white">
          Suggested Connections
        </h3>
        <Link
          href="/dashboard/search"
          className="text-sm text-blue-500 hover:text-blue-400 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {users.slice(0, 4).map((user) => {
          const initials = user.full_name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';

          return (
            <div
              key={user.id}
              className="flex items-center gap-3 group"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white text-xs font-semibold">
                    {initials}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">
                  {user.full_name || 'Anonymous'}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {user.bio || 'Student'}
                </p>
              </div>

      
             {/* Action Buttons */}
<div className="flex flex-col gap-2">
  <Link
    href={`/dashboard/profile/${user.id}`}
    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
  >
    View
  </Link>
  <Link
                  href={`/dashboard/messages?user=${user.id}`}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                </Link>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}