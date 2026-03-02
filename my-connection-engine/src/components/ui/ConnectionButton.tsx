// src/components/ui/ConnectionButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Clock, Loader2 } from 'lucide-react';
import { 
  sendConnectionRequest, 
  getConnectionStatus 
} from '@/lib/connections/api';
import { ConnectionStatus } from '@/types/connections';
import { toast } from 'sonner';

interface ConnectionButtonProps {
  userId: string;
  className?: string;
}

export default function ConnectionButton({ userId, className = '' }: ConnectionButtonProps) {
  const [status, setStatus] = useState<ConnectionStatus>('none');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadStatus();
  }, [userId]);

  async function loadStatus() {
    setLoading(true);
    const connectionStatus = await getConnectionStatus(userId);
    setStatus(connectionStatus);
    setLoading(false);
  }

  async function handleConnect() {
    setProcessing(true);
    
    const result = await sendConnectionRequest(userId);
    
    if (result.success) {
      setStatus('pending_sent');
      toast.success('Connection request sent!');
    } else {
      toast.error(result.error || 'Failed to send request');
    }
    
    setProcessing(false);
  }

  if (loading) {
    return (
      <button
        disabled
        className={`px-4 py-2 bg-neutral-800 text-gray-400 rounded-lg flex items-center gap-2 cursor-not-allowed ${className}`}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </button>
    );
  }

  // ✅ Connected
  if (status === 'connected') {
    return (
      <button
        disabled
        className={`px-4 py-2 bg-green-600/20 text-green-400 rounded-lg flex items-center gap-2 border border-green-600/30 cursor-default ${className}`}
      >
        <UserCheck className="w-4 h-4" />
        <span className="text-sm font-medium">Connected</span>
      </button>
    );
  }

  // ✅ Pending (sent by current user)
  if (status === 'pending_sent') {
    return (
      <button
        disabled
        className={`px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg flex items-center gap-2 border border-yellow-600/30 cursor-default ${className}`}
      >
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Requested</span>
      </button>
    );
  }

  // ✅ Pending (received - respond in notifications)
  if (status === 'pending_received') {
    return (
      <button
        disabled
        className={`px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg flex items-center gap-2 border border-blue-600/30 cursor-default ${className}`}
      >
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Respond in Notifications</span>
      </button>
    );
  }

  // ✅ No connection - can send request
  return (
    <button
      onClick={handleConnect}
      disabled={processing}
      className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 ${className}`}
    >
      {processing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {processing ? 'Sending...' : 'Connect'}
      </span>
    </button>
  );
}