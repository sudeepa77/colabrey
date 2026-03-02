// app/dashboard/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { signOutAction } from '@/app/auth/action';
import { createClient } from '@/lib/supabase/server';
import {
  getCurrentUserProfile,
  getSuggestedUsers,
  getRecentConversations,
} from '@/lib/supabase/queries';
import DashboardContent from './components/DashboardContent';
import SuggestedPeople from './components/SuggestedPeople';
import RecentConversations from './components/RecentConversations';
import Sidebar from './components/Sidebar';
import MobileQRCard from './components/MobileQRCard';
import { User } from '@supabase/supabase-js'; 
import { Profile } from '@/types/user/database';
import { Search } from 'lucide-react';  

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

       // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('auth/login');
  }

  // Fetch all dashboard data in parallel

  const [profile, suggestedUsers, conversations] = await Promise.all([
    getCurrentUserProfile(supabase, user.id),
    getCurrentUserProfile(supabase, user.id).then(async (profile) => {
      if (!profile) return [];
      return getSuggestedUsers(
        supabase,
        user.id,
        profile.skills || [],
        profile.interests || []
      );
    }),
    getRecentConversations(supabase, user.id),
  ]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  const firstName = profile.full_name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />

      {/* Main Content Area - Layout adjusted for fixed sidebar */}
      <main className="pl-24 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column (Main) */}
          <div className="lg:col-span-8">
            <DashboardContent user={user} profile={profile} />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Header - Right Aligned */}
  <div className="flex justify-end mb-4 items-center">
    <Link 
      href={`/dashboard/profile/${user.id}`}
      className="transition-transform hover:scale-105 active:scale-95"
    >
      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center cursor-pointer hover:border-neutral-700">
        <span className="text-white font-bold">
          {firstName[0]}
        </span>
      </div>
    </Link>
  </div>
          
            <SuggestedPeople users={suggestedUsers} />
            <RecentConversations conversations={conversations} /> 
            <MobileQRCard />
          </div>

        </div>
      </main>
    </div>
  );
}