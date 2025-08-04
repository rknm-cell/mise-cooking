"use client";

import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export function AuthTestPanel() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testGetSession = async () => {
    try {
      setIsLoading(true);
      const currentSession = await authClient.getSession();
      setSession(currentSession);
      toast.success("Session retrieved successfully");
    } catch (error) {
      console.error("Get session error:", error);
      toast.error("Failed to get session");
    } finally {
      setIsLoading(false);
    }
  };

  const testSignOut = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut();
      setSession(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testGetSession} disabled={isLoading}>
            Get Session
          </Button>
          <Button onClick={testSignOut} disabled={isLoading} variant="outline">
            Sign Out
          </Button>
        </div>
        
        {session && (
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Current Session:</h4>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 