// src/types/connections.ts
export type ConnectionStatus = 
  | 'none'           // No connection
  | 'pending_sent'   // Current user sent request
  | 'pending_received' // Current user received request
  | 'connected';     // Connected

export interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    major: string | null;
  };
  receiver?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    major: string | null;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'connection_request' | 'connection_accepted' | 'new_message' | 'post_like' | 'post_comment' | 'follow';
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  data: Record<string, any>;
  created_at: string;
}