//app/src/dashboard/profile/[id]/page.tsx
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  Github,
  Linkedin,
  Globe,
  FileText,
  Users,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import ConnectionButton from '@/components/ui/ConnectionButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  major: string | null;
  year: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  skills: string[] | null;
  interests: string[] | null;
}

async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/auth/login');

  const profile = await getProfile(id);
  if (!profile) notFound();

  const isOwnProfile = currentUser.id === id;

  const hasInterests = profile.interests && profile.interests.length > 0;

  const initials =
    profile.full_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Link>

          {isOwnProfile && (
            <Link
              href="/dashboard/edit-profile"
              className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-12 gap-4 auto-rows-[120px]">

          {/* ================= PROFILE CARD ================= */}
          <div className="col-span-8 md:col-span-4 row-span-4 bg-neutral-900 rounded-3xl p-6 border border-neutral-800 flex flex-col">

            {/* Avatar */}
            <div className="mb-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-neutral-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                  {initials}
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Education */}
            {(profile.major || profile.year) && (
              <div className="mt-4 pt-4 border-t border-neutral-800 flex gap-2">
                <GraduationCap className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  {profile.major && <p className="text-sm">{profile.major}</p>}
                  {profile.year && <p className="text-xs text-gray-500">{profile.year}</p>}
                </div>
              </div>
            )}

            {/* ===== ACTION ROW (INSIDE PROFILE CARD) ===== */}
            {!isOwnProfile && (
              <div className="mt-auto pt-4 flex gap-3">
                {/* Connected */}
                <div className="flex-1 bg-green-900/40 border border-green-800 rounded-xl flex items-center justify-center gap-2 py-2">
                  <ConnectionButton
                    userId={id}
                    className="text-sm text-green-300"
                  />
                </div>

                {/* Message */}
                <Link
                  href={`/dashboard/messages?user=${id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center gap-2 py-2 transition"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                </Link>
              </div>
            )}
          </div>

          {/* ================= SOCIAL TILES ================= */}
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-6 md:col-span-2 row-span-2 bg-[#0d1117] rounded-2xl p-4 flex flex-col items-center justify-center"
            >
              <Github />
              <p className="text-xs mt-2">GitHub</p>
            </a>
          )}

          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-6 md:col-span-2 row-span-2 bg-[#0077b5] rounded-2xl p-4 flex flex-col items-center justify-center"
            >
              <Linkedin />
              <p className="text-xs mt-2">LinkedIn</p>
            </a>
          )}

          {profile.portfolio_url && (
            <a
              href={profile.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-6 md:col-span-2 row-span-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 flex flex-col items-center justify-center"
            >
              <Globe />
              <p className="text-xs mt-2">Portfolio</p>
            </a>
          )}

          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-6 md:col-span-2 row-span-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 flex flex-col items-center justify-center"
            >
              <FileText />
              <p className="text-xs mt-2">Resume</p>
            </a>
          )}

          {/* ================= SKILLS ================= */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="col-span-12 md:col-span-8 row-span-2 bg-neutral-900 rounded-2xl p-5 border border-neutral-800">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {hasInterests && (
            <div className="col-span-12 md:col-span-8 row-span-2 bg-neutral-900 rounded-2xl p-5 border border-neutral-800">
              <div className="mb-3">✨ Interests</div>
              <div className="flex flex-wrap gap-2">
                {profile.interests!.map((i, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs rounded-full bg-purple-500/10">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
