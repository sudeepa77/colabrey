// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';



export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const supabase = createClient();
  
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email.toLowerCase(),
        password: formData.password,
      });
  
      if (error) throw error;
  
      // 🔑 force server to re-read cookies
      router.refresh();
  
      // navigate AFTER refresh
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cosmos-style Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      </div>

      {/* Corner Doodles/Strings - Top Left */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 10 10 Q 50 50 10 90 T 10 170"
            stroke="#FF6B35"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="animate-draw-path"
          />
          <path
            d="M 30 10 Q 70 40 40 80 T 50 160"
            stroke="#FF6B35"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            className="animate-draw-path"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>
      </div>

      {/* Corner Doodles - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-20 rotate-180">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 10 10 Q 50 50 10 90 T 10 170"
            stroke="#FF6B35"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="animate-draw-path"
          />
          <path
            d="M 30 10 Q 70 40 40 80 T 50 160"
            stroke="#FF6B35"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            className="animate-draw-path"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md fade-in-up">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Card */}
        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-3xl p-8 md:p-12 space-y-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-4">
             {/* Logo/Icon */}
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/images/logo.png" // Path from 'public' folder
                alt="Colabrey Logo"
                width={64}  // Corresponds to w-16
                height={64} // Corresponds to h-16
                className="rounded-full" // Makes the image round
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white font-display">
              Log in
            </h1>
            <p className="text-gray-500 text-base">
              or <Link href="/auth/signup" className="text-[#FF6B35] hover:underline">create an account</Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400 text-sm font-medium">
                Email or username
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#FF6B35] transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-12 h-14 bg-[#0F0F0F] border-2 border-[#1A1A1A] focus:border-[#FF6B35] text-white placeholder:text-gray-600 rounded-xl transition-all hover:bg-[#151515]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-400 text-sm font-medium">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#FF6B35] transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-12 pr-12 h-14 bg-[#0F0F0F] border-2 border-[#1A1A1A] focus:border-[#FF6B35] text-white placeholder:text-gray-600 rounded-xl transition-all hover:bg-[#151515]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#FF6B35] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-gray-500 hover:text-[#FF6B35] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-white hover:bg-gray-100 text-black rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </span>
              ) : (
                'Enter'
              )}
            </Button>
          </form>
        </div>

        {/* Bottom Info */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Only verified emails can access Colabrey 💌
        </p>
      </div>
    </div>
  );
}