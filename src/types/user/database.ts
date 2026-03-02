// types/database.ts
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  major: string | null;
  year: string | null;
  residence_type: string | null;
  skills: string[] | null;
  interests: string[] | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationPreview {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isLastMessageFromMe: boolean;
}

export interface SuggestedUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  skills: string[] | null;
  interests: string[] | null;
  matchingTags: string[];
  matchCount: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface ProfileUpdate {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  resume_url?: string;
  major?: string;
  year?: string;
  residence_type?: string;
  skills?: string[];
  interests?: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
}