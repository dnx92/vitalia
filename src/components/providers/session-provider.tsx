"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/store";
import type { Session } from "next-auth";

interface Props {
  children: React.ReactNode;
  session?: Session | null;
}

function AuthSync({ session }: { session: Session | null | undefined }) {
  const { login, logout, setLoading } = useAuthStore();

  useEffect(() => {
    if (session?.user) {
      login({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        avatar: session.user.image || "",
        role: (session.user as any).role || "PATIENT",
        isAdmin: (session.user as any).isAdmin || false,
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
