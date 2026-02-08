import { redirect } from "next/navigation";
import { OnboardingFlow } from "~/app/components/onboarding/OnboardingFlow";
import { auth } from "~/lib/auth";
import { checkOnboardingStatus } from "~/server/db/queries";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user has already completed onboarding
  const hasCompletedOnboarding = await checkOnboardingStatus(session.user.id);

  if (hasCompletedOnboarding) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <OnboardingFlow userId={session.user.id} />
    </main>
  );
}
