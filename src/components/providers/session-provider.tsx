'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import type { Session } from 'next-auth';

type SessionUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: 'ADMIN' | 'PATIENT' | 'PROFESSIONAL';
  isAdmin?: boolean;
};

interface Props {
  children: React.ReactNode;
  session?: Session | null;
}

function AuthSync({ session }: { session: Session | null | undefined }) {
  const { login, logout, setLoading } = useAuthStore();

  useEffect(() => {
    if (session?.user) {
      const user = session.user as SessionUser;
      login({
        id: user.id || '',
        email: user.email || '',
        name: user.name || '',
        avatar: user.image || '',
        role: user.role || 'PATIENT',
        isAdmin: user.isAdmin || false,
      });
      setLoading(false);
    } else {
      logout();
      setLoading(false);
    }
  }, [session, login, logout, setLoading]);

  return null;
}

export function SessionProvider({ children, session }: Props) {
  return (
    <NextAuthSessionProvider session={session ?? null}>
      <AuthSync session={session} />
      {children}
    </NextAuthSessionProvider>
  );
}
