// src/app/dashboard/connections/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, Users, MessageSquare, UserX, Handshake } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import SearchBar from '../search/components/SearchBar';

interface Connection {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  major: string | null;
  bio: string | null;
}

 
  export default function MyConnectionsPage() {
   const router = useRouter();
  const supabase = createClient();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConnections();
  }, []);

  async function loadConnections() {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Fetch all ACCEPTED connection requests
      const { data: connectionRequests, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('status', 'accepted')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) throw error;

      // Extract the "other user" IDs
      const otherUserIds = connectionRequests?.map(conn => 
        conn.sender_id === user.id ? conn.receiver_id : conn.sender_id
      ) || [];

      if (otherUserIds.length === 0) {
        setConnections([]);
        setLoading(false);
        return;
      }

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, major, bio')
        .in('id', otherUserIds)
        .order('full_name', { ascending: true });

      if (profilesError) throw profilesError;

      setConnections(profiles || []);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  }

  const filteredConnections = connections.filter(conn =>
    conn.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">My Connections</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {connections.length > 0 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-neutral-800">
              <Handshake className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No connections yet</h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              Start connecting with people to build your network!
            </p>
            <Link
              href="/dashboard/search"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Find People
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConnections.map((connection) => {
              const initials = connection.full_name
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U';

              return (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Link href={`/dashboard/profile/${connection.id}`}>
                      {connection.avatar_url ? (
                        <img
                          src={connection.avatar_url}
                          alt={connection.full_name || 'User'}
                          className="w-16 h-16 rounded-full object-cover border-2 border-neutral-800 group-hover:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-neutral-700 group-hover:border-blue-500 flex items-center justify-center text-white text-xl font-bold transition-colors">
                          {initials}
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/profile/${connection.id}`}>
                        <h3 className="text-lg font-bold text-white truncate hover:text-blue-400 transition-colors">
                          {connection.full_name || 'Anonymous User'}
                        </h3>
                      </Link>
                      {connection.major && (
                        <p className="text-sm text-gray-400 mb-2">
                          {connection.major}
                        </p>
                      )}
                      {connection.bio && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {connection.bio}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <Link
                          href={`/dashboard/profile/${connection.id}`}
                          className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                        >
                          View Profile
                        </Link>
                        <Link
                          href={`/dashboard/messages?user=${connection.id}`}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No search results */}
        {!loading && filteredConnections.length === 0 && connections.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No connections found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
}