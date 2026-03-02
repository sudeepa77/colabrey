// src/app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    if (!email.toLowerCase().endsWith('@rmd.ac.in')) {
      setError('Please use your RMD college email (@rmd.ac.in)');
      setLoading(false);
      return;
    }
  
    try {
      const supabase = createClient();
  
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
      });
      
  
      if (error) throw error;
  
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };
  
  

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-3xl p-12 max-w-md text-center space-y-6 scale-in">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-[#FF6B35] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-[#FF6B35]/30 rounded-full blur-2xl animate-pulse"></div>
          </div>
          
          <h2 className="text-4xl font-bold text-white font-display">
            Check Your Email
          </h2>
          <p className="text-gray-400 text-lg">
            We've sent a password reset link to<br />
            <span className="text-[#FF6B35]">{email}</span>
          </p>
          <Link href="/auth/login">
            <Button className="w-full h-12 bg-white hover:bg-gray-100 text-black rounded-xl">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Corner Doodles */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 10 10 Q 50 50 10 90 T 10 170"
            stroke="#FF6B35"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md fade-in-up">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>

        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-3xl p-8 md:p-12 space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/images/logo.png"
                alt="Colabrey Logo"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white font-display">
              Reset Password
            </h1>
            <p className="text-gray-500 text-base">
              Enter your email to receive a reset link
            </p>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400 text-sm font-medium">
                College Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#FF6B35] transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-14 bg-[#0F0F0F] border-2 border-[#1A1A1A] focus:border-[#FF6B35] text-white placeholder:text-gray-600 rounded-xl transition-all hover:bg-[#151515]"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-white hover:bg-gray-100 text-black rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </span>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}