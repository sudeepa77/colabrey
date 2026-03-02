// src/dashboard/components/ProfileStatsCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { X, Users as UsersIcon, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileUpdateManager } from '@/lib/profileUpdateManager';
import { subscribeToNotifications } from '@/lib/notifications/api';
import Link from 'next/link';

type Profile = {
    id?: string;
    full_name: string | null;
    avatar_url: string | null;
    major: string | null;
    bio?: string | null;
};

interface ProfileStatsCardProps {
    user: User | null;
    profile: Profile | null;
}
export default function ProfileStatsCard({ user, profile: initialProfile }: ProfileStatsCardProps) {

    const [postsCount, setPostsCount] = useState(0);
    const [connectionsCount, setConnectionsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showConnectionsModal, setShowConnectionsModal] = useState(false);
    const [connections, setConnections] = useState<Profile[]>([]);
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [loadingConnections, setLoadingConnections] = useState(false);

    const supabase = createClient();

    // Fetch fresh profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            const { data } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, major, bio')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
            }
        };

        fetchProfile();

        // Refresh profile when window regains focus
        const handleFocus = () => {
            fetchProfile();
        };

        window.addEventListener('focus', handleFocus);

        // Subscribe to profile updates
        const unsubscribe = profileUpdateManager.subscribe(fetchProfile);

        return () => {
            window.removeEventListener('focus', handleFocus);
            unsubscribe();
        };
    }, [user]);

    // Fetch stats and subscribe to connection updates
    useEffect(() => {
        if (!user) return;

        fetchStats();

        // ✅ Subscribe to connection accepted notifications for auto-update
        const unsubscribe = subscribeToNotifications(user.id, async (notification) => {
            if (notification.type === 'connection_accepted') {
                // Refresh stats when connection is accepted
                await fetchStats();
            }
        });

        return unsubscribe;
    }, [user]);

    const fetchStats = async () => {
        if (!user) return;

        try {
            // Fetch posts count
            const { count: posts } = await supabase
                .from('thoughts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            // ✅ Fetch ACCEPTED connections count (both directions)
            const { count: connections } = await supabase
                .from('connection_requests')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'accepted')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

            setPostsCount(posts || 0);
            setConnectionsCount(connections || 0);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectionsClick = async () => {
        setShowConnectionsModal(true);
        await fetchConnections();
    };

    const fetchConnections = async () => {
        if (!user) return;

        try {
            setLoadingConnections(true);

            // ✅ Fetch all ACCEPTED connection requests
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
                setLoadingConnections(false);
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
            console.error('Error fetching connections:', error);
        } finally {
            setLoadingConnections(false);
        }
    };

    const handlePostsClick = () => {
        const activitySection = document.getElementById('activity-section');
        if (activitySection) {
            activitySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (!user || !profile) return null;

    const initial = profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <Link href={`/dashboard/profile/${user.id}`}>
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name || 'User'}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 hover:border-blue-400 transition-colors cursor-pointer"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-blue-900/30 border-2 border-blue-500 flex items-center justify-center font-bold text-white text-xl hover:border-blue-400 transition-colors cursor-pointer">
                                    {initial}
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                        <Link href={`/dashboard/profile/${user.id}`}>
                            <h3 className="font-bold text-white text-lg hover:text-blue-400 transition-colors cursor-pointer">
                                {profile?.full_name || user.email?.split('@')[0] || 'User'}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-400">
                            {profile?.major || 'Student'}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-neutral-800">
                    {/* Connections - Opens Modal */}
                    <button
                        onClick={handleConnectionsClick}
                        className="flex flex-col hover:bg-neutral-800 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <span className="text-xl font-bold text-white">
                            {loading ? '...' : connectionsCount}
                        </span>
                        <span className="text-xs text-gray-500">connections</span>
                    </button>

                    {/* Posts - Scrolls to Activity */}
                    <button
                        onClick={handlePostsClick}
                        className="flex flex-col hover:bg-neutral-800 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <span className="text-xl font-bold text-white">
                            {loading ? '...' : postsCount}
                        </span>
                        <span className="text-xs text-gray-500">posts</span>
                    </button>
                </div>
            </div>

            {/* Connections Modal */}
            <AnimatePresence>
                {showConnectionsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowConnectionsModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {profile?.full_name?.split(' ')[0] || 'Your'}'s Connections
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowConnectionsModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Connections List */}
                            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
                                {loadingConnections ? (
                                    <div className="flex justify-center items-center py-12">
                                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                    </div>
                                ) : connections.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium mb-2">No connections yet</p>
                                        <p className="text-sm">
                                            Start connecting with people to build your network!
                                        </p>
                                        <Link
                                            href="/dashboard/search"
                                            onClick={() => setShowConnectionsModal(false)}
                                            className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Find People
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {connections.map((connection) => {
                                            const initials = connection.full_name
                                                ?.split(' ')
                                                .map(n => n[0])
                                                .join('')
                                                .toUpperCase()
                                                .slice(0, 2) || 'U';

                                            return (
                                                <div
                                                    key={connection.id}
                                                    className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {/* Avatar */}
                                                        <Link 
                                                            href={`/dashboard/profile/${connection.id}`}
                                                            onClick={() => setShowConnectionsModal(false)}
                                                        >
                                                            {connection.avatar_url ? (
                                                                <img
                                                                    src={connection.avatar_url}
                                                                    alt={connection.full_name || 'User'}
                                                                    className="w-12 h-12 rounded-full object-cover border-2 border-neutral-700 hover:border-blue-500 transition-colors"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-full bg-neutral-700 border-2 border-neutral-600 hover:border-blue-500 flex items-center justify-center font-bold text-white transition-colors">
                                                                    {initials}
                                                                </div>
                                                            )}
                                                        </Link>

                                                        {/* Info */}
                                                        <div className="min-w-0">
                                                            <Link 
                                                                href={`/dashboard/profile/${connection.id}`}
                                                                onClick={() => setShowConnectionsModal(false)}
                                                            >
                                                                <h4 className="font-bold text-white hover:text-blue-400 transition-colors">
                                                                    {connection.full_name || 'Anonymous User'}
                                                                </h4>
                                                            </Link>
                                                            <p className="text-sm text-gray-400 line-clamp-1">
                                                                {connection.major || connection.bio || 'Student'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={`/dashboard/profile/${connection.id}`}
                                                            onClick={() => setShowConnectionsModal(false)}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={`/dashboard/messages?user=${connection.id}`}
                                                            onClick={() => setShowConnectionsModal(false)}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            Message
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {connections.length > 0 && (
                                <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
                                    <Link
                                        href="/dashboard/connections"
                                        onClick={() => setShowConnectionsModal(false)}
                                        className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        View All Connections
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}