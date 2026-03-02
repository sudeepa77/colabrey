//app/src/dashboard/post/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Heart,
    MessageSquare,
    Share2,
    Bookmark,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

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
};

export default function PublicPostPage() {
    const { id } = useParams(); // Get post ID from URL
    const router = useRouter();
    const [thought, setThought] = useState<Thought | null>(null);
    const [loading, setLoading] = useState(true);
    const [authCheckComplete, setAuthCheckComplete] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            // 1. Check Auth - Redirect if logged in
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.replace(`/dashboard/post?id=${id}`);
                return;
            }
            setAuthCheckComplete(true);

            // 2. Fetch Post Data
            if (!id) return;

            const { data: postData, error } = await supabase
                .from('thoughts')
                .select('*, comments(count), likes(count)')
                .eq('id', id)
                .single();

            if (error || !postData) {
                console.error(error);
                setLoading(false);
                return;
            }

            // 3. Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, major')
                .eq('id', postData.user_id)
                .single();

            const formatted: Thought = {
                ...postData,
                profiles: profileData || { full_name: 'Unknown', avatar_url: null, major: '' },
                comments_count: postData.comments?.[0]?.count || 0,
                likes_count: postData.likes?.[0]?.count || 0,
                shares_count: postData.shares_count || 0
            };

            setThought(formatted);
            setLoading(false);
        };

        init();
    }, [id, router]);

    const handleGuestAction = () => {
        // Encode the return URL so they come back to this post after login
        const returnUrl = encodeURIComponent(`/dashboard/post?id=${id}`);
        router.push(`/login?redirect=${returnUrl}`);
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        return new Date().toLocaleDateString(); // Simple date for public view
    };

    if (!authCheckComplete || loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!thought) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <Link href="/login" className="text-blue-500 hover:underline">Go to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <nav className="border-b border-neutral-800 p-4 sticky top-0 bg-black/80 backdrop-blur-md z-50">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                    <span className="font-bold text-xl tracking-tight">colabrey</span>
                    <div className="flex gap-4">
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 flex justify-center items-start pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Post Header */}
                    <div className="p-5 flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            {thought.profiles?.avatar_url ? (
                                <img
                                    src={thought.profiles.avatar_url}
                                    alt={thought.profiles.full_name || 'User'}
                                    className="rounded-full object-cover w-12 h-12 border border-neutral-800"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                                    <span className="text-gray-400 font-bold text-lg">
                                        {thought.profiles?.full_name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-white text-base">
                                    {thought.profiles?.full_name || 'Anonymous User'}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>{thought.profiles?.major || 'Student'}</span>
                                    <span>•</span>
                                    <span>{formatTimeAgo(thought.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-5 py-2">
                        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-base">
                            {thought.content}
                        </p>
                    </div>

                    {thought.image_url && (
                        <div className="mt-3 px-5">
                            <div className="rounded-xl overflow-hidden border border-neutral-800">
                                <img
                                    src={thought.image_url}
                                    alt="Post attachment"
                                    className="w-full h-auto object-cover max-h-[500px]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="px-5 py-4 flex items-center justify-between text-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                            <div className="bg-blue-500/10 p-1 rounded-full">
                                <Heart className="w-3 h-3 text-blue-500" />
                            </div>
                            <span>{thought.likes_count}</span>
                        </div>
                        <div className="flex gap-4">
                            <span>{thought.comments_count || 0} comments</span>
                            <span>{thought.shares_count || 0} shares</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-neutral-800 mx-5" />

                    {/* Guest Action Buttons */}
                    <div className="p-3 flex items-center justify-between">
                        <div className="flex flex-1 justify-between gap-2">
                            <button
                                onClick={handleGuestAction}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:bg-neutral-800 transition-colors group flex-1 justify-center"
                            >
                                <Heart className="w-5 h-5 group-hover:text-pink-500" />
                                <span className="font-medium group-hover:text-pink-500">Like</span>
                            </button>
                            <button
                                onClick={handleGuestAction}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:bg-neutral-800 transition-colors group flex-1 justify-center"
                            >
                                <MessageSquare className="w-5 h-5 group-hover:text-blue-500" />
                                <span className="font-medium group-hover:text-blue-500">Comment</span>
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:bg-neutral-800 transition-colors group flex-1 justify-center"
                            >
                                <Share2 className="w-5 h-5 group-hover:text-green-500" />
                                <span className="font-medium group-hover:text-green-500">Share</span>
                            </button>
                        </div>
                        <button
                            onClick={handleGuestAction}
                            className="p-3 text-gray-400 hover:bg-neutral-800 rounded-lg transition-colors hover:text-yellow-500"
                        >
                            <Bookmark className="w-5 h-5" />
                        </button>
                    </div>

                    {/* CTA Footer inside card */}
                    <div className="bg-neutral-800/50 p-4 text-center border-t border-neutral-800">
                        <p className="text-sm text-gray-400 mb-3">Join the conversation happening on Colabrey</p>
                        <Link href="/signup" className="block w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors">
                            Sign up to see more
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
