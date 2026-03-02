// src/app/dashboard/messages/components/Messageinputs.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X, Loader2, FileText } from 'lucide-react';
import { sendMessage, setTypingIndicator } from '@/lib/messaging/api';
import { uploadMessageAttachment, validateFile, getAttachmentType, formatFileSize } from '@/lib/messaging/utils';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';

interface MessageInputProps {
  currentUserId: string;
  otherUserId: string;
  onMessageSent: () => void;
}

export default function MessageInput({ currentUserId, otherUserId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close emoji picker when clicking outside
  useClickOutside(emojiPickerRef, () => setShowEmoji(false));

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleTyping = (value: string) => {
    setMessage(value);
    
    // Send typing indicator
    setTypingIndicator(currentUserId, otherUserId, true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTypingIndicator(currentUserId, otherUserId, false);
    }, 2000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setAttachment(file);

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setAttachmentPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };

  const handleSend = async () => {
    if ((!message.trim() && !attachment) || sending) return;

    setSending(true);
    setUploading(!!attachment);

    try {
      let attachmentUrl, attachmentType, attachmentName, attachmentSize;

      // Upload attachment if present
      if (attachment) {
        try {
          const { url } = await uploadMessageAttachment(attachment, currentUserId);
          attachmentUrl = url;
          attachmentType = getAttachmentType(attachment);
          attachmentName = attachment.name;
          attachmentSize = attachment.size;
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Failed to upload attachment');
          setSending(false);
          setUploading(false);
          return;
        }
      }

      // Send message
      await sendMessage({
        senderId: currentUserId,
        receiverId: otherUserId,
        content: message.trim() || '',
        attachmentUrl,
        attachmentType,
        attachmentName,
        attachmentSize,
      });

      // Clear form
      setMessage('');
      setAttachment(null);
      setAttachmentPreview(null);
      setTypingIndicator(currentUserId, otherUserId, false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      onMessageSent();
      
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#1a1a1a] border-t border-gray-800 p-3 flex-shrink-0">
      {/* Attachment Preview */}
      {attachment && (
        <div className="mb-2 p-3 bg-[#0a0a0a] rounded-xl border border-gray-800 flex items-center gap-3">
          {attachmentPreview ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={attachmentPreview}
                alt="Preview"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{attachment.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
          </div>
          <button
            onClick={removeAttachment}
            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
            disabled={sending}
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attach File Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={sending || uploading}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx"
        />

        {/* Text Input */}
        <div className="flex-1 relative bg-[#0a0a0a] rounded-xl border border-gray-800 focus-within:border-blue-500">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              handleTyping(e.target.value);
              autoResize();
            }}
            onKeyPress={handleKeyPress}
            placeholder={uploading ? "Uploading..." : "Type a message..."}
            rows={1}
            disabled={sending || uploading}
            className="w-full px-4 py-2.5 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none resize-none max-h-32 disabled:opacity-50"
            style={{ minHeight: '40px' }}
          />
        </div>

        {/* Emoji Picker */}
        <div className="relative" ref={emojiPickerRef}>
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            disabled={sending || uploading}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          {showEmoji && (
            <div className="absolute bottom-14 right-0 z-50">
              <EmojiPicker
                onEmojiClick={(emojiData: EmojiClickData) => {
                  setMessage((prev) => prev + emojiData.emoji);
                  setShowEmoji(false);
                  textareaRef.current?.focus();
                }}
                theme={Theme.DARK}
                width={320}
                height={400}
              />
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && !attachment) || sending || uploading}
          className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {sending || uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}