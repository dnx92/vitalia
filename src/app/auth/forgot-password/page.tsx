'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSent(true);
    setIsLoading(false);
  };

  if (isSent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Check Your Email</h1>
          <p className="text-slate-500 font-medium mb-8">
            We&apos;ve sent a password reset link to{' '}
            <span className="font-semibold text-slate-700">{email}</span>. Please check your inbox
            and spam folder.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => {
                setIsSent(false);
                setEmail('');
              }}
              className="w-full"
            >
              Try Another Email
            </Button>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="w-full max-w-md">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Heart className="h-7 w-7 text-white" />
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-slate-900 tracking-tight">Reset Password</h1>
          <p className="mt-2 text-slate-500 font-medium">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md rounded-2xl">
          <CardContent className="pt-8 px-8 pb-6">
            {error && (
              <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-12 h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-400 font-medium">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
