"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { DietaryStep } from "./steps/DietaryStep";
import { CuisineStep } from "./steps/CuisineStep";
import { SkillStep } from "./steps/SkillStep";
import { EquipmentStep } from "./steps/EquipmentStep";
import { Loader2 } from "lucide-react";

export type OnboardingData = {
  dietaryRestrictions: string[];
  allergies: string[];
  favoriteCuisines: string[];
  spiceTolerance: string;
  skillLevel: string;
  maxCookingTime?: number;
  preferredServingSize: number;
  availableEquipment: string[];
  mealPrepFriendly: boolean;
  quickMealsOnly: boolean;
};

const TOTAL_STEPS = 4;

export function OnboardingFlow({ userId }: { userId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    dietaryRestrictions: [],
    allergies: [],
    favoriteCuisines: [],
    spiceTolerance: "medium",
    skillLevel: "beginner",
    preferredServingSize: 2,
    availableEquipment: [],
    mealPrepFriendly: false,
    quickMealsOnly: false,
  });

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
          onboardingCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      toast.success("Welcome! Your preferences have been saved.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Mise!</CardTitle>
          <CardDescription>
            Let's personalize your cooking experience. Step {currentStep} of {TOTAL_STEPS}
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <DietaryStep
              dietaryRestrictions={formData.dietaryRestrictions}
              allergies={formData.allergies}
              onUpdate={updateFormData}
            />
          )}

          {currentStep === 2 && (
            <CuisineStep
              favoriteCuisines={formData.favoriteCuisines}
              spiceTolerance={formData.spiceTolerance}
              onUpdate={updateFormData}
            />
          )}

          {currentStep === 3 && (
            <SkillStep
              skillLevel={formData.skillLevel}
              maxCookingTime={formData.maxCookingTime}
              preferredServingSize={formData.preferredServingSize}
              mealPrepFriendly={formData.mealPrepFriendly}
              quickMealsOnly={formData.quickMealsOnly}
              onUpdate={updateFormData}
            />
          )}

          {currentStep === 4 && (
            <EquipmentStep
              availableEquipment={formData.availableEquipment}
              onUpdate={updateFormData}
            />
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
