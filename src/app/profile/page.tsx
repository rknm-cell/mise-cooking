"use client";

import { useState, useEffect } from "react";
import { authClient } from "~/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  User, 
  Clock, 
  Bookmark, 
  ShoppingCart, 
  ChefHat,
  LogOut,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

interface CookingHistory {
  recipeId: string;
  recipeName: string;
  cookedAt: string;
  rating?: number;
}

interface ViewedRecipe {
  recipeId: string;
  recipeName: string;
  viewedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cookingHistory, setCookingHistory] = useState<CookingHistory[]>([]);
  const [viewedRecipes, setViewedRecipes] = useState<ViewedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const session = await authClient.getSession();
      
      // Check if we have a valid session with user data
      if ('user' in session) {
        const user = session.user as any; // Type assertion for better-auth compatibility
        setUser({
          id: user.id,
          name: user.name || "User",
          email: user.email || "",
          image: user.image,
          createdAt: user.createdAt || new Date().toISOString(),
        });

        // Load cooking history and viewed recipes
        await Promise.all([
          loadCookingHistory(),
          loadViewedRecipes(),
        ]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCookingHistory = async () => {
    try {
      const response = await fetch("/api/user/cooking-history");
      if (response.ok) {
        const data = await response.json();
        setCookingHistory(data.history || []);
      }
    } catch (error) {
      console.error("Error loading cooking history:", error);
    }
  };

  const loadViewedRecipes = async () => {
    try {
      const response = await fetch("/api/user/viewed-recipes");
      if (response.ok) {
        const data = await response.json();
        setViewedRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error("Error loading viewed recipes:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{cookingHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Recipes Cooked</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Bookmarks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Shopping Lists</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{viewedRecipes.length}</p>
                  <p className="text-sm text-muted-foreground">Recipes Viewed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cooking History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Recent Cooking History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cookingHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No cooking history yet. Start cooking to see your history here!
              </p>
            ) : (
              <div className="space-y-3">
                {cookingHistory.slice(0, 5).map((item) => (
                  <div key={item.recipeId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.recipeName}</p>
                      <p className="text-sm text-muted-foreground">
                        Cooked on {new Date(item.cookedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {item.rating && (
                      <Badge variant="secondary">
                        {item.rating}/5 ⭐
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Viewed Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recently Viewed Recipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewedRecipes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recently viewed recipes. Start browsing to see them here!
              </p>
            ) : (
              <div className="space-y-3">
                {viewedRecipes.slice(0, 5).map((item) => (
                  <div key={item.recipeId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.recipeName}</p>
                      <p className="text-sm text-muted-foreground">
                        Viewed on {new Date(item.viewedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}