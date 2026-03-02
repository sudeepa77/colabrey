// src/app/dashboard/messages/components/TypingIndicator.tsx
'use client';
import { useEffect, useState } from 'react';
import { subscribeToTypingIndicator } from '@/lib/messaging/api';

interface TypingIndicatorProps {
  userId: string;
  otherUserId: string;
}

export default function TypingIndicator({ userId, otherUserId }: TypingIndicatorProps) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const channel = subscribeToTypingIndicator(userId, otherUserId, setIsTyping);
    return () => { channel.unsubscribe(); };
  }, [userId, otherUserId]);
  
  const isRecentlyTyping = (updatedAt: string): boolean => {
    const updated = new Date(updatedAt).getTime();
    const now = Date.now();
    return (now - updated) < 8000; // 8 seconds
  };
      

  


  if (!isTyping) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-green-400">
      <span>typing</span>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}