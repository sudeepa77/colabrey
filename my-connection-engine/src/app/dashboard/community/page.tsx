//app/src/dahsboard/community/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '../components/Sidebar';
import SuggestedPeople from '../components/SuggestedPeople';
import MobileQRCard from '../components/MobileQRCard';

export default function CommunityPage() {
    const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, major, bio, skills, interests')
                .limit(5);

            const formatted = data?.map(user => ({
                ...user,
                matchingTags: [],
                matchCount: 0
            })) || [];

            setSuggestedUsers(formatted);
        };
        fetchSuggestedUsers();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar />

            {/* Main Content Area */}
            <main className="pl-24 p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column (Main) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-bold text-white font-display">Community</h1>
                                <p className="text-gray-400 text-lg">
                                    Join the discussion! Feature coming soon.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4 space-y-6">
                        <SuggestedPeople users={suggestedUsers} />
                        <MobileQRCard />
                    </div>

                </div>
            </main>
        </div>
    );
}
