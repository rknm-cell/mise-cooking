"use client";

import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { User, LogOut, ChefHat, Bookmark, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "~/trpc/react";
import { RecipeCard } from "../components/recipes/RecipeCard";
import { RecipeCardSkeleton } from "../components/recipes/RecipeCardSkeleton";

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

  // Fetch bookmarked recipes (full Recipe[] for display)
  const { data: bookmarkedRecipes, isLoading: bookmarksLoading } = api.recipe.getBookmarkedRecipes.useQuery(
    session?.user.id ?? "",
    { enabled: !!session?.user.id }
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentSession = await authClient.getSession();

      console.log("Dashboard session check:", currentSession);

      // getSession returns { data: { user, session } | null } or error; user is on .data
      const sessionData = currentSession && "data" in currentSession ? currentSession.data : null;
      if (sessionData?.user) {
        const user = sessionData.user;
        setSession({
          user: {
            id: user.id,
            name: user.name || user.email || "User",
            email: user.email,
            image: user.image ?? undefined,
          }
        });
      } else {
        console.warn("No valid session found:", currentSession);
        setSession(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setSession(null);
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

        {/* Bookmarked Recipes Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary" />
                My Bookmarks
              </CardTitle>
              {bookmarkedRecipes && bookmarkedRecipes.length > 0 && (
                <Link href="/recipes">
                  <Button variant="outline" size="sm">
                    View All Recipes
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {bookmarksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} className="scale-90 origin-top">
                    <RecipeCardSkeleton />
                  </div>
                ))}
              </div>
            ) : bookmarkedRecipes && bookmarkedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {bookmarkedRecipes.slice(0, 8).map((recipe) => (
                  <div key={recipe.id} className="scale-90 origin-top">
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start bookmarking your favorite recipes to see them here
                </p>
                <Link href="/recipes">
                  <Button>Browse Recipes</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}