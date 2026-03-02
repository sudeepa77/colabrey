// src/lib/messaging/api.ts
import { createClient } from '@/lib/supabase/client';
import { Message } from '@/types/messaging';

/**
 * Send a new message
 */
export async function sendMessage(params: {
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentName?: string;
  attachmentSize?: number;
}): Promise<Message> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: params.senderId,
      receiver_id: params.receiverId,
      content: params.content,
      attachment_url: params.attachmentUrl || null,
      attachment_type: params.attachmentType || null,
      attachment_name: params.attachmentName || null,
      attachment_size: params.attachmentSize || null,
      delivered_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all messages in a conversation
 */
export async function getMessages(userId: string, otherUserId: string): Promise<Message[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(messageIds: string[]): Promise<void> {
  if (messageIds.length === 0) return;
  
  const supabase = createClient();
  
  const { error } = await supabase
    .from('messages')
    .update({ 
      read: true, 
      read_at: new Date().toISOString() 
    })
    .in('id', messageIds);

  if (error) throw error;
}

/**
 * Delete a message (soft delete)
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('messages')
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      content: '',
    })
    .eq('id', messageId);

  if (error) throw error;
}

/**
 * Toggle pin conversation
 */
export async function togglePinConversation(
  userId: string, 
  otherUserId: string, 
  isPinned: boolean
): Promise<void> {
  const supabase = createClient();
  
  // Ensure ordered user IDs
  const [minUser, maxUser] = [userId, otherUserId].sort();
  
  // Find the conversation
  const { data: conv, error: fetchError } = await supabase
    .from('conversations')
    .select('user1_id, user2_id')
    .eq('user1_id', minUser)
    .eq('user2_id', maxUser)
    .single();

  if (fetchError || !conv) {
    throw new Error('Conversation not found');
  }

  // Determine which field to update
  const field = conv.user1_id === userId ? 'user1_pinned' : 'user2_pinned';
  
  const { error } = await supabase
    .from('conversations')
    .update({ [field]: isPinned })
    .eq('user1_id', minUser)
    .eq('user2_id', maxUser);

  if (error) throw error;
}

/**
 * Clear all messages in a conversation (soft delete)
 */
export async function clearConversation(userId: string, otherUserId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('messages')
    .update({ 
      is_deleted: true, 
      deleted_at: new Date().toISOString() 
    })
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`);

  if (error) throw error;
}

/**
 * Get pin status for a conversation
 */
export async function getConversationPinStatus(
  userId: string, 
  otherUserId: string
): Promise<boolean> {
  const supabase = createClient();
  
  const [minUser, maxUser] = [userId, otherUserId].sort();
  
  const { data, error } = await supabase
    .from('conversations')
    .select('user1_id, user1_pinned, user2_pinned')
    .eq('user1_id', minUser)
    .eq('user2_id', maxUser)
    .single();

  if (error || !data) return false;
  
  return data.user1_id === userId ? data.user1_pinned : data.user2_pinned;
}

/**
 * Set typing indicator
 */
export async function setTypingIndicator(
  userId: string, 
  partnerId: string, 
  isTyping: boolean
): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('typing_indicators')
    .upsert({
      user_id: userId,
      conversation_partner_id: partnerId,
      is_typing: isTyping,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,conversation_partner_id'
    });

  if (error) console.error('Typing indicator error:', error);
}

/**
 * Subscribe to typing indicator updates
 */
export function subscribeToTypingIndicator(
  userId: string, 
  partnerId: string, 
  callback: (isTyping: boolean) => void
) {
  const supabase = createClient();
  
  const channel = supabase
    .channel(`typing:${partnerId}:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'typing_indicators',
        filter: `user_id=eq.${partnerId}`,
      },
      (payload: any) => {
        if (payload.new?.conversation_partner_id === userId) {
          callback(payload.new?.is_typing || false);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to new messages
 */
export function subscribeToMessages(
  userId: string, 
  otherUserId: string, 
  callback: (message: Message) => void
) {
  const supabase = createClient();
  
  const channel = supabase
    .channel(`messages:${userId}:${otherUserId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      (payload: any) => {
        const msg = payload.new as Message;
        if (
          (msg.sender_id === userId && msg.receiver_id === otherUserId) ||
          (msg.sender_id === otherUserId && msg.receiver_id === userId)
        ) {
          callback(msg);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to message updates (for read receipts, deletions, etc.)
 */
export function subscribeToMessageUpdates(
  userId: string, 
  otherUserId: string, 
  callback: (message: Message) => void
) {
  const supabase = createClient();
  
  const channel = supabase
    .channel(`message-updates:${userId}:${otherUserId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
      },
      (payload: any) => {
        const msg = payload.new as Message;
        if (
          (msg.sender_id === userId && msg.receiver_id === otherUserId) ||
          (msg.sender_id === otherUserId && msg.receiver_id === userId)
        ) {
          callback(msg);
        }
      }
    )
    .subscribe();

  return channel;
}