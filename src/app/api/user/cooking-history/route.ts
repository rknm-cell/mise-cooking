import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ request });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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