// src/types/messaging.ts

export type AttachmentType = 'image' | 'document' | 'pdf' | 'video';
export type MessageStatus = 'sending' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  delivered_at: string | null;
  read_at: string | null;
  edited_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  attachment_url: string | null;
  attachment_type: AttachmentType | null;
  attachment_name: string | null;
  attachment_size: number | null;
  read: boolean;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  user1_archived: boolean;
  user2_archived: boolean;
  user1_pinned: boolean;
  user2_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface TypingIndicator {
  id: string;
  user_id: string;
  conversation_partner_id: string;
  is_typing: boolean;
  updated_at: string;
}