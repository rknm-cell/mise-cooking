import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get the session cookie
    const sessionCookie = request.cookies.get("better-auth.session-token")?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, just check if the session exists
    // TODO: Implement proper session validation with better-auth
    // This is a temporary workaround until we figure out the correct better-auth API
    
    // TODO: Implement cooking history from database
    // For now, return empty array
    const history = [];

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching cooking history:", error);
    return NextResponse.json(
      { error: "Failed to fetch cooking history" },
      { status: 500 }
    );
  }
}