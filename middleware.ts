import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { authRateLimit } from "./src/middleware/auth-rate-limit";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Apply rate limiting to auth routes (but don't block them)
  if (path.startsWith("/auth")) {
    return authRateLimit(request);
  }

  // Protect authenticated routes
  const protectedRoutes = ["/dashboard", "/profile"];
  const protectedApiRoutes = ["/api/generate", "/api/cooking-chat"];

  const isProtectedPage = protectedRoutes.some((route) => path.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some((route) => path.startsWith(route));

  if (isProtectedPage || isProtectedApi) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      // For page routes, redirect to home
      if (isProtectedPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // For API routes, return 401
      if (isProtectedApi) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/generate",
    "/api/cooking-chat",
  ],
};