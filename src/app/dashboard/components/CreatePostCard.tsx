//app/src/dashboard/components/CreatePostCard.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    Loader2,
    Image as ImageIcon,
    Send,
    X,
    Megaphone
} from 'lucide-react';
import { profileUpdateManager } from '@/lib/profileUpdateManager';
import { toast } from 'sonner';

type Profile = {
    full_name: string | null;
    avatar_url: string | null;
    major: string | null;
};

type User = {
    id: string;
    email?: string;
};

interface CreatePostCardProps {
    user: User | null;
    profile: Profile | null;
}
export default function CreatePostCard({ user, profile: initialProfile }: CreatePostCardProps) {

    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    // Fetch fresh profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            const { data } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, major')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
            }
        };

        fetchProfile();

        // Refresh profile when window regains focus (e.g., after editing profile)
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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePost = async () => {
        if (!content.trim() && !imageFile) return;
        if (!user) return;

        setSubmitting(true);
        try {
            let finalImageUrl = null;

            // 1. Upload Image if exists
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('thought-images')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('thought-images')
                    .getPublicUrl(fileName);

                finalImageUrl = publicUrl;
            }

            // 2. Insert Thought
            const { error: insertError } = await supabase
                .from('thoughts')
                .insert({
                    user_id: user.id,
                    content: content,
                    image_url: finalImageUrl,
                });

            if (insertError) throw insertError;

            // 3. Reset
            setContent('');
            clearImage();
                toast.success('Post created successfully!');
            

        } catch (err) {
            console.error('Error creating post:', err);
            toast.error('Failed to create post. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const initial = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U');

    if (!user) return null;

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mt-20">
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.full_name || 'User'}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
                            {initial}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    {/* User Info & Badge */}
                    <div className="flex flex-col mb-3">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-base">
                                {profile?.full_name || user.email?.split('@')[0] || 'User'}
                            </span>
                            <span className="text-gray-500 text-sm">• {profile?.major || 'Student'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-neutral-800 w-fit px-2 py-0.5 rounded-md mt-1 border border-neutral-700">
                            <Megaphone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-300 font-medium">Post</span>
                        </div>
                    </div>

                    {/* Text Input */}
                    <div className="relative">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind? Share study tips, ask questions, or find collaborators..."
                            maxLength={5000}
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none h-24 p-0 text-base leading-relaxed"
                        />
                        <div className="absolute bottom-2 right-0 text-xs text-gray-600">
                            {content.length}/5000
                        </div>
                    </div>

                    {imagePreview && (
                        <div className="relative inline-block mb-4 mt-2">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-40 w-auto rounded-lg object-cover border border-neutral-700"
                            />
                            <button
                                onClick={clearImage}
                                className="absolute -top-2 -right-2 bg-black rounded-full p-1 border border-neutral-700 hover:bg-neutral-800 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    )}

                    {/* Bottom Toolbar */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded-lg hover:bg-neutral-800"
                            >
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-sm font-medium">Image</span>
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
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Post</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
