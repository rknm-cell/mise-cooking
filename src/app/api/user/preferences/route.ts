import { NextRequest, NextResponse } from "next/server";
import {
  createUserPreferences,
  getUserPreferences,
  updateUserPreferences,
} from "~/server/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const preferences = await getUserPreferences(userId);

    if (!preferences) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch user preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...preferences } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if preferences already exist
    const existingPreferences = await getUserPreferences(userId);

    let result;
    if (existingPreferences) {
      // Update existing preferences
      result = await updateUserPreferences(userId, preferences);
    } else {
      // Create new preferences
      result = await createUserPreferences(userId, preferences);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to save preferences" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      preferences: result.preferences,
    });
  } catch (error) {
    console.error("Error saving user preferences:", error);
    return NextResponse.json(
      { error: "Failed to save user preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const result = await updateUserPreferences(userId, updates);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to update preferences" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      preferences: result.preferences,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Failed to update user preferences" },
      { status: 500 }
    );
  }
}
