// src/lib/messaging/utils.ts
import { createClient } from '@/lib/supabase/client';
import { Message, MessageStatus, AttachmentType } from '@/types/messaging';
import { format, isToday, isYesterday } from 'date-fns';

/**
 * Determine message status for read receipts
 */
export function getMessageStatus(message: Message, currentUserId: string): MessageStatus {
  if (message.sender_id !== currentUserId) {
    return 'delivered';
  }
  
  if (message.read_at) return 'read';
  if (message.delivered_at) return 'delivered';
  return 'sending';
}

/**
 * Format message timestamp for display
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  
  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  }
  
  return format(date, 'MMM dd, HH:mm');
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Determine attachment type from file
 */
export function getAttachmentType(file: File): AttachmentType {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('video/')) return 'video';
  return 'document';
}

/**
 * Upload file to Supabase Storage with SIGNED URL (SECURE)
 * Works with PRIVATE buckets to maintain conversation privacy
 */
export async function uploadMessageAttachment(
  file: File,
  userId: string
): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  
  try {
    // Generate unique filename in user's folder
    const fileExt = file.name.split('.').pop() || 'file';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${userId}/${timestamp}-${random}.${fileExt}`;

    console.log('📤 Uploading to private bucket:', fileName);

    // Upload to storage
    const { data, error } = await supabase.storage
      .from('message-attachments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('✅ Upload successful');

    // ⚠️ CRITICAL: Use signed URL for private bucket
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('message-attachments')
      .createSignedUrl(data.path, 31536000); // 1 year

    if (signedUrlError) {
      console.error('❌ Signed URL error:', signedUrlError);
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    console.log('✅ Signed URL generated');

    return {
      url: signedUrlData.signedUrl,
      path: data.path
    };
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please upload images, PDFs, or documents.'
    };
  }
  
  return { valid: true };
}

/**
 * Group messages by date for display
 */
export function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const groups: Record<string, Message[]> = {};
  
  messages.forEach((message) => {
    const date = new Date(message.created_at);
    let dateKey: string;
    
    if (isToday(date)) {
      dateKey = 'Today';
    } else if (isYesterday(date)) {
      dateKey = 'Yesterday';
    } else {
      dateKey = format(date, 'MMMM dd, yyyy');
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(message);
  });
  
  return groups;
}

/**
 * Truncate long text for previews
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Check if user is online (optional - for future feature)
 */
export function isUserOnline(lastSeen: string | null): boolean {
  if (!lastSeen) return false;
  
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastSeenDate.getTime()) / 1000 / 60;
  
  return diffMinutes < 5;
}