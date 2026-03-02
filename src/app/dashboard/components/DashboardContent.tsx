//app/src/dashboard/components/DashboardContent.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import CreatePostCard from './CreatePostCard';
import Feed from './Feed';
import MyActivity from './MyActivity';
import ProfileStatsCard from './ProfileStatsCard';
import { User } from '@supabase/supabase-js';

type Profile = {
    full_name: string | null;
    avatar_url: string | null;
    major: string | null;
};

interface DashboardContentProps {
    user: User | null;
    profile: Profile | null;
}

export default function DashboardContent({ user, profile }: DashboardContentProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.first_name || 'Student';


    return (
        <div className="space-y-8">
            {/* Top Bar: Search and Brand */}
            <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between sticky top-0 z-10 bg-black/80 backdrop-blur-md py-4">
                {/* Search Bar (Left Side) */}
            
            </div>

            {/* Welcome Header */}
            <div>
                <h1 className="text-4xl font-bold font-display mb-2 text-white">
                    Welcome back, {firstName}!
                </h1>
                <p className="text-gray-400">
                    Here's what's happening with your network today.
                </p>
            </div>

            {/* Profile Stats Card */}
            <ProfileStatsCard user={user} profile={profile} />

         
            {/* Feed Section Title */}
            <div className="pt-4">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-xl font-bold text-white font-display">Community Feed</h2>
                </div>
                <Feed searchQuery={searchQuery} />
            </div>
        </div>
    );
}
