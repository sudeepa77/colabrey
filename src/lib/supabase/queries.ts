// lib/supabase/queries.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { Profile, ConversationPreview, SuggestedUser } from '@/types/user/database';

/**
 * Fetch current user's profile
 */
export async function getCurrentUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

/**
 * Get suggested users based on matching skills and interests
 */
export async function getSuggestedUsers(
  supabase: SupabaseClient,
  currentUserId: string,
  currentUserSkills: string[] = [],
  currentUserInterests: string[] = []
): Promise<SuggestedUser[]> {
  // Fetch all users except current user
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bio, skills, interests')
    .neq('id', currentUserId)
    .limit(50); // Fetch more to filter and sort

  if (error || !users) {
    console.error('Error fetching suggested users:', error);
    return [];
  }

  // Calculate match scores
  const userTags = [...currentUserSkills, ...currentUserInterests].map(t => t.toLowerCase());
  
  const scoredUsers = users.map(user => {
    const otherSkills = user.skills || [];
    const otherInterests = user.interests || [];
    const otherTags = [...otherSkills, ...otherInterests].map(t => t.toLowerCase());
    
    const matchingTags = userTags.filter(tag => otherTags.includes(tag));
    
    return {
      ...user,
      matchingTags: matchingTags.map(tag => {
        // Return original case from either skills or interests
        return [...currentUserSkills, ...currentUserInterests].find(
          t => t.toLowerCase() === tag
        ) || tag;
      }),
      matchCount: matchingTags.length,
    };
  });

  // Filter users with at least 1 match and sort by match count
  const filteredUsers = scoredUsers
    .filter(user => user.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 8); // Limit to 8 suggestions

  // If no matches found, return random users
  if (filteredUsers.length === 0) {
    return users.slice(0, 8).map(user => ({
      ...user,
      matchingTags: [],
      matchCount: 0,
    }));
  }

  return filteredUsers;
}

/**
 * Get recent conversations for the current user
 */
export async function getRecentConversations(
  supabase: SupabaseClient,
  currentUserId: string
): Promise<ConversationPreview[]> {
  // Fetch all messages where user is sender or receiver
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
    .order('created_at', { ascending: false })
    .limit(100); // Fetch enough to group

  if (error || !messages) {
    console.error('Error fetching messages:', error);
    return [];
  }

  // Group by conversation partner
  const conversationMap = new Map<string, ConversationPreview>();

  for (const message of messages) {
    const otherUserId = message.sender_id === currentUserId 
      ? message.receiver_id 
      : message.sender_id;

    if (!conversationMap.has(otherUserId)) {
      conversationMap.set(otherUserId, {
        otherUserId,
        otherUserName: '', // Will fetch below
        otherUserAvatar: null,
        lastMessage: message.content,
        lastMessageTime: message.created_at,
        unreadCount: 0,
        isLastMessageFromMe: message.sender_id === currentUserId,
      });
    }

    // Count unread messages from other user
    if (message.sender_id === otherUserId && !message.read) {
      const conv = conversationMap.get(otherUserId)!;
      conv.unreadCount += 1;
    }
  }

  const conversations = Array.from(conversationMap.values());

  // Fetch user details for all conversation partners
  if (conversations.length > 0) {
    const userIds = conversations.map(c => c.otherUserId);
    const { data: users } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds);

    if (users) {
      const userMap = new Map(users.map(u => [u.id, u]));
      conversations.forEach(conv => {
        const user = userMap.get(conv.otherUserId);
        if (user) {
          conv.otherUserName = user.full_name || 'Unknown User';
          conv.otherUserAvatar = user.avatar_url;
        }
      });
    }
  }

  // Sort by most recent and limit to 5
  return conversations
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
    .slice(0, 5);
}