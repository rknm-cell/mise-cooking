import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { getUserPreferences } from "~/server/db/queries";
import { UserSettingsForm } from "~/app/components/settings/UserSettingsForm";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const preferences = await getUserPreferences(session.user.id);

  return (
    <main className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and cooking profile
        </p>
      </div>

      <UserSettingsForm
        userId={session.user.id}
        user={session.user}
        initialPreferences={preferences}
      />
    </main>
  );
}
