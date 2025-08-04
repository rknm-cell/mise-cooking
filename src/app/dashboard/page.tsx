"use client";

import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { User, LogOut, ChefHat, Bookmark, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export default function Dashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentSession = await authClient.getSession();
      setSession(currentSession);
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      toast.success("Signed out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Please sign in to access the dashboard.
            </p>
            <div className="flex gap-2">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid gap-6">
        {/* Welcome Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Welcome back, {session.user.name}!
                  </CardTitle>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/generate">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <ChefHat className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Generate Recipe</h3>
                    <p className="text-sm text-muted-foreground">
                      Create new recipes with AI
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/recipes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Bookmark className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Browse Recipes</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore all recipes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shopping">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Shopping Lists</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your shopping lists
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Auth Test Section */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Session Info</h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Test Actions</h4>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    onClick={() => toast.success("Auth working!")}
                  >
                    Test Toast
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => checkAuth()}
                  >
                    Refresh Session
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}