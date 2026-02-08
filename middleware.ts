import { NextRequest, NextResponse } from "next/server";
import { authRateLimit } from "./src/middleware/auth-rate-limit";
import { auth } from "./src/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log(`[Middleware] Checking path: ${path}`);

  // Apply rate limiting to auth routes (but don't block them)
  if (path.startsWith("/auth")) {
    console.log(`[Middleware] Auth route detected, applying rate limit`);
    return authRateLimit(request);
  }

  // Protect authenticated routes
  const protectedRoutes = ["/dashboard", "/profile"];
  const protectedApiRoutes = ["/api/generate", "/api/cooking-chat"];

  const isProtectedPage = protectedRoutes.some((route) => path.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some((route) => path.startsWith(route));

  console.log(`[Middleware] isProtectedPage: ${isProtectedPage}, isProtectedApi: ${isProtectedApi}`);

  if (isProtectedPage || isProtectedApi) {
    // Properly validate the session using Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    console.log(`[Middleware] Path: ${path}, Session:`, session ? 'Valid' : 'None', session?.user?.email);

    if (!session) {
      // For page routes, redirect to login
      if (isProtectedPage) {
        console.log(`[Middleware] No session found, redirecting to login from ${path}`);
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // For API routes, return 401
      if (isProtectedApi) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
    } else {
      console.log(`[Middleware] Session validated for ${path}, user: ${session.user.email}`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/api/generate",
    "/api/cooking-chat",
  ],
};