'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Heart, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getErrorMessage(error: string | null) {
  switch (error) {
    case 'OAuthSignin':
      return 'Error starting the sign-in process.';
    case 'OAuthCallback':
      return 'Error during the OAuth callback.';
    case 'OAuthCreateAccount':
      return 'Could not create your account.';
    case 'EmailCreateAccount':
      return 'Could not create your account with email.';
    case 'Callback':
      return 'Callback error occurred.';
    case 'OAuthAccountNotLinked':
      return 'This email is already linked to another account.';
    case 'EmailSignin':
      return 'Could not send you a sign-in email.';
    case 'CredentialsSignin':
      return 'Invalid credentials.';
    case 'default':
    default:
      return 'An error occurred during authentication.';
  }
}

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h1>
        <p className="text-gray-500">{getErrorMessage(error)}</p>
      </div>

      {error && (
        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-400 font-mono">
            Error: {error}
            {callbackUrl && (
              <>
                <br />
                Callback: {callbackUrl}
              </>
            )}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Link href="/auth/login">
          <Button variant="outline" className="w-full h-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full">
            Go to Homepage
          </Button>
        </Link>
      </div>
    </>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Vitalia
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <ErrorContent />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need help?{' '}
          <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
