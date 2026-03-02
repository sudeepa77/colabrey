// src/app/dashboard/edit-profile/components/ProfileSection.tsx
'use client';
import { useState, useRef } from "react";
import { Camera } from "lucide-react";

interface ProfileSectionProps {
  profileData: {
    avatar_url: string;
    full_name: string;
    bio: string;
    major: string;
    year: string;
  };
  onUpdate: (field: string, value: string) => void;
  onAvatarUpload?: (file: File) => Promise<string | null>;
}

export function ProfileSection({
  profileData,
  onUpdate,
  onAvatarUpload,
}: ProfileSectionProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onAvatarUpload) {
      setUploadingAvatar(true);
      try {
        const url = await onAvatarUpload(file);
        if (url) {
          onUpdate("avatar_url", url);
        }
      } catch (error) {
        console.error('Avatar upload failed:', error);
      } finally {
        setUploadingAvatar(false);
      }
    } else {
      // Fallback: use base64 preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate("avatar_url", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameClick = () => {
    setIsEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const handleBioClick = () => {
    setIsEditingBio(true);
    setTimeout(() => bioTextareaRef.current?.focus(), 0);
  };

  return (
    <div className="bg-[#151515] rounded-2xl p-10">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-10">
        <div
          className="relative w-40 h-40 rounded-full bg-[#1f1f1f] cursor-pointer group hover:bg-[#2a2a2a] transition-all"
          onClick={handleAvatarClick}
        >
          {profileData.avatar_url ? (
            <img
              src={profileData.avatar_url}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Camera className="w-10 h-10 text-gray-500 group-hover:text-gray-400 transition-colors" />
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {uploadingAvatar ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <Camera className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploadingAvatar}
        />
        <p className="text-sm text-gray-500 mt-4">Add Avatar</p>
      </div>

      {/* Full Name */}
      <div className="mb-12">
        {isEditingName || profileData.full_name ? (
          <input
            ref={nameInputRef}
            type="text"
            value={profileData.full_name}
            onChange={(e) => onUpdate("full_name", e.target.value)}
            onBlur={() => setIsEditingName(false)}
            placeholder="Your Name"
            className="w-full bg-[#1f1f1f] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        ) : (
          <div
            onClick={handleNameClick}
            className="cursor-pointer text-white hover:text-gray-300 transition-colors"
          >
            Your Name
          </div>
        )}
      </div>

      {/* Bio */}
      <div>
        {isEditingBio || profileData.bio ? (
          <textarea
            ref={bioTextareaRef}
            value={profileData.bio}
            onChange={(e) => onUpdate("bio", e.target.value)}
            onBlur={() => setIsEditingBio(false)}
            placeholder="Tell us about yourself..."
            rows={6}
            className="w-full bg-[#1f1f1f] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
          />
        ) : (
          <div
            onClick={handleBioClick}
            className="cursor-pointer text-white hover:text-gray-300 transition-colors"
          >
            Bio
          </div>
        )}
      </div>
    </div>
  );
}