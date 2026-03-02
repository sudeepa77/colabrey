// src/app/dashboard/messages/components/MessageBubble.tsx
'use client';

import { useState } from 'react';
import { Message } from '@/types/messaging';
import { formatMessageTime, getMessageStatus, formatFileSize } from '@/lib/messaging/utils';
import { Check, CheckCheck, Trash2, Download, FileText, X } from 'lucide-react';
import Image from 'next/image';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId: string;
  onDelete: (messageId: string) => void;
}

export default function MessageBubble({
  message,
  isOwn,
  currentUserId,
  onDelete,
}: MessageBubbleProps) {
  const [imagePreview, setImagePreview] = useState(false);
  const status = getMessageStatus(message, currentUserId);

  // Show deleted message placeholder
  if (message.is_deleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className="max-w-[70%] px-3 py-2 rounded-lg bg-gray-800/40">
          <p className="text-xs text-gray-500 italic">This message was deleted</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1 group`}>
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'} relative`}>
        
        {/* Attachment Display */}
        {message.attachment_url && (
          <div className="mb-1">
            {message.attachment_type === 'image' ? (
              // Image Attachment
              <div
                className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setImagePreview(true)}
              >
                <Image
                  src={message.attachment_url}
                  alt="Image attachment"
                  width={300}
                  height={300}
                  className="rounded-lg max-h-64 object-cover"
                  unoptimized
                />
              </div>
            ) : (
              // File Attachment (PDF, Document, etc.)
              <a
                href={message.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  isOwn 
                    ? 'bg-blue-500/20 hover:bg-blue-500/30' 
                    : 'bg-[#1a1a1a] hover:bg-[#252525]'
                }`}
              >
                <div className={`p-2 rounded-lg ${isOwn ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">
                    {message.attachment_name || 'File'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(message.attachment_size || 0)}
                  </p>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </a>
            )}
          </div>
        )}

        {/* Message Content */}
        {message.content && (
          <div
            className={`rounded-lg px-3 py-2 ${
              isOwn 
                ? 'bg-blue-500 text-white' 
                : 'bg-[#1a1a1a] text-white'
            }`}
          >
            <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {/* Message Footer (Time & Status) */}
        <div
          className={`flex items-center gap-1 mt-0.5 px-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.created_at)}
          </span>
          
          {/* Read Receipts (Only for own messages) */}
          {isOwn && (
            <>
              {status === 'read' && (
                <CheckCheck className="w-3 h-3 text-blue-400" />
              )}
              {status === 'delivered' && (
                <CheckCheck className="w-3 h-3 text-gray-400" />
              )}
              {status === 'sending' && (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </>
          )}
        </div>

        {/* Delete Button (Only for own messages) */}
        {isOwn && (
          <button
            onClick={() => {
              if (confirm('Delete this message?')) {
                onDelete(message.id);
              }
            }}
            className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all"
            title="Delete message"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        )}

        {/* Image Preview Modal */}
        {imagePreview && message.attachment_url && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setImagePreview(false)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <Image
                src={message.attachment_url}
                alt="Preview"
                width={1200}
                height={1200}
                className="max-h-[90vh] object-contain"
                unoptimized
              />
              <button
                onClick={() => setImagePreview(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Download Button */}
              <a
                href={message.attachment_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white text-sm font-medium flex items-center gap-2 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}