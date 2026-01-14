import { NextResponse, type NextRequest } from "next/server";
import { authRateLimit } from "./middleware/auth-rate-limit";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // Apply rate limiting to auth routes
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRateLimit(request);
  }

  // Protect recipe generation for non-authenticated users
  // TEMPORARILY DISABLED - Remove comments to re-enable auth
  // if (request.nextUrl.pathname === "/api/generate") {
  //   // Check for better-auth session cookie
  //   const sessionCookie = getSessionCookie(request);
  //   
  //   if (!sessionCookie) {
  //     return NextResponse.json(
  //       { error: "Authentication required for recipe generation" },
  //       { status: 401 }
  //     );
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    // "/api/generate", // TEMPORARILY DISABLED - Remove comment to re-enable middleware for this route
    "/api/cooking-chat",
    "/profile/:path*",
  ],
}; 