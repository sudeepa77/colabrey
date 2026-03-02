//app/src/dashboard/post/page.tsx   
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';
import {
    Home,
    Users,
    MessageSquare,
    Bell,
    FileText,
    Bookmark,
    TrendingUp,
    Settings,
    LogOut,
    ImageIcon,
    Plus,
    Heart,
    Share2,
    Trash2,
    LayoutGrid,
    PlusSquare,
    User,
    X,
    Megaphone,
    Send,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

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
    comments_count?: number; // fetched via join or count
    shares_count?: number;
    profiles: Profile;
    has_liked?: boolean; // fetched status
};

type Comment = {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: Profile;
};

export default function PostPage() {
    const [thoughts, setThoughts] = useState<Thought[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());

    // Modal State
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Comment State
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    const searchParams = useSearchParams();

    const supabase = createClient();
        
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setUserProfile(profile);
            }
            fetchThoughts();
        };
        init();
        init();

        // Check for URL param to auto-expand
        const focusId = searchParams.get('id');
        if (focusId) {
            setExpandedPostId(focusId);
            fetchComments(focusId);
            // Optional: Scroll to element logic could go here
        }
    }, [searchParams]);

    const fetchComments = async (thoughtId: string) => {
        setLoadingComments(true);
        const { data: commentsData, error } = await supabase
            .from('comments')
            .select('*')
            .eq('thought_id', thoughtId)
            .order('created_at', { ascending: true });

        if (!error && commentsData) {
            // Fetch profiles manually
            const userIds = Array.from(new Set(commentsData.map(c => c.user_id)));
            let profilesMap = new Map();

            if (userIds.length > 0) {
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, major')
                    .in('id', userIds);
                if (profilesData) {
                    profilesMap = new Map(profilesData.map(p => [p.id, p]));
                }
            }

            const formatted = commentsData.map((c: any) => ({
                ...c,
                profiles: profilesMap.get(c.user_id) || { full_name: 'Unknown', avatar_url: null, major: '' }
            }));
            setCommentsMap(prev => ({ ...prev, [thoughtId]: formatted }));
        }
        setLoadingComments(false);
    };

    const handleToggleComments = (thoughtId: string) => {
        if (expandedPostId === thoughtId) {
            setExpandedPostId(null);
        } else {
            setExpandedPostId(thoughtId);
            if (!commentsMap[thoughtId]) {
                fetchComments(thoughtId);
            }
        }
    };

    const handleSendComment = async (thoughtId: string) => {
        if (!commentText.trim() || !currentUser) return;

        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    thought_id: thoughtId,
                    user_id: currentUser.id,
                    content: commentText
                });

            if (error) throw error;

            setCommentText('');
            // Refresh comments
            await fetchComments(thoughtId);
            // Refresh post list (to update count)
            fetchThoughts();

        } catch (err) {
            console.error('Error sending comment:', err);
            alert('Failed to send comment');
        }
    };

    const fetchThoughts = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Fetch thoughts with counts
            // We use comments(count) to get the number of comments
            const { data: thoughtsData, error } = await supabase
                .from('thoughts')
                .select('*, comments(count), likes(count)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch profiles
            const userIds = Array.from(new Set(thoughtsData?.map(t => t.user_id) || []));
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, major')
                .in('id', userIds);

            // Fetch current user's likes AND saved thoughts to show state
            let myLikesSet = new Set<string>();
            let mySavedSet = new Set<string>();
            if (user) {
                const { data: myLikes } = await supabase
                    .from('likes')
                    .select('thought_id')
                    .eq('user_id', user.id);

                if (myLikes) {
                    myLikes.map(l => l.thought_id).forEach(id => myLikesSet.add(id));
                }

                const { data: mySaved } = await supabase
                    .from('saved_thoughts')
                    .select('thought_id')
                    .eq('user_id', user.id);

                if (mySaved) {
                    mySaved.forEach(s => mySavedSet.add(s.thought_id));
                }
            }

            setSavedPostIds(mySavedSet);

            const profilesMap = new Map(profilesData?.map(p => [p.id, p]));

            const formatted = thoughtsData?.map(t => ({
                ...t,
                profiles: profilesMap.get(t.user_id) || { full_name: 'Unknown', avatar_url: null, major: '' },
                has_liked: myLikesSet.has(t.id),
                comments_count: t.comments?.[0]?.count || 0,
                // shares_count is already in 't' if it exists in DB, otherwise undefined (defaults to 0 in UI)
                likes_count: t.likes?.[0]?.count || 0
            }));

            setThoughts(formatted as Thought[]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (thoughtId: string, currentLiked: boolean) => {
        if (!currentUser) return;

        // Optimistic Update
        setThoughts(prev => prev.map(t => {
            if (t.id === thoughtId) {
                return {
                    ...t,
                    has_liked: !currentLiked,
                    likes_count: currentLiked ? Math.max(0, t.likes_count - 1) : t.likes_count + 1
                };
            }
            return t;
        }));

        try {
            if (currentLiked) {
                // Unlike
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('thought_id', thoughtId)
                    .eq('user_id', currentUser.id);
                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase
                    .from('likes')
                    .insert({ thought_id: thoughtId, user_id: currentUser.id });
                if (error) throw error;
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert on error (optional, skipping for simplicity)
            fetchThoughts();
        }
    };
       

    const handleSave = async (thoughtId: string) => {
        if (!currentUser) return;
        const isSaved = savedPostIds.has(thoughtId);

        // Optimistic Update
        setSavedPostIds(prev => {
            const next = new Set(prev);
            if (isSaved) next.delete(thoughtId);
            else next.add(thoughtId);
            return next;
        });

        try {
            if (isSaved) {
                // Remove from saved
                await supabase
                    .from('saved_thoughts')
                    .delete()
                    .eq('thought_id', thoughtId)
                    .eq('user_id', currentUser.id);
            } else {
                // Add to saved
                await supabase
                    .from('saved_thoughts')
                    .insert({
                        thought_id: thoughtId,
                        user_id: currentUser.id
                    });
            }
        } catch (err) {
            console.error('Error toggling save:', err);
            // Revert on error
            setSavedPostIds(prev => {
                const next = new Set(prev);
                if (isSaved) next.add(thoughtId);
                else next.delete(thoughtId);
                return next;
            });
        }
    };

    const handleShare = async (thoughtId: string) => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/post/${thoughtId}`);
            toast.success('Link copied to clipboard');
        } catch (err) {
            console.error('Failed to copy', err);
            toast.error('Failed to copy link');
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePost = async () => {
        if (!content.trim() && !imageFile) return;
        if (!currentUser) return;

        setSubmitting(true);
        try {
            let imageUrl = null;

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('thought-images')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('thought-images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            }

            const { error: insertError } = await supabase
                .from('thoughts')
                .insert({
                    user_id: currentUser.id,
                    content,
                    image_url: imageUrl,
                });

            if (insertError) throw insertError;

            // Reset and Close
            setContent('');
            setImageFile(null);
            setImagePreview(null);
            setIsPostModalOpen(false);
            fetchThoughts(); // Refresh feed
        } catch (error) {
            console.error('Error posting:', error);
            alert('Failed to post. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar />

            {/* Main Content */}
            <main className="pl-24 p-6 md:p-10 relative transition-all duration-300">
                {/* Modal Backdrop & Content */}
                <AnimatePresence>
                    {isPostModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:pl-64 bg-black/40 backdrop-blur-sm"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) setIsPostModalOpen(false);
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl relative"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsPostModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {userProfile?.avatar_url ? (
                                            <img src={userProfile.avatar_url} alt="User" className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-base border border-blue-500">
                                                {(userProfile?.full_name?.[0] || 'U').toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        {/* Header Info */}
                                        <div className="flex flex-col mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-sm">
                                                    {userProfile?.full_name || 'User'}
                                                </span>
                                                <span className="text-gray-500 text-xs">• {userProfile?.major || 'Student'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-neutral-800 w-fit px-2 py-0.5 rounded-md mt-1 border border-neutral-700">
                                                <Megaphone className="w-3 h-3 text-gray-400" />
                                                <span className="text-[10px] text-gray-300 font-medium">Post</span>
                                            </div>
                                        </div>

                                        {/* Textarea */}
                                        <div className="relative mb-2">
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="What's on your mind?..."
                                                maxLength={500}
                                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none h-24 p-0 text-sm leading-relaxed"
                                            />
                                            <div className="absolute bottom-0 right-0 text-[10px] text-gray-600 font-medium">
                                                {content.length}/500
                                            </div>
                                        </div>

                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <div className="relative mb-4 group">
                                                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-xl border border-neutral-700" />
                                                <button
                                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}

                                        <div className="h-px bg-neutral-800 mb-3" />

                                        {/* Footer Actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200 transition-colors"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Image</span>
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageSelect}
                                                />
                                            </div>

                                            <button
                                                onClick={handlePost}
                                                disabled={(!content.trim() && !imageFile) || submitting}
                                                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {submitting ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <Send className="w-3 h-3" />
                                                        <span>Post</span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Compact Creation Bar (Trigger) */}
                    <div
                        onClick={() => setIsPostModalOpen(true)}
                        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 cursor-pointer hover:border-neutral-700 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold border border-blue-900/50">
                                {(userProfile?.full_name?.[0] || 'U').toUpperCase()}
                            </div>
                            <div className="flex-1 relative">
                                <div className="w-full bg-neutral-800/50 border border-neutral-700 rounded-full py-2.5 px-4 text-gray-400 text-sm">
                                    What's on your mind, {userProfile?.full_name?.split(' ')[0] || 'User'}?
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-6 px-14">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                                <ImageIcon className="w-4 h-4" />
                                <span>Image</span>
                            </div>
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="space-y-4">
                        {loading && (
                            <div className="p-8 text-center text-gray-500">Loading network activity...</div>
                        )}

                        {!loading && thoughts.map((thought) => (
                            <motion.div
                                key={thought.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        {thought.profiles?.avatar_url ? (
                                            <img src={thought.profiles.avatar_url} className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-gray-400 font-bold border border-neutral-700">
                                                {thought.profiles?.full_name?.[0] || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{thought.profiles?.full_name || 'Anonymous'}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <span>{thought.profiles?.major || 'Student'}</span>
                                                <span>•</span>
                                                <span className="opacity-75">2h ago</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-200 text-sm leading-relaxed mb-4">
                                    {thought.content}
                                </p>

                                {thought.image_url && (
                                    <div className="mb-4 rounded-xl overflow-hidden border border-neutral-800">
                                        <img src={thought.image_url} alt="Post" className="w-full object-cover max-h-96" />
                                    </div>
                                )}

                                {/* Stats Row */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mt-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <div className="bg-blue-500/10 p-1 rounded-full">
                                            <Heart className={`w-3 h-3 ${thought.has_liked ? 'fill-pink-500 text-pink-500' : 'fill-blue-500 text-blue-500'}`} />
                                        </div>
                                        <span>{thought.likes_count}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span>{thought.comments_count || 0} comments</span>
                                        <span>{thought.shares_count || 0} shares</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-neutral-800 mb-3" />

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex flex-1 justify-between max-w-sm gap-2">
                                        <button
                                            onClick={() => handleLike(thought.id, !!thought.has_liked)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors group flex-1 justify-center ${thought.has_liked
                                                ? 'text-pink-500 bg-pink-500/10 hover:bg-pink-500/20'
                                                : 'text-gray-400 hover:bg-neutral-800'
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${thought.has_liked ? 'fill-pink-500' : 'group-hover:text-pink-500'}`} />
                                            <span className={`font-medium ${thought.has_liked ? '' : 'group-hover:text-pink-500'}`}>
                                                {thought.has_liked ? 'Liked' : 'Like'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleToggleComments(thought.id)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors group flex-1 justify-center ${expandedPostId === thought.id
                                                ? 'text-blue-500 bg-blue-500/10'
                                                : 'text-gray-400 hover:bg-neutral-800'
                                                }`}
                                        >
                                            <MessageSquare className={`w-5 h-5 ${expandedPostId === thought.id ? 'fill-blue-500' : 'group-hover:text-blue-500'}`} />
                                            <span className={`font-medium ${expandedPostId === thought.id ? '' : 'group-hover:text-blue-500'}`}>Comment</span>
                                        </button>
                                        <button
                                            onClick={() => handleShare(thought.id)}
                                            className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:bg-neutral-800 rounded-lg transition-colors group flex-1 justify-center"
                                        >
                                            <Share2 className="w-5 h-5 group-hover:text-green-500" />
                                            <span className="font-medium group-hover:text-green-500">Share</span>
                                        </button>
                                    </div>
                                    {/* Bookmark */}
                                    <button
                                        onClick={() => handleSave(thought.id)}
                                        className="text-gray-400 hover:text-yellow-500 p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                                    >
                                        <Bookmark className={`w-5 h-5 ${savedPostIds.has(thought.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                    </button>
                                </div>

                                {/* Comments Section */}
                                <AnimatePresence>
                                    {expandedPostId === thought.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 mt-4 border-t border-neutral-800 space-y-4">

                                                {/* Comment List */}
                                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                    {loadingComments && !commentsMap[thought.id] ? (
                                                        <div className="text-center text-xs text-gray-500 py-2">Loading discussion...</div>
                                                    ) : (commentsMap[thought.id]?.length || 0) === 0 ? (
                                                        <div className="text-center text-gray-500 py-4 text-sm bg-neutral-800/30 rounded-lg">
                                                            👋 Be the first to comment!
                                                        </div>
                                                    ) : (
                                                        commentsMap[thought.id]?.map(comment => (
                                                            <div key={comment.id} className="flex gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-neutral-800 flex-shrink-0 flex items-center justify-center text-xs font-bold border border-neutral-700">
                                                                    {comment.profiles?.avatar_url ? (
                                                                        <img src={comment.profiles.avatar_url} className="w-full h-full rounded-full object-cover" />
                                                                    ) : (
                                                                        (comment.profiles?.full_name?.[0] || 'U').toUpperCase()
                                                                    )}
                                                                </div>
                                                                <div className="bg-neutral-800/50 rounded-2xl rounded-tl-none px-4 py-2 flex-1 border border-neutral-800">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-xs font-bold text-gray-300">
                                                                            {comment.profiles?.full_name || 'Anonymous'}
                                                                        </span>
                                                                        <span className="text-[10px] text-gray-600">
                                                                            {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-300 leading-relaxed">
                                                                        {comment.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                {/* Input Area */}
                                                <div className="flex items-center gap-3 pt-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-900/30">
                                                        {(userProfile?.full_name?.[0] || 'U').toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 relative">
                                                        <input
                                                            type="text"
                                                            value={commentText}
                                                            onChange={(e) => setCommentText(e.target.value)}
                                                            placeholder="Write a comment..."
                                                            className="w-full bg-neutral-800 border-none rounded-full py-2 px-4 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-600 pr-10"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSendComment(thought.id)}
                                                        />
                                                        <button
                                                            onClick={() => handleSendComment(thought.id)}
                                                            className="absolute right-1 top-1 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors"
                                                        >
                                                            <Send className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                </div >
            </main >
        </div >
    );
}
