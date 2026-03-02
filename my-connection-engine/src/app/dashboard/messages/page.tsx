// src/app/dashboard/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeMessages();
  }, []);

  useEffect(() => {
    // Check for user param in URL
    const userParam = searchParams.get('user');
    if (userParam) {
      setSelectedUserId(userParam);
    }
  }, [searchParams]);

  async function initializeMessages() {
    try {
      const supabase = createClient();

      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setCurrentUserId(user.id);
      await loadConversations(user.id);

    } catch (err) {
      console.error('Error initializing messages:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadConversations(userId: string) {
    try {
      const supabase = createClient();

      // 1. Load conversations (THIS is the inbox source)
      const { data: convs, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      if (!convs || convs.length === 0) {
        setConversations([]);
        return;
      }

      // 2. Get other user ids
      const otherUserIds = convs.map((c) =>
        c.user1_id === userId ? c.user2_id : c.user1_id
      );

      // 3. Load profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', otherUserIds);

      // 4. Build inbox list
      const inbox: Conversation[] = convs.map((conv) => {
        const otherUserId =
          conv.user1_id === userId ? conv.user2_id : conv.user1_id;

        const profile = profiles?.find((p) => p.id === otherUserId);

        return {
          userId: otherUserId,
          userName: profile?.full_name || 'Unknown User',
          userAvatar: profile?.avatar_url || null,
          lastMessage: '',
          lastMessageTime: conv.last_message_at,
          unreadCount: 0,
        };
      });

      // 5. Unread count (correct way)
      const { data: unread } = await supabase
        .from('messages')
        .select('sender_id', { count: 'exact' })
        .eq('receiver_id', userId)
        .is('read_at', null)
        .eq('is_deleted', false);

      inbox.forEach((c) => {
        c.unreadCount =
          unread?.filter((m) => m.sender_id === c.userId).length || 0;
      });

      setConversations(inbox);
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  }


  const handleConversationSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleNewMessage = () => {
    if (currentUserId) {
      loadConversations(currentUserId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-black border-b border-neutral-800 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
<div className="flex-1 flex overflow-hidden relative">
  {/* Conversation List: Hide on mobile if a chat is selected */}
  <div className={`
    w-full md:w-96 border-r border-neutral-800 flex-shrink-0 overflow-y-auto bg-black
    ${selectedUserId ? 'hidden md:block' : 'block'}
  `}>
    <ConversationList
      conversations={conversations}
      selectedUserId={selectedUserId}
      onSelectConversation={handleConversationSelect}
    />
  </div>

  {/* Chat Window: Hide on mobile if NO chat is selected */}
  <div className={`
    flex-1 flex flex-col bg-black
    ${selectedUserId ? 'block' : 'hidden md:flex'}
  `}>
    {selectedUserId && currentUserId ? (
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile Back Button (ONLY visible on mobile) */}
        <div className="md:hidden p-4 border-b border-neutral-800 flex items-center gap-3">
          <button 
            onClick={() => setSelectedUserId(null)}
            className="text-gray-400 p-1"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-white">Chat</span>
        </div>

        <ChatWindow
          currentUserId={currentUserId}
          otherUserId={selectedUserId}
          onNewMessage={handleNewMessage}
        />
      </div>
    ) : (
      /* Desktop Placeholder remains same */
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Choose a conversation to start messaging</p>
      </div>
    )}
  </div>
</div>
    </div>
  );
}