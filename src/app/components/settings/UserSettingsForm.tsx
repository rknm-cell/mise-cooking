"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DietaryStep } from "../onboarding/steps/DietaryStep";
import { CuisineStep } from "../onboarding/steps/CuisineStep";
import { SkillStep } from "../onboarding/steps/SkillStep";
import { EquipmentStep } from "../onboarding/steps/EquipmentStep";
import { Loader2 } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { UserPreferences } from "~/server/db/schema";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type UserSettingsFormProps = {
  userId: string;
  user: User;
  initialPreferences: UserPreferences | null;
};

export function UserSettingsForm({ userId, user, initialPreferences }: UserSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
  });

  const [preferences, setPreferences] = useState({
    dietaryRestrictions: initialPreferences?.dietaryRestrictions ?? [],
    allergies: initialPreferences?.allergies ?? [],
    favoriteCuisines: initialPreferences?.favoriteCuisines ?? [],
    spiceTolerance: initialPreferences?.spiceTolerance ?? "medium",
    skillLevel: initialPreferences?.skillLevel ?? "beginner",
    maxCookingTime: initialPreferences?.maxCookingTime ?? undefined,
    preferredServingSize: initialPreferences?.preferredServingSize ?? 2,
    availableEquipment: initialPreferences?.availableEquipment ?? [],
    mealPrepFriendly: initialPreferences?.mealPrepFriendly ?? false,
    quickMealsOnly: initialPreferences?.quickMealsOnly ?? false,
  });

  const updatePreferences = (updates: Partial<typeof preferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const handleSavePreferences = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...preferences,
          onboardingCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cooking Preferences</CardTitle>
          <CardDescription>
            Update your dietary restrictions, favorite cuisines, and cooking profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dietary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dietary">Dietary</TabsTrigger>
              <TabsTrigger value="cuisine">Cuisine</TabsTrigger>
              <TabsTrigger value="skill">Skill & Time</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
            </TabsList>

            <TabsContent value="dietary" className="mt-6">
              <DietaryStep
                dietaryRestrictions={preferences.dietaryRestrictions}
                allergies={preferences.allergies}
                onUpdate={updatePreferences}
              />
            </TabsContent>

            <TabsContent value="cuisine" className="mt-6">
              <CuisineStep
                favoriteCuisines={preferences.favoriteCuisines}
                spiceTolerance={preferences.spiceTolerance}
                onUpdate={updatePreferences}
              />
            </TabsContent>

            <TabsContent value="skill" className="mt-6">
              <SkillStep
                skillLevel={preferences.skillLevel}
                maxCookingTime={preferences.maxCookingTime}
                preferredServingSize={preferences.preferredServingSize}
                mealPrepFriendly={preferences.mealPrepFriendly}
                quickMealsOnly={preferences.quickMealsOnly}
                onUpdate={updatePreferences}
              />
            </TabsContent>

            <TabsContent value="equipment" className="mt-6">
              <EquipmentStep
                availableEquipment={preferences.availableEquipment}
                onUpdate={updatePreferences}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSavePreferences} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
