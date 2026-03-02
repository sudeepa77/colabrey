 //app/src/dashboard/components/MyActivity.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
    profiles: Profile;
};

export default function MyActivity({ user }: { user: any }) {
    const [thoughts, setThoughts] = useState<Thought[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!user) return;

        const fetchMyThoughts = async () => {
            const { data: thoughtsData, error } = await supabase
                .from('thoughts')
                .select('*, comments(count), likes(count)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            // Fetch profile for self (optimization: could pass from parent, but this ensures fresh data)
            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, major')
                .eq('id', user.id)
                .single();

            const formatted = thoughtsData.map(t => ({
                ...t,
                profiles: profileData || { full_name: 'Me', avatar_url: null, major: '' },
                comments_count: t.comments?.[0]?.count || 0,
                likes_count: t.likes?.[0]?.count || 0
            }));

            setThoughts(formatted as Thought[]);
            setLoading(false);
        };

        fetchMyThoughts();
    }, [user]);

    if (!loading && thoughts.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-white font-display">Your Activity</h2>
                <Link href="/dashboard/profile" className="text-sm text-blue-500 hover:text-blue-400 font-medium">
                    View all
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    // Skeleton loading
                    [1, 2].map(i => (
                        <div key={i} className="bg-neutral-900 rounded-2xl p-4 h-48 animate-pulse border border-neutral-800" />
                    ))
                ) : (
                    thoughts.map((thought) => (
                        <motion.div
                            key={thought.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    {thought.profiles?.avatar_url ? (
                                        <img src={thought.profiles.avatar_url} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-900/50">
                                            {(thought.profiles?.full_name?.[0] || 'U').toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-white text-sm">You</h4>
                                        <p className="text-[10px] text-gray-500">
                                            Posted recently
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                {thought.content}
                            </p>

                            {thought.image_url && (
                                <div className="mb-4 rounded-xl overflow-hidden border border-neutral-800 h-32 relative">
                                    <img
                                        src={thought.image_url}
                                        alt="Post"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-3 border-t border-neutral-800/50">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                    <Heart className="w-3.5 h-3.5" />
                                    <span>{thought.likes_count}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>{thought.comments_count || 0} comments</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
