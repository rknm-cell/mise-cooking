import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { checkOnboardingStatus } from "~/server/db/queries";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user has completed onboarding
    const hasCompletedOnboarding = await checkOnboardingStatus(session.user.id);

    if (!hasCompletedOnboarding) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
