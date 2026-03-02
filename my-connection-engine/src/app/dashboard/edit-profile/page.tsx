// src/app/dashboard/edit-profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getUser, getProfile, updateProfile } from '@/lib/auth';
import { ProfileSection } from './components/ProfileSection';
import { InterestsSection } from './components/InterestsSection';
import { InterestsModal } from './components/InterestsModal';
import { GithubLinkBox } from './components/GithubLinkBox';
import { CurrentlyFocusedBox } from './components/CurrentlyFocusedBox';
import { ResumeUploadBox } from './components/ResumeUploadBox';
import { LookingForBox } from './components/LookingForBox';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notifyProfileUpdate } from '@/lib/profileUpdateManager';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    avatar_url: '',
    full_name: '',
    bio: '',
    major: '',
    year: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string>('');
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUserId(user.id);
      const profile = await getProfile(user.id);


      if (profile) {
        setProfileData({
          avatar_url: profile.avatar_url || '',
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          major: profile.major || '',
          year: profile.year || '',
          github_url: profile.github_url || '',
          linkedin_url: profile.linkedin_url || '',
          portfolio_url: profile.portfolio_url || '',
        });
        setSkills(profile.skills || []);
        setInterests(profile.interests || []);
        setCurrentResumeUrl(profile.resume_url || '');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsUpdate = (newSkills: string[]) => {
    setSkills(newSkills);
  };

  const handleInterestsUpdate = (newInterests: string[]) => {
    setInterests(newInterests);
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest));
  };

  async function uploadResume(file: File): Promise<string | null> {
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error('Resume upload error:', err);
      return null;
    }
  }

  async function uploadAvatar(file: File): Promise<string | null> {
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error('Avatar upload error:', err);
      return null;
    }
  }

  async function handleSave() {
    if (!userId) return;

    try {
      setSaving(true);
      setError('');

      let resumeUrl = currentResumeUrl;
      if (resumeFile) {
        const uploadedUrl = await uploadResume(resumeFile);
        if (uploadedUrl) resumeUrl = uploadedUrl;
      }

      await updateProfile(userId, {
        ...profileData,
        skills,
        interests,
        resume_url: resumeUrl,
      });

      // Notify all components that the profile has been updated
      notifyProfileUpdate();

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Profile Updated!</h2>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-gray-400 mt-1">Customize your presence</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side - Profile */}
          <div className="lg:col-span-3">
            <ProfileSection
              profileData={profileData}
              onUpdate={handleProfileUpdate}
              onAvatarUpload={uploadAvatar}
            />
          </div>

          {/* Right Side - Details */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-12 gap-4">
              {/* First Row - Skills/Interests + Resume */}
              <div className="col-span-12 md:col-span-7">
                <InterestsSection
                  selectedSkills={skills}
                  selectedInterests={interests}
                  onOpenModal={() => setIsInterestsModalOpen(true)}
                  onRemoveSkill={handleRemoveSkill}
                  onRemoveInterest={handleRemoveInterest}
                />
              </div>
              <div className="col-span-12 md:col-span-5">
                <ResumeUploadBox
                  resumeFile={resumeFile}
                  onUpdate={setResumeFile}
                />
              </div>

              {/* Second Row - Social Links */}
              <div className="col-span-12 grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-2">
                  <GithubLinkBox
                    githubUrl={profileData.github_url}
                    onUpdate={(url) => handleProfileUpdate('github_url', url)}
                  />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <CurrentlyFocusedBox
                    major={profileData.major}
                    year={profileData.year}
                    onUpdate={(field, value) => handleProfileUpdate(field, value)}
                  />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <LookingForBox
                    linkedinUrl={profileData.linkedin_url}
                    portfolioUrl={profileData.portfolio_url}
                    onUpdate={(field, value) => handleProfileUpdate(field, value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Interests Modal */}
      <InterestsModal
        isOpen={isInterestsModalOpen}
        onClose={() => setIsInterestsModalOpen(false)}
        selectedSkills={skills}
        selectedInterests={interests}
        onUpdateSkills={handleSkillsUpdate}
        onUpdateInterests={handleInterestsUpdate}
      />
    </div>
  );
}