'use client';
import { Suspense } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Loader2, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Spinner used during Suspense fallback AND verifying state ────────────────
function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
          <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
        </div>
        <p className="text-gray-400 text-base">{label}</p>
      </div>
    </div>
  );
}

// ─── Inner component — uses useSearchParams (MUST be inside Suspense) ─────────
function ResetPasswordInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();  // ← safe inside Suspense

  // ✅ createClient inside component — not at module level
  const supabase = useMemo(() => createClient(), []);

  const [password,            setPassword]            = useState('');
  const [confirmPassword,     setConfirmPassword]     = useState('');
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pageState,           setPageState]           = useState<'verifying' | 'ready' | 'error' | 'success'>('verifying');
  const [error,               setError]               = useState('');
  const [submitting,          setSubmitting]          = useState(false);

  // ── Verify reset code on mount ───────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      const code = searchParams.get('code');

      if (!code) {
        if (mounted) {
          setError('Invalid or expired reset link. Please request a new one.');
          setPageState('error');
        }
        return;
      }

      try {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!mounted) return;

        if (exchangeError) {
          setError('This reset link has expired or already been used. Please request a new one.');
          setPageState('error');
        } else {
          setPageState('ready');
        }
      } catch {
        if (mounted) {
          setError('Something went wrong. Please try again.');
          setPageState('error');
        }
      }
    };

    verify();
    return () => { mounted = false; };
  }, [searchParams, supabase]);

  // ── Submit new password ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPageState('success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Verifying ────────────────────────────────────────────────────────────
  if (pageState === 'verifying') {
    return <LoadingSpinner label="Verifying your reset link..." />;
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#0A0A0A] border-2 border-red-500/20 rounded-3xl p-10 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Link Invalid</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{error}</p>
          </div>
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center justify-center w-full h-12 bg-[#FF6B35] hover:bg-[#e55a25] text-white font-semibold rounded-xl transition-colors"
          >
            Request a New Reset Link
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (pageState === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-3xl p-12 max-w-md w-full text-center space-y-6">
          <div className="relative inline-block mx-auto">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Password Reset!</h2>
            <p className="text-gray-400">Your password has been updated successfully.</p>
          </div>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full h-12 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Doodles */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 10 10 Q 50 50 10 90 T 10 170" stroke="#FF6B35" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 30 10 Q 70 40 40 80 T 50 160" stroke="#FF6B35" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-20 rotate-180">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 10 10 Q 50 50 10 90 T 10 170" stroke="#FF6B35" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 30 10 Q 70 40 40 80 T 50 160" stroke="#FF6B35" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/auth/login" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>

        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-3xl p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-6">
              <Image src="/images/logo.png" alt="Colabrey Logo" width={64} height={64} className="rounded-full" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-display">New Password</h1>
            <p className="text-gray-500 text-base">Choose a strong password for your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-400 text-sm font-medium block">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#FF6B35] transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={submitting}
                  className="w-full pl-12 pr-12 h-14 bg-[#0F0F0F] border-2 border-[#1A1A1A] focus:border-[#FF6B35] text-white placeholder:text-gray-600 rounded-xl transition-all hover:bg-[#151515] outline-none disabled:opacity-60"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#FF6B35] transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-600 pl-1">Must be at least 8 characters</p>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-gray-400 text-sm font-medium block">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#FF6B35] transition-colors" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full pl-12 pr-12 h-14 bg-[#0F0F0F] border-2 border-[#1A1A1A] focus:border-[#FF6B35] text-white placeholder:text-gray-600 rounded-xl transition-all hover:bg-[#151515] outline-none disabled:opacity-60"
                />
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#FF6B35] transition-colors" tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-xs pl-1 transition-colors ${password === confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || password !== confirmPassword || password.length < 8}
              className="w-full h-14 text-lg font-semibold bg-white hover:bg-gray-100 text-black rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Default export — wraps inner component in Suspense ───────────────────────
// This is REQUIRED by Next.js when using useSearchParams() in a page component.
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading..." />}>
      <ResetPasswordInner />
    </Suspense>
  );
}