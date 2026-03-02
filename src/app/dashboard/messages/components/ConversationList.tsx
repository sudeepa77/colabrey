// src/app/dashboard/messages/components/ConversationList.tsx
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedUserId: string | null;
  onSelectConversation: (userId: string) => void;
}

function formatTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center pt-10">
        <MessageSquare className="w-16 h-16 text-neutral-700 mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No messages yet</h3>
        <p className="text-sm text-gray-600">Start a conversation from the search page</p>
      </div>
    );
  }

  return (
    <div className="pt-6 divide-y divide-gray-800">
      {conversations.map((conversation) => {
        const initials = conversation.userName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        const isSelected = conversation.userId === selectedUserId;

        return (
          <button
            key={conversation.userId}
            onClick={() => onSelectConversation(conversation.userId)}
            className={`w-full p-4 hover:bg-white/5 transition-colors text-left ${isSelected ? 'bg-white/10' : ''
              }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {conversation.userAvatar ? (
                  <Image
                    src={conversation.userAvatar}
                    alt={conversation.userName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {initials}
                  </div>
                )}
                {/* Unread indicator */}
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className={`text-sm font-semibold truncate ${conversation.unreadCount > 0 ? 'text-white' : 'text-gray-300'
                    }`}>
                    {conversation.userName}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-300 font-medium' : 'text-gray-500'
                  }`}>
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}