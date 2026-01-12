import { NextResponse, type NextRequest } from "next/server";
import { authRateLimit } from "./middleware/auth-rate-limit";

export function middleware(request: NextRequest) {
  // Apply rate limiting to auth routes
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRateLimit(request);
  }

  // Protect recipe generation for non-authenticated users
  if (request.nextUrl.pathname === "/api/generate") {
    // Check for auth token in headers or cookies
    const authToken = request.headers.get("authorization") || 
                     request.cookies.get("auth-token")?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Authentication required for recipe generation" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/api/generate",
    "/api/cooking-chat",
    "/profile/:path*",
  ],
}; 