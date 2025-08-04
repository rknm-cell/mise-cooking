import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ request });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement viewed recipes from database
    // For now, return empty array
    const recipes = [];

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Error fetching viewed recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch viewed recipes" },
      { status: 500 }
    );
  }
} 