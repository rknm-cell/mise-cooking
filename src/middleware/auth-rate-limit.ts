import { NextRequest, NextResponse } from "next/server";

// In-memory store for rate limiting (use Redis in production)
const authAttempts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // 5 attempts per window

export function authRateLimit(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  
  const attempts = authAttempts.get(ip);
  
  if (!attempts || now > attempts.resetTime) {
    // First attempt or window expired
    authAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return NextResponse.next();
  }
  
  if (attempts.count >= MAX_ATTEMPTS) {
    // Rate limit exceeded
    return NextResponse.json(
      { error: "Too many authentication attempts. Please try again later." },
      { status: 429 }
    );
  }
  
  // Increment attempt count
  attempts.count++;
  return NextResponse.next();
} 