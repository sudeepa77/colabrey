// src/lib/connections/api.ts
import { createClient } from '@/lib/supabase/client';
import { ConnectionRequest, ConnectionStatus } from '@/types/connections';

const supabase = createClient();

/**
 * Send a connection request
 */
export async function sendConnectionRequest(receiverId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if request already exists
    const { data: existing } = await supabase
      .from('connection_requests')
      .select('id, status')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
      .single();

    if (existing) {
      return { success: false, error: 'Connection request already exists' };
    }

    // Create new request
    const { error } = await supabase
      .from('connection_requests')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error sending connection request:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel a connection request (sender only)
 */
export async function cancelConnectionRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('connection_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error canceling connection request:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Accept a connection request (receiver only)
 */
export async function acceptConnectionRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('connection_requests')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error accepting connection request:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reject a connection request (receiver only)
 */
export async function rejectConnectionRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('connection_requests')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting connection request:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get connection status between two users
 */
export async function getConnectionStatus(otherUserId: string): Promise<ConnectionStatus> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'none';

    const { data, error } = await supabase.rpc('get_connection_status', {
      current_user_id: user.id,
      other_user_id: otherUserId
    });

    if (error) throw error;

    return data as ConnectionStatus;
  } catch (error) {
    console.error('Error getting connection status:', error);
    return 'none';
  }
}

/**
 * Get pending connection requests (received)
 */
export async function getPendingConnectionRequests(): Promise<ConnectionRequest[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('connection_requests')
      .select(`
        *,
        sender:sender_id (
          id,
          full_name,
          avatar_url,
          major
        )
      `)
      .eq('receiver_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as ConnectionRequest[];
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
}

/**
 * Get sent connection requests
 */
export async function getSentConnectionRequests(): Promise<ConnectionRequest[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('connection_requests')
      .select(`
        *,
        receiver:receiver_id (
          id,
          full_name,
          avatar_url,
          major
        )
      `)
      .eq('sender_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false});

    if (error) throw error;

    return data as ConnectionRequest[];
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    return [];
  }
}