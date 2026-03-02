// src/app/dashboard/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Check, X, UserPlus, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  subscribeToNotifications
} from '@/lib/notifications/api';
import {
  acceptConnectionRequest,
  rejectConnectionRequest
} from '@/lib/connections/api';
import { Notification } from '@/types/connections';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    initializePage();
  }, []);

  async function initializePage() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);
      await loadNotifications();

      // Subscribe to realtime updates
      const unsubscribe = subscribeToNotifications(user.id, (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        
        toast.info(newNotification.title, {
          description: newNotification.message,
        });
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      setLoading(false);
    }
  }

  async function loadNotifications() {
    setLoading(true);
    const data = await getNotifications(50);
    setNotifications(data);
    setLoading(false);
  }

  async function handleMarkRead(notificationId: string) {
    await markNotificationRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  }

  async function handleAcceptConnection(notificationId: string, requestId: string) {
    setProcessingIds(prev => new Set(prev).add(notificationId));
    
    const result = await acceptConnectionRequest(requestId);
    
    if (result.success) {
      toast.success('Connection accepted!');
      await handleMarkRead(notificationId);
      await loadNotifications();
    } else {
      toast.error(result.error || 'Failed to accept connection');
    }
    
    setProcessingIds(prev => {
      const next = new Set(prev);
      next.delete(notificationId);
      return next;
    });
  }

  async function handleRejectConnection(notificationId: string, requestId: string) {
    setProcessingIds(prev => new Set(prev).add(notificationId));
    
    const result = await rejectConnectionRequest(requestId);
    
    if (result.success) {
      toast.info('Connection request declined');
      await handleMarkRead(notificationId);
      await loadNotifications();
    } else {
      toast.error(result.error || 'Failed to decline connection');
    }
    
    setProcessingIds(prev => {
      const next = new Set(prev);
      next.delete(notificationId);
      return next;
    });
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
      case 'connection_accepted':
        return <UserPlus className="w-5 h-5" />;
      case 'post_like':
        return <Heart className="w-5 h-5" />;
      case 'post_comment':
      case 'new_message':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <UserPlus className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'connection_request':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'connection_accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'post_like':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'post_comment':
      case 'new_message':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const todayNotifications = notifications.filter(n => {
    const notifDate = new Date(n.created_at);
    const today = new Date();
    return notifDate.toDateString() === today.toDateString();
  });

  const earlierNotifications = notifications.filter(n => {
    const notifDate = new Date(n.created_at);
    const today = new Date();
    return notifDate.toDateString() !== today.toDateString();
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-500 hover:text-blue-400 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-neutral-800">
              <UserPlus className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No notifications yet</h3>
            <p className="text-gray-500 text-center max-w-sm">
              When someone connects with you or interacts with your posts, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="pb-20">
            {/* Today Section */}
            {todayNotifications.length > 0 && (
              <div className="mb-6">
                <div className="px-4 py-3 bg-neutral-900/50">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Today
                  </h2>
                </div>
                <div className="divide-y divide-neutral-800">
                  {todayNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={handleMarkRead}
                      onAccept={handleAcceptConnection}
                      onReject={handleRejectConnection}
                      processing={processingIds.has(notification.id)}
                      getIcon={getNotificationIcon}
                      getColor={getNotificationColor}
                      formatTime={formatTimeAgo}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Earlier Section */}
            {earlierNotifications.length > 0 && (
              <div>
                <div className="px-4 py-3 bg-neutral-900/50">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    This Month
                  </h2>
                </div>
                <div className="divide-y divide-neutral-800">
                  {earlierNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={handleMarkRead}
                      onAccept={handleAcceptConnection}
                      onReject={handleRejectConnection}
                      processing={processingIds.has(notification.id)}
                      getIcon={getNotificationIcon}
                      getColor={getNotificationColor}
                      formatTime={formatTimeAgo}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Notification Item Component
function NotificationItem({
  notification,
  onMarkRead,
  onAccept,
  onReject,
  processing,
  getIcon,
  getColor,
  formatTime
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-4 py-4 hover:bg-neutral-900/50 transition-colors ${
        !notification.read ? 'bg-blue-500/5' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${getColor(notification.type)}`}>
            {getIcon(notification.type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-medium text-white">
              {notification.title}
            </p>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
            )}
          </div>

          <p className="text-sm text-gray-400 mb-2">
            {notification.message}
          </p>

          {/* Connection Request Actions */}
          {notification.type === 'connection_request' && !notification.read && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onAccept(notification.id, notification.data.request_id)}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm
                  </>
                )}
              </button>
              <button
                onClick={() => onReject(notification.id, notification.data.request_id)}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          )}

          {/* View Profile Link */}
          {notification.link && (
            <Link
              href={notification.link}
              onClick={() => onMarkRead(notification.id)}
              className="text-xs text-blue-500 hover:text-blue-400 inline-block mt-2"
            >
              View Profile →
            </Link>
          )}

          <p className="text-xs text-gray-600 mt-2">
            {formatTime(notification.created_at)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}