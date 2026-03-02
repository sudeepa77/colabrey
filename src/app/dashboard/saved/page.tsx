//app/src/dashboard/saved/page.tsx  
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    Bookmark,
    Heart,
    Share2,
    MessageSquare,
    Search,
    LayoutList,
    LayoutGrid,
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

type Profile = {
    full_name: string | null;
    avatar_url: string | null;
    major: string | null;
};

type Thought = {
    id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    user_id: string;
    likes_count: number;
    comments_count?: number;
    shares_count?: number;
    profiles: Profile;
    saved_at?: string;
};

export default function SavedPage() {
    const [savedThoughts, setSavedThoughts] = useState<Thought[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const supabase = createClient();

    useEffect(() => {
        const fetchSaved = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Get Saved IDs with created_at (saved time)
            const { data: savedData, error: savedError } = await supabase
                .from('saved_thoughts')
                .select('thought_id, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (savedError || !savedData || savedData.length === 0) {
                setLoading(false);
                return;
            }

            const savedMap = new Map(savedData.map(item => [item.thought_id, item.created_at]));
            const thoughtIds = savedData.map(item => item.thought_id);

            // 2. Fetch Thoughts
            const { data: thoughtsData, error: thoughtsError } = await supabase
                .from('thoughts')
                .select('*, comments(count), likes(count)')
                .in('id', thoughtIds);

            if (thoughtsError) {
                console.error(thoughtsError);
                setLoading(false);
                return;
            }

            // 3. Fetch Profiles
            const userIds = Array.from(new Set(thoughtsData?.map(t => t.user_id) || []));
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, major')
                .in('id', userIds);

            const profilesMap = new Map(profilesData?.map(p => [p.id, p]));

            const formatted = thoughtsData?.map(t => ({
                ...t,
                profiles: profilesMap.get(t.user_id) || { full_name: 'Unknown', avatar_url: null, major: '' },
                comments_count: t.comments?.[0]?.count || 0,
                shares_count: t.shares_count || 0,
                likes_count: t.likes?.[0]?.count || 0,
                saved_at: savedMap.get(t.id)
            }));

            // Sort by saved time (descending)
            formatted.sort((a, b) => new Date(b.saved_at!).getTime() - new Date(a.saved_at!).getTime());

            setSavedThoughts(formatted as Thought[]);
            setLoading(false);
        };

        fetchSaved();
    }, []);

    const filteredThoughts = savedThoughts.filter(t =>
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.profiles.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTimeAgo = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Saved just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `Saved ${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Saved ${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Saved yesterday';
        if (diffInDays < 7) return `Saved ${diffInDays}d ago`;
        return `Saved on ${date.toLocaleDateString()}`;
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-20 transition-all duration-300 p-8">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                                <Bookmark className="w-8 h-8 fill-blue-500 text-blue-500" />
                                Saved Posts
                            </h1>
                            <p className="text-gray-400 mt-1 pl-11">{savedThoughts.length} posts saved</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700 transition-colors">
                                <LayoutList className="w-5 h-5" />
                            </button>
                            <button className="p-2 bg-transparent rounded-lg text-gray-500 hover:text-white hover:bg-neutral-800 transition-colors">
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search saved posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-500 animate-pulse">Loading saved posts...</div>
                    ) : filteredThoughts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800">
                                <Bookmark className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No saved posts</h3>
                            <p className="text-gray-500">Posts you save will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredThoughts.map((thought) => (
                                <motion.div
                                    key={thought.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors group relative"
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            {thought.profiles?.avatar_url ? (
                                                <img src={thought.profiles.avatar_url} className="w-12 h-12 rounded-full object-cover border border-neutral-800" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-gray-400 font-bold border border-neutral-700 text-lg">
                                                    {thought.profiles?.full_name?.[0] || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-white text-base">
                                                    {thought.profiles?.full_name || 'Anonymous'}
                                                    <span className="text-gray-500 font-normal ml-2 text-sm">• {thought.profiles?.major || 'Student'}</span>
                                                </h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 inline-block mr-1"></span>
                                                    {formatTimeAgo(thought.saved_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/dashboard/post?id=${thought.id}`}
                                            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View
                                        </Link>
                                    </div>

                                    {/* Content (Truncated if too long?) */}
                                    <p className="text-gray-200 text-sm leading-relaxed mb-4 pl-16">
                                        {thought.content.length > 200 ? thought.content.substring(0, 200) + '...' : thought.content}
                                    </p>

                                    {thought.image_url && (
                                        <div className="mb-4 pl-16">
                                            <div className="rounded-xl overflow-hidden border border-neutral-800 max-w-md">
                                                <img src={thought.image_url} alt="Post" className="w-full h-48 object-cover" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer Stats */}
                                    <div className="flex items-center gap-6 pl-16 pt-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Heart className="w-4 h-4" />
                                            <span>{thought.likes_count} likes</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>{thought.comments_count || 0} comments</span>
                                        </div>
                                    </div>

                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
