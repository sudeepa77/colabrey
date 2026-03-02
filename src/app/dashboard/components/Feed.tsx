//app/src/dashboard/components/Feed.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Loader2, Heart, Trash2, Share2,
  MessageSquare, Bookmark, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
type Profile = {
  full_name:  string | null;
  avatar_url: string | null;
  major:      string | null;
};

type Thought = {
  id:             string;
  content:        string;
  image_url:      string | null;
  created_at:     string;
  user_id:        string;
  likes_count:    number;
  comments_count: number;
  shares_count:   number;
  has_liked:      boolean;
  profiles:       Profile;
};

const PAGE_SIZE = 20;
const FALLBACK_PROFILE: Profile = { full_name: 'Anonymous', avatar_url: null, major: 'Student' };

// ─────────────────────────────────────────────────────────────────────────────
export default function Feed({ searchQuery = '' }: { searchQuery?: string }) {
  const [thoughts,       setThoughts]       = useState<Thought[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [loadingMore,    setLoadingMore]    = useState(false);
  const [hasMore,        setHasMore]        = useState(true);
  const [page,           setPage]           = useState(0);
  const [currentUserId,  setCurrentUserId]  = useState<string | null>(null);
  const [savedPostIds,   setSavedPostIds]   = useState<Set<string>>(new Set());
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deletingId,     setDeletingId]     = useState<string | null>(null);

  const router  = useRouter();
  // useMemo keeps the client instance stable — won't be recreated on re-render
  const supabase = useMemo(() => createClient(), []);

  // ── Mount: wait for confirmed session before any DB query ─────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) { router.push('/auth/login'); return; }
        setCurrentUserId(user.id);
        await fetchThoughts(0, false, user.id);
      } catch {
        router.push('/auth/login');
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  // Selects ONLY columns that definitely exist on every thoughts table.
  // counts come from the live likes/comments tables via separate queries
  // so they are always accurate regardless of counter columns.
  const fetchThoughts = async (pageNum: number, append: boolean, userId: string) => {
    try {
      if (append) setLoadingMore(true);
      else        setLoading(true);

      const from = pageNum * PAGE_SIZE;
      const to   = from + PAGE_SIZE - 1;

      // ── 1. Thoughts — only guaranteed columns ────────────────────────────
      const { data: rawThoughts, error: tErr } = await supabase
        .from('thoughts')
        .select('id, content, image_url, created_at, user_id')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (tErr) throw new Error(tErr.message);

      const rows = rawThoughts ?? [];
      setHasMore(rows.length === PAGE_SIZE);
      if (rows.length === 0) { if (!append) setThoughts([]); return; }

      const thoughtIds    = rows.map((t) => t.id);
      const uniqueUserIds = [...new Set(rows.map((t) => t.user_id))];

      // ── 2-6. Parallel queries ────────────────────────────────────────────
      const [profilesRes, likesCountRes, commentsCountRes, myLikesRes, mySavedRes] =
        await Promise.all([
          // author profiles
          supabase.from('profiles')
            .select('id, full_name, avatar_url, major')
            .in('id', uniqueUserIds),

          // total likes per thought
          supabase.from('likes')
            .select('thought_id')
            .in('thought_id', thoughtIds),

          // total comments per thought
          supabase.from('comments')
            .select('thought_id')
            .eq('is_deleted', false)
            .in('thought_id', thoughtIds),

          // did current user like each thought
          supabase.from('likes')
            .select('thought_id')
            .eq('user_id', userId)
            .in('thought_id', thoughtIds),

          // did current user save each thought
          supabase.from('saved_thoughts')
            .select('thought_id')
            .eq('user_id', userId)
            .in('thought_id', thoughtIds),
        ]);

      // Build lookup maps
      const profileMap = new Map<string, Profile>(
        (profilesRes.data ?? []).map((p) => [p.id, { full_name: p.full_name, avatar_url: p.avatar_url, major: p.major }])
      );

      // Count likes per thought
      const likesCount = new Map<string, number>();
      (likesCountRes.data ?? []).forEach(({ thought_id }) =>
        likesCount.set(thought_id, (likesCount.get(thought_id) ?? 0) + 1)
      );

      // Count comments per thought
      const commentsCount = new Map<string, number>();
      (commentsCountRes.data ?? []).forEach(({ thought_id }) =>
        commentsCount.set(thought_id, (commentsCount.get(thought_id) ?? 0) + 1)
      );

      const myLikes = new Set((myLikesRes.data  ?? []).map((l) => l.thought_id));
      const mySaved = new Set((mySavedRes.data  ?? []).map((s) => s.thought_id));

      setSavedPostIds((prev) => append ? new Set([...prev, ...mySaved]) : mySaved);

      const formatted: Thought[] = rows.map((t) => ({
        id:             t.id,
        content:        t.content,
        image_url:      t.image_url,
        created_at:     t.created_at,
        user_id:        t.user_id,
        likes_count:    likesCount.get(t.id)    ?? 0,
        comments_count: commentsCount.get(t.id) ?? 0,
        shares_count:   0,                          // no shares table yet
        has_liked:      myLikes.has(t.id),
        profiles:       profileMap.get(t.user_id)  ?? FALLBACK_PROFILE,
      }));

      setThoughts((prev) => (append ? [...prev, ...formatted] : formatted));

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('fetchThoughts:', msg);
      toast.error('Failed to load posts. Please refresh.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!currentUserId) return;
    const next = page + 1;
    setPage(next);
    fetchThoughts(next, true, currentUserId);
  };

  // ── Like ──────────────────────────────────────────────────────────────────
  const handleLike = async (thoughtId: string, currentLiked: boolean) => {
    if (!currentUserId) return;
    setThoughts((prev) => prev.map((t) => t.id !== thoughtId ? t : {
      ...t,
      has_liked:   !currentLiked,
      likes_count: currentLiked ? Math.max(0, t.likes_count - 1) : t.likes_count + 1,
    }));
    try {
      if (currentLiked) {
        const { error } = await supabase.from('likes').delete()
          .eq('thought_id', thoughtId).eq('user_id', currentUserId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('likes')
          .insert({ thought_id: thoughtId, user_id: currentUserId });
        if (error) throw error;
      }
    } catch {
      // revert
      setThoughts((prev) => prev.map((t) => t.id !== thoughtId ? t : {
        ...t,
        has_liked:   currentLiked,
        likes_count: currentLiked ? t.likes_count + 1 : Math.max(0, t.likes_count - 1),
      }));
      toast.error('Failed to update like.');
    }
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleShare = async (thoughtId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/dashboard/post?id=${thoughtId}`);
      toast.success('Link copied to clipboard');
    } catch { toast.error('Failed to copy link'); }
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async (thoughtId: string) => {
    if (!currentUserId) return;
    const isSaved = savedPostIds.has(thoughtId);
    setSavedPostIds((prev) => { const n = new Set(prev); isSaved ? n.delete(thoughtId) : n.add(thoughtId); return n; });
    try {
      if (isSaved) {
        await supabase.from('saved_thoughts').delete().eq('thought_id', thoughtId).eq('user_id', currentUserId);
      } else {
        await supabase.from('saved_thoughts').insert({ thought_id: thoughtId, user_id: currentUserId });
      }
    } catch {
      setSavedPostIds((prev) => { const n = new Set(prev); isSaved ? n.add(thoughtId) : n.delete(thoughtId); return n; });
      toast.error('Failed to update saved post.');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeletingId(deleteTargetId);
    try {
      const { error } = await supabase.from('thoughts').delete().eq('id', deleteTargetId);
      if (error) throw error;
      setThoughts((prev) => prev.filter((t) => t.id !== deleteTargetId));
      toast.success('Post deleted.');
    } catch { toast.error('Failed to delete post.'); }
    finally { setDeletingId(null); setDeleteTargetId(null); }
  };

  // ── Time ──────────────────────────────────────────────────────────────────
  const timeAgo = (iso: string) => {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60)    return 'just now';
    if (s < 3600)  return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    const d = Math.floor(s / 86400);
    if (d < 30)  return `${d}d`;
    if (d < 365) return `${Math.floor(d / 30)}mo`;
    return `${Math.floor(d / 365)}y`;
  };

  const filtered = thoughts.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.content.toLowerCase().includes(q) ||
      (t.profiles.full_name?.toLowerCase().includes(q) ?? false) ||
      (t.profiles.major?.toLowerCase().includes(q) ?? false)
    );
  });

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map((i) => (
        <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800" />
            <div className="space-y-2 flex-1">
              <div className="w-36 h-4 rounded bg-neutral-800" />
              <div className="w-24 h-3 rounded bg-neutral-800" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 rounded bg-neutral-800" />
            <div className="w-2/3 h-4 rounded bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (filtered.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      {searchQuery
        ? <><p className="text-lg mb-1">No results for &quot;{searchQuery}&quot;</p><p className="text-sm">Try a different search term.</p></>
        : <><p className="text-lg mb-1">No posts yet.</p><p className="text-sm">Be the first to share something!</p></>
      }
    </div>
  );

  // ── Feed ──────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {filtered.map((thought) => (
            <motion.div
              key={thought.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 pb-2 flex justify-between items-start">
                <button
                  className="flex items-center gap-3 text-left"
                  onClick={() => router.push(`/dashboard/profile/${thought.user_id}`)}
                >
                  {thought.profiles.avatar_url ? (
                    <img src={thought.profiles.avatar_url} alt={thought.profiles.full_name ?? 'User'}
                      className="rounded-full object-cover w-12 h-12 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 flex-shrink-0">
                      <span className="text-gray-400 font-bold text-lg">
                        {thought.profiles.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white text-base hover:text-blue-400 transition-colors">
                      {thought.profiles.full_name ?? 'Anonymous User'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{thought.profiles.major ?? 'Student'}</span>
                      <span>·</span>
                      <span>{timeAgo(thought.created_at)}</span>
                    </div>
                  </div>
                </button>
                {currentUserId === thought.user_id && (
                  <button onClick={() => setDeleteTargetId(thought.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                    aria-label="Delete post">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="px-4 py-2">
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{thought.content}</p>
              </div>

              {/* Image */}
              {thought.image_url && (
                <div className="mt-2 px-4">
                  <div className="rounded-xl overflow-hidden border border-neutral-800">
                    <img src={thought.image_url} alt="Post image"
                      className="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <div className="bg-pink-500/10 p-1 rounded-full">
                    <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                  </div>
                  <span>{thought.likes_count}</span>
                </div>
                <div className="flex gap-4">
                  <span>{thought.comments_count} comments</span>
                  <span>{thought.shares_count} shares</span>
                </div>
              </div>

              <div className="h-px bg-neutral-800 mx-4" />

              {/* Actions */}
              <div className="px-2 py-1 flex items-center justify-between">
                <div className="flex flex-1 justify-between max-w-sm">
                  <button onClick={() => handleLike(thought.id, thought.has_liked)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors group flex-1 justify-center ${
                      thought.has_liked ? 'text-pink-500 bg-pink-500/10 hover:bg-pink-500/20' : 'text-gray-400 hover:bg-neutral-800'}`}>
                    <Heart className={`w-5 h-5 transition-colors ${thought.has_liked ? 'fill-pink-500' : 'group-hover:text-pink-500'}`} />
                    <span className={`font-medium ${thought.has_liked ? '' : 'group-hover:text-pink-500'}`}>
                      {thought.has_liked ? 'Liked' : 'Like'}
                    </span>
                  </button>

                  <button onClick={() => router.push(`/dashboard/post?id=${thought.id}`)}
                    className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:bg-neutral-800 rounded-lg transition-colors group flex-1 justify-center">
                    <MessageSquare className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                    <span className="font-medium group-hover:text-blue-500">Comment</span>
                  </button>

                  <button onClick={() => handleShare(thought.id)}
                    className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:bg-neutral-800 rounded-lg transition-colors group flex-1 justify-center">
                    <Share2 className="w-5 h-5 group-hover:text-green-500 transition-colors" />
                    <span className="font-medium group-hover:text-green-500">Share</span>
                  </button>
                </div>

                <button onClick={() => handleSave(thought.id)}
                  className="flex items-center justify-center p-3 text-gray-400 hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-label={savedPostIds.has(thought.id) ? 'Unsave' : 'Save'}>
                  <Bookmark className={`w-5 h-5 transition-colors ${savedPostIds.has(thought.id) ? 'fill-yellow-500 text-yellow-500' : 'hover:text-yellow-500'}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Load More */}
        {hasMore && !searchQuery && (
          <div className="flex justify-center pt-4 pb-8">
            <button onClick={handleLoadMore} disabled={loadingMore}
              className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
              {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : 'Load More Posts'}
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTargetId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => { if (!deletingId) setDeleteTargetId(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.18 }}
              className="relative bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setDeleteTargetId(null)} disabled={!!deletingId}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors disabled:opacity-40">
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Trash2 className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Delete Post?</h3>
                  <p className="text-gray-400 text-sm mt-1">This action cannot be undone.</p>
                </div>
                <div className="flex gap-3 w-full">
                  <button onClick={() => setDeleteTargetId(null)} disabled={!!deletingId}
                    className="flex-1 py-2.5 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-colors font-medium disabled:opacity-40">
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={!!deletingId}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                    {deletingId ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}