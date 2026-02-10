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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1d7b86] to-[#426b70]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fcf45a]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1d7b86] to-[#426b70] p-4">
        <Card className="w-full max-w-md bg-[#428a93] border-2 border-[#fcf45a]">
          <CardHeader>
            <CardTitle className="text-[#fcf45a]">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80">
              Please sign in to access the dashboard.
            </p>
            <div className="flex gap-2">
              <Link href="/login">
                <Button className="bg-[#fcf45a]/70 text-black hover:bg-[#fcf45a] font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="border-[#fcf45a] text-[#fcf45a] hover:bg-[#fcf45a]/20"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1d7b86] to-[#426b70] texture-grain pattern-organic">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Welcome Header - No card, cleaner hierarchy */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-[#fcf45a] flex items-center justify-center shadow-yellow">
                <User className="h-8 w-8 text-[#1d7b86]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-1 text-white">
                  Welcome back, {session.user.name}!
                </h1>
                <p className="text-white/80 text-lg">{session.user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-[#fcf45a] hover:text-[#fcf45a] hover:bg-[#fcf45a]/20 self-end sm:self-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats - Quick metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#428a93] rounded-2xl p-6 border-2 border-[#fcf45a]/30 shadow-ocean">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-1">Bookmarks</p>
                  <p className="text-4xl font-bold text-[#fcf45a]">{bookmarkedRecipes?.length ?? 0}</p>
                </div>
                <div className="h-14 w-14 rounded-xl bg-[#fcf45a]/20 flex items-center justify-center">
                  <Bookmark className="h-7 w-7 text-[#fcf45a]" />
                </div>
              </div>
            </div>
            <div className="bg-[#428a93] rounded-2xl p-6 border-2 border-[#fcf45a]/30 shadow-ocean">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-1">Total Recipes</p>
                  <p className="text-4xl font-bold text-[#fcf45a]">-</p>
                </div>
                <div className="h-14 w-14 rounded-xl bg-[#fcf45a]/20 flex items-center justify-center">
                  <ChefHat className="h-7 w-7 text-[#fcf45a]" />
                </div>
              </div>
            </div>
            <div className="bg-[#428a93] rounded-2xl p-6 border-2 border-[#fcf45a]/30 shadow-ocean">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-1">Shopping Lists</p>
                  <p className="text-4xl font-bold text-[#fcf45a]">-</p>
                </div>
                <div className="h-14 w-14 rounded-xl bg-[#fcf45a]/20 flex items-center justify-center">
                  <ShoppingCart className="h-7 w-7 text-[#fcf45a]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Primary action stands out */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#fcf45a] font-display">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Action - Generate Recipe */}
            <Link href="/generate" className="md:col-span-2">
              <div className="group relative bg-[#fcf45a]/90 rounded-2xl p-8 cursor-pointer overflow-hidden transition-all hover:shadow-yellow-lg hover:scale-[1.02] border-2 border-[#fcf45a]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#fcf45a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="h-14 w-14 rounded-xl bg-[#1d7b86] flex items-center justify-center shadow-ocean mb-4">
                    <ChefHat className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1d7b86] mb-2">
                    Generate New Recipe
                  </h3>
                  <p className="text-black/80 text-base font-medium">
                    Create personalized recipes with AI based on your preferences, ingredients, and dietary needs
                  </p>
                </div>
              </div>
            </Link>

            {/* Secondary Actions */}
            <div className="grid grid-cols-1 gap-6">
              <Link href="/recipes">
                <div className="group bg-[#428a93] rounded-2xl p-6 cursor-pointer border-2 border-[#fcf45a]/30 hover:border-[#fcf45a] transition-all hover:shadow-ocean">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#fcf45a]/20 flex items-center justify-center group-hover:bg-[#fcf45a]/30 transition-colors">
                      <Bookmark className="h-6 w-6 text-[#fcf45a]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">Browse Recipes</h3>
                      <p className="text-sm text-white/70">
                        Explore all recipes
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/shopping">
                <div className="group bg-[#428a93] rounded-2xl p-6 cursor-pointer border-2 border-[#fcf45a]/30 hover:border-[#fcf45a] transition-all hover:shadow-ocean">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#fcf45a]/20 flex items-center justify-center group-hover:bg-[#fcf45a]/30 transition-colors">
                      <ShoppingCart className="h-6 w-6 text-[#fcf45a]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">Shopping Lists</h3>
                      <p className="text-sm text-white/70">
                        Manage your lists
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bookmarked Recipes Section - Cleaner without card wrapper */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-[#fcf45a] font-display">
              <Bookmark className="h-6 w-6 text-[#fcf45a]" />
              My Bookmarks
            </h2>
            {bookmarkedRecipes && bookmarkedRecipes.length > 0 && (
              <Link href="/recipes">
                <Button
                  variant="outline"
                  className="border-[#fcf45a] text-[#fcf45a] hover:bg-[#fcf45a]/20"
                >
                  View All Recipes
                </Button>
              </Link>
            )}
          </div>

          {bookmarksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, index) => (
                <RecipeCardSkeleton key={index} />
              ))}
            </div>
          ) : bookmarkedRecipes && bookmarkedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarkedRecipes.slice(0, 8).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="bg-[#428a93] rounded-2xl border-2 border-[#fcf45a]/30 p-12 text-center shadow-ocean">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 rounded-2xl bg-[#fcf45a]/20 flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="h-8 w-8 text-[#fcf45a]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">No bookmarks yet</h3>
                <p className="text-white/70 mb-6">
                  Start bookmarking your favorite recipes to see them here
                </p>
                <Link href="/recipes">
                  <Button
                    size="lg"
                    className="bg-[#fcf45a]/70 text-black hover:bg-[#fcf45a] font-semibold"
                  >
                    Browse Recipes
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}