import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { cookingSession, recipe } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // DEBUGGING: Auth disabled - use query param for userId
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Fetch completed cooking sessions with recipe details
    const sessions = await db
      .select({
        sessionId: cookingSession.id,
        recipeId: cookingSession.recipeId,
        recipeName: recipe.name,
        status: cookingSession.status,
        startedAt: cookingSession.startedAt,
        completedAt: cookingSession.completedAt,
        currentStep: cookingSession.currentStep,
      })
      .from(cookingSession)
      .leftJoin(recipe, eq(cookingSession.recipeId, recipe.id))
      .where(eq(cookingSession.userId, userId))
      .orderBy(desc(cookingSession.startedAt))
      .limit(50);

    // Format the history
    const history = sessions.map((session) => ({
      recipeId: session.recipeId,
      recipeName: session.recipeName || "Unknown Recipe",
      cookedAt: session.completedAt || session.startedAt,
      status: session.status,
      sessionId: session.sessionId,
    }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching cooking history:", error);
    return NextResponse.json(
      { error: "Failed to fetch cooking history" },
      { status: 500 }
    );
  }
}