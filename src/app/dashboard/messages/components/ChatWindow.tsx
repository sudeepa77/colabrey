// src/app/dashboard/messages/components/ChatWindow.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MoreVertical, Loader2, User, X, Pin, Archive, UserCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './Messageinputs';
import TypingIndicator from './TypingIndicator';
import { 
  getMessages, 
  markMessagesAsRead, 
  subscribeToMessages, 
  subscribeToMessageUpdates, 
  togglePinConversation, 
  clearConversation,
  deleteMessage,
  getConversationPinStatus 
} from '@/lib/messaging/api';
import { groupMessagesByDate } from '@/lib/messaging/utils';
import { Message } from '@/types/messaging';
import { toast } from 'sonner';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface ChatWindowProps {
  currentUserId: string;
  otherUserId: string;
  onNewMessage: () => void;
}

export default function ChatWindow({ currentUserId, otherUserId, onNewMessage }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Close menu when clicking outside
  useClickOutside(menuRef, () => setShowMenu(false));

  // Load initial data
  useEffect(() => {
    loadChatData();
    
    // Subscribe to new messages
    const msgChannel = subscribeToMessages(currentUserId, otherUserId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      
      // Mark as read if we're the receiver
      if (newMessage.receiver_id === currentUserId && newMessage.id) {
        markMessagesAsRead([newMessage.id]);
      }
      
      onNewMessage();
      scrollToBottom();
    });

    // Subscribe to message updates (deletions, read receipts)
    const updateChannel = subscribeToMessageUpdates(currentUserId, otherUserId, (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );
    });

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(updateChannel);
    };
  }, [currentUserId, otherUserId]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadChatData() {
    try {
      setLoading(true);

      // Load other user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', otherUserId)
        .single();

      setOtherUser(profile);

      // Load messages
      const messagesData = await getMessages(currentUserId, otherUserId);
      setMessages(messagesData);

      // Mark unread messages as read
      const unreadIds = messagesData
        .filter((msg) => msg.receiver_id === currentUserId && !msg.read_at)
        .map((msg) => msg.id);

      if (unreadIds.length > 0) {
        await markMessagesAsRead(unreadIds);
      }

      // Load pin status
      const pinStatus = await getConversationPinStatus(currentUserId, otherUserId);
      setIsPinned(pinStatus);

    } catch (err) {
      console.error('Error loading chat:', err);
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePin = async () => {
    try {
      await togglePinConversation(currentUserId, otherUserId, !isPinned);
      setIsPinned(!isPinned);
      setShowMenu(false);
      toast.success(isPinned ? 'Conversation unpinned' : 'Conversation pinned');
    } catch (error) {
      console.error('Pin error:', error);
      toast.error('Failed to update pin status');
    }
  };

  const handleClearChat = async () => {
    if (!confirm('Are you sure you want to clear all messages in this chat? This cannot be undone.')) return;
    
    try {
      await clearConversation(currentUserId, otherUserId);
      setMessages([]);
      setShowMenu(false);
      toast.success('Chat cleared successfully');
    } catch (error) {
      console.error('Clear chat error:', error);
      toast.error('Failed to clear chat');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, is_deleted: true } : m))
      );
      toast.success('Message deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete message');
    }
  };

  // Filter messages based on search
  const filteredMessages = searchQuery
    ? messages.filter((msg) => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const groupedMessages = groupMessagesByDate(filteredMessages);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const initials = otherUser.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* WhatsApp-style Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 58C14.5 58 2 45.5 2 30S14.5 2 30 2s28 12.5 28 28-12.5 28-28 28z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-3 flex items-center gap-4 flex-shrink-0 relative z-10">
        <Link href={`/dashboard/profile/${otherUserId}`} className="flex items-center gap-3 flex-1 min-w-0">
          {otherUser.avatar_url ? (
            <Image
              src={otherUser.avatar_url}
              alt={otherUser.full_name || 'User'}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold truncate text-sm">
              {otherUser.full_name || 'Unknown User'}
            </h2>
            <TypingIndicator userId={currentUserId} otherUserId={otherUserId} />
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setShowSearch(!showSearch);
              setSearchQuery('');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-12 bg-[#2a2a2a] rounded-xl shadow-xl border border-gray-700 py-2 w-48 z-50">
                <button
                  onClick={handlePin}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 flex items-center gap-3"
                >
                  <Pin className="w-4 h-4" />
                  {isPinned ? 'Unpin' : 'Pin'} Conversation
                </button>
                <button
                  onClick={handleClearChat}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 flex items-center gap-3"
                >
                  <Archive className="w-4 h-4" />
                  Clear Chat
                </button>
                <Link
                  href={`/dashboard/profile/${otherUserId}`}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 flex items-center gap-3"
                  onClick={() => setShowMenu(false)}
                >
                  <UserCircle className="w-4 h-4" />
                  View Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-6 py-3 bg-[#1a1a1a] border-b border-gray-800 relative z-10" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-500 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 relative" style={{ backgroundColor: '#0a0a0a' }}>
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex items-center justify-center my-4">
              <div className="px-3 py-1 bg-[#1a1a1a] rounded-full">
                <span className="text-xs text-gray-500">{date}</span>
              </div>
            </div>
            <div className="space-y-2">
              {msgs.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_id === currentUserId}
                  currentUserId={currentUserId}
                  onDelete={handleDeleteMessage}
                />
              ))}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <User className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-600 text-xs mt-1">Start the conversation!</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        currentUserId={currentUserId}
        otherUserId={otherUserId}
        onMessageSent={() => {
          onNewMessage();
          scrollToBottom();
        }}
      />
    </div>
  );
}