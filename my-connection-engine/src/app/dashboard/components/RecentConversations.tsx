// app/dashboard/components/RecentConversations.tsx

import { ConversationPreview } from '@/types/user/database';
import Link from 'next/link';
import Image from 'next/image';

interface RecentConversationsProps {
  conversations: ConversationPreview[];
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

export default function RecentConversations({ conversations }: RecentConversationsProps) {
  return (
         <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">
          Recent Conversations
        </h3>
        <Link
          href="/dashboard/messages"
          className="text-xs text-blue-500 font-medium hover:underline"
        >
          View all
        </Link>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No active projects or conversations yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="divide-y divide-neutral-800">
            {conversations.slice(0, 3).map((conv) => (
              <Link
                key={conv.otherUserId}
                href={`/dashboard/messages?user=${conv.otherUserId}`}
                className="flex items-center gap-4 p-4 hover:bg-neutral-900 transition-colors rounded-xl"
              >
                {/* Avatar Section */}
                <div className="relative flex-shrink-0">
                  {conv.otherUserAvatar ? (
                    <Image
                      src={conv.otherUserAvatar}
                      alt={conv.otherUserName}
                      width={48}
                      height={48}
                      className="rounded-xl object-cover w-12 h-12"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-gray-400 font-bold border border-neutral-700">
                      {conv.otherUserName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
                  )}
                </div>

                {/* Text Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h5 className="font-semibold text-white truncate text-sm">
                      {conv.otherUserName}
                    </h5>
                    <span className="text-[10px] text-gray-500">
                      {formatTimeAgo(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
                    {conv.isLastMessageFromMe && <span className="text-gray-600">You: </span>}
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Chevron */}
              <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}