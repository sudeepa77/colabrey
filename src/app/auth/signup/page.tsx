// src/app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { signUp } from '@/lib/auth';
import Image from 'next/image';


export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
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

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-3xl p-12 max-w-md text-center space-y-6 scale-in">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
          </div>
          
          <h2 className="text-4xl font-bold text-white font-display">
            Account Created!
          </h2>
          <p className="text-gray-400 text-lg">
            Please check your email to verify your account.<br />
            <span className="text-[#FF6B35]">Redirecting to login...</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
     

      {/* Corner Doodles - Top Left */}
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

      {/* Signup Card */}
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
              Welcome to Colabrey
            </h1>
            <p className="text-gray-500 text-base">
              Begin by creating an account
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
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-400 text-sm font-medium">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#FF6B35] transition-colors" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="pl-12 h-14 bg-[#0F0F0F] border-2 border-[#1A1A1A] focus:border-[#FF6B35] text-white placeholder:text-gray-600 rounded-xl transition-all hover:bg-[#151515]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400 text-sm font-medium">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#FF6B35] transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@rmd.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-12 h-14 bg-[#0F0F0F] border-2 border-[#1A1A1A] focus:border-[#FF6B35] text-white placeholder:text-gray-600 rounded-xl transition-all hover:bg-[#151515]"
                />
              </div>
            </div>

            {/* Password */}
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
                  placeholder="Enter password"
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
              <p className="text-xs text-gray-600">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-400 text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#FF6B35] transition-colors" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pl-12 pr-12 h-14 bg-[#0F0F0F] border-2 border-[#1A1A1A] focus:border-[#FF6B35] text-white placeholder:text-gray-600 rounded-xl transition-all hover:bg-[#151515]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#FF6B35] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-600 text-center">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-[#FF6B35] hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link>
            </p>

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
                  <span>Creating...</span>
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#FF6B35] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}