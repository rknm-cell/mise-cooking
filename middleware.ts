import { NextRequest, NextResponse } from "next/server";
import { authRateLimit } from "./src/middleware/auth-rate-limit";

const SESSION_COOKIES = [
  "better-auth.session_token",
  "better-auth.session-token",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/auth")) {
    return authRateLimit(request);
  }

  const protectedRoutes = ["/dashboard", "/profile"];
  const protectedApiRoutes = ["/api/generate", "/api/cooking-chat"];

  const isProtectedPage = protectedRoutes.some((route) => path.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some((route) => path.startsWith(route));

  if (isProtectedPage || isProtectedApi) {
    const token = SESSION_COOKIES.some(
      (name) => request.cookies.get(name)?.value,
    );

    if (!token) {
      if (isProtectedPage) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
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
