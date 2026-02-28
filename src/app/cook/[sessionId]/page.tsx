"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { CookingSession } from "~/app/components/recipes/CookingSession";
import { Loader2, ChefHat, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useAuth } from "~/app/components/auth/AuthContext";

let updateTimeout: NodeJS.Timeout | null = null;

export default function CookingSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { userId, isAuthenticated, isLoading: isLoadingAuth } = useAuth();

  // Resolve params
  useEffect(() => {
    params.then((resolvedParams) => {
      setSessionId(resolvedParams.sessionId);
    });
  }, [params]);

  // Redirect if not authenticated - DISABLED FOR DEBUGGING
  // useEffect(() => {
  //   if (!isLoadingAuth && !isAuthenticated && sessionId) {
  //     router.push("/login?redirect=/cook/" + sessionId);
  //   }
  // }, [isLoadingAuth, isAuthenticated, sessionId, router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
    };
  }, []);

  // Fetch cooking session (which includes recipe data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    data: cookingSession,
    isLoading: isLoadingSession,
    error,
  } = api.cookingSession.getById.useQuery(sessionId!, {
    enabled: !!sessionId,
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    staleTime: 30000, // Consider data fresh for 30 seconds
  }) as any;

  const updateSessionMutation = api.cookingSession.update.useMutation();

  const pauseSessionMutation = api.cookingSession.pause.useMutation();
  const resumeSessionMutation = api.cookingSession.resume.useMutation();
  const completeSessionMutation = api.cookingSession.complete.useMutation({
    onSuccess: () => {
      if (cookingSession?.recipe?.id) {
        router.push(`/recipes/${cookingSession.recipe.id}?completed=true`);
      } else {
        router.push("/recipes");
      }
    },
  });
  const abandonSessionMutation = api.cookingSession.abandon.useMutation({
    onSuccess: () => {
      if (cookingSession?.recipe?.id) {
        router.push(`/recipes/${cookingSession.recipe.id}`);
      } else {
        router.push("/recipes");
      }
    },
  });

  const handleStepChange = (step: number) => {
    if (!sessionId) return;

    // Clear any pending updates
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    // Debounce the mutation to avoid excessive rerenders
    updateTimeout = setTimeout(() => {
      updateSessionMutation.mutate({
        sessionId,
        currentStep: step,
        lastActiveAt: new Date(),
      });
    }, 300);
  };

  const handlePause = () => {
    if (!sessionId) return;
    pauseSessionMutation.mutate(sessionId);
  };

  const handleResume = () => {
    if (!sessionId) return;
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

  // Loading state
  if (isLoadingAuth || !sessionId || isLoadingSession) {
    return (
      <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-[#fcf45a] animate-spin mx-auto" />
          <p className="text-white font-body text-lg">
            Loading cooking session...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <ChefHat className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-white font-display text-2xl">
            Error Loading Session
          </h1>
          <p className="text-white/70 font-body">{error.message}</p>
          <Button
            asChild
            className="bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 font-body-semibold"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Session not found
  if (!cookingSession) {
    return (
      <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#fcf45a]/20 flex items-center justify-center mx-auto">
            <ChefHat className="h-8 w-8 text-[#fcf45a]" />
          </div>
          <h1 className="text-white font-display text-2xl">
            Session Not Found
          </h1>
          <p className="text-white/70 font-body">
            We couldn't find the cooking session you're looking for.
          </p>
          <Button
            asChild
            className="bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 font-body-semibold"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Recipe not found in session
  if (!cookingSession.recipe) {
    return (
      <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <ChefHat className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-white font-display text-2xl">
            Recipe Not Found
          </h1>
          <p className="text-white/70 font-body">
            The recipe for this session is no longer available.
          </p>
          <Button
            asChild
            className="bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 font-body-semibold"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Not authenticated - DISABLED FOR DEBUGGING
  // if (!isAuthenticated || !userId) {
  //   return (
  //     <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] min-h-screen flex items-center justify-center p-4">
  //       <div className="text-center space-y-4">
  //         <Loader2 className="h-12 w-12 text-[#fcf45a] animate-spin mx-auto" />
  //         <p className="text-white font-body">Redirecting to login...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const recipe = cookingSession.recipe;
  const isPaused = cookingSession.status === "paused";

  // Main cooking session view
  return (
    <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#fcf45a]/50 text-[#fcf45a] hover:bg-[#fcf45a]/10 font-body-semibold"
          >
            <Link href={`/recipes/${recipe.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipe
            </Link>
          </Button>

          <div className="flex items-center gap-2 text-white/70">
            <ChefHat className="h-5 w-5 text-[#fcf45a]" />
            <span className="text-sm font-body hidden sm:inline">
              Cooking Mode
            </span>
          </div>
        </div>

        {/* Cooking Session */}
        <CookingSession
          recipe={recipe}
          sessionId={sessionId}
          initialStep={cookingSession.currentStep}
          onStepChange={handleStepChange}
          onComplete={handleComplete}
          onPause={handlePause}
          onResume={handleResume}
          onAbandon={handleAbandon}
          isPaused={isPaused}
        />
      </div>
    </div>
  );
}
