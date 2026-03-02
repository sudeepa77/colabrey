// src/lib/auth.ts
'use client';

import { createClient } from '@/lib/supabase/client';

// ============================================
// EMAIL VALIDATION
// ============================================

/**
 * Check if email matches any of the allowed domains
 * Supports multiple domains from environment variables
 */
export const isValidInstitutionEmail = (email: string): boolean => {
  const allowedDomainsString = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS || '';
  
  const allowedDomains = allowedDomainsString
    .split(',')
    .map(domain => domain.trim().toLowerCase());
  
  const emailLower = email.toLowerCase();
  
  return allowedDomains.some(domain => emailLower.endsWith(domain));
};

/**
 * Get formatted list of allowed domains for error messages
 */
export const getAllowedDomainsText = (): string => {
  const allowedDomainsString = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS || '';
  const domains = allowedDomainsString.split(',').map(d => d.trim());
  
  if (domains.length === 1) {
    return domains[0];
  } else if (domains.length === 2) {
    return `${domains[0]} or ${domains[1]}`;
  } else {
    const lastDomain = domains.pop();
    return `${domains.join(', ')}, or ${lastDomain}`;
  }
};

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Sign up a new user with institution email
 */
export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClient(); // ✅ Create fresh instance
  
  if (!isValidInstitutionEmail(email)) {
    const allowedDomains = getAllowedDomainsText();
    throw new Error(`Please use your institution email address (${allowedDomains})`);
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  if (!fullName || fullName.trim().length < 2) {
    throw new Error('Please enter your full name');
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error('This email is already registered. Please login instead.');
    }
    throw error;
  }

  return data;
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();
  
  if (!isValidInstitutionEmail(email)) {
    const allowedDomains = getAllowedDomainsText();
    throw new Error(`Please use your institution email address (${allowedDomains})`);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Please verify your email address before logging in.');
    }
    throw error;
  }

  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

/**
 * Get current authenticated user
 */
export async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClient();
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(_event, session);
  });
}

// ============================================
// PROFILE FUNCTIONS
// ============================================

/**
 * Get user profile by user ID
 */
export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, data: any) {
  const supabase = createClient();

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    throw new Error('No active session');
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('updateProfile error:', error);
    throw error;
  }
}

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Search users by tags (skills/interests)
 */
export async function searchUsersByTags(tags: string[]) {
  const supabase = createClient();
  
  if (!tags || tags.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(
      tags.map(tag => `skills.cs.{${tag}},interests.cs.{${tag}}`).join(',')
    )
    .limit(50);

  if (error) throw error;
  return data || [];
}

/**
 * Search users by name or email
 */
export async function searchUsersByName(searchTerm: string) {
  const supabase = createClient();
  
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .limit(20);

  if (error) throw error;
  return data || [];
}

/**
 * Get all profiles (for discovery)
 */
export async function getAllProfiles(limit: number = 50) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ============================================
// PASSWORD RESET
// ============================================

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    return !!session;
  } catch {
    return false;
  }
}

// ============================================
// MESSAGING FUNCTIONS
// ============================================

/**
 * Send a message
 */
export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const supabase = createClient();
  
  if (!content || content.trim().length === 0) {
    throw new Error('Message cannot be empty');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get messages between two users
 */
export async function getMessages(userId: string, otherUserId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);

  if (error) throw error;
}

/**
 * Get unread message count for user
 */
export async function getUnreadMessageCount(userId: string) {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('read', false);

  if (error) throw error;
  return count || 0;
}