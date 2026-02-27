"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CookingSession } from "./CookingSession";
import { api } from "~/trpc/react";
import type { Recipe } from "~/server/db/schema";
import { Loader2 } from "lucide-react";

interface CookingSessionContainerProps {
  recipe: Recipe;
  userId: string;
  sessionId?: string;
}

export function CookingSessionContainer({
  recipe,
  userId,
  sessionId: existingSessionId,
}: CookingSessionContainerProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(
    existingSessionId || null
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get or create session
  const { data: existingSession, isLoading: isLoadingSession } =
    api.cookingSession.getActive.useQuery(
      {
        userId,
        recipeId: recipe.id,
      },
      {
        enabled: !existingSessionId,
      }
    );

  const createSessionMutation = api.cookingSession.create.useMutation({
    onSuccess: (data) => {
      if (data.session) {
        setSessionId(data.session.id);
        setCurrentStep(data.session.currentStep);
        setIsPaused(data.session.status === "paused");
        setIsInitialized(true);
      }
    },
  });

  const updateSessionMutation = api.cookingSession.update.useMutation();
  const pauseSessionMutation = api.cookingSession.pause.useMutation();
  const resumeSessionMutation = api.cookingSession.resume.useMutation();
  const completeSessionMutation = api.cookingSession.complete.useMutation({
    onSuccess: () => {
      router.push(`/recipes/${recipe.id}?completed=true`);
    },
  });
  const abandonSessionMutation = api.cookingSession.abandon.useMutation({
    onSuccess: () => {
      router.push(`/recipes/${recipe.id}`);
    },
  });

  // Initialize session
  useEffect(() => {
    if (isInitialized) return;

    if (existingSessionId) {
      // Using provided session ID
      setSessionId(existingSessionId);
      setIsInitialized(true);
    } else if (existingSession) {
      // Found existing active session
      setSessionId(existingSession.id);
      setCurrentStep(existingSession.currentStep);
      setIsPaused(existingSession.status === "paused");
      setIsInitialized(true);
    } else if (!isLoadingSession && !existingSession) {
      // Create new session
      createSessionMutation.mutate({
        userId,
        recipeId: recipe.id,
      });
    }
  }, [
    existingSessionId,
    existingSession,
    isLoadingSession,
    userId,
    recipe.id,
    createSessionMutation,
    isInitialized,
  ]);

  // Auto-save current step (debounced)
  useEffect(() => {
    if (!sessionId || !isInitialized) return;

    const timeoutId = setTimeout(() => {
      updateSessionMutation.mutate({
        sessionId,
        currentStep,
        lastActiveAt: new Date(),
      });
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, sessionId, isInitialized]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handlePause = () => {
    if (!sessionId) return;
    setIsPaused(true);
    pauseSessionMutation.mutate(sessionId);
  };

  const handleResume = () => {
    if (!sessionId) return;
    setIsPaused(false);
    resumeSessionMutation.mutate(sessionId);
  };

  const handleComplete = () => {
    if (!sessionId) return;
    completeSessionMutation.mutate(sessionId);
  };

  const handleAbandon = () => {
    if (!sessionId) return;
    abandonSessionMutation.mutate(sessionId);
  };

  // Show loading state while initializing
  if (!isInitialized || !sessionId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-[#fcf45a] animate-spin mx-auto" />
          <p className="text-white font-body">Starting your cooking session...</p>
        </div>
      </div>
    );
  }

  return (
    <CookingSession
      recipe={recipe}
      sessionId={sessionId}
      initialStep={currentStep}
      onStepChange={handleStepChange}
      onComplete={handleComplete}
      onPause={handlePause}
      onResume={handleResume}
      onAbandon={handleAbandon}
      isPaused={isPaused}
    />
  );
}
