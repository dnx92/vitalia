import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = [
  "/",
  "/auth/login",
  "/auth/register", 
  "/auth/forgot-password",
  "/search",
  "/service",
  "/terms",
  "/privacy",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.some((path) => pathname === path || pathname.startsWith("/api/auth") || pathname.startsWith("/api/doctors") || pathname.startsWith("/api/services") || pathname.startsWith("/_next") || pathname.startsWith("/favicon"))) {
    return NextResponse.next();
  }

  // Check for NextAuth token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Admin routes require admin role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if ((token as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Dashboard and other protected routes
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
