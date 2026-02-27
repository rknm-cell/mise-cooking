"use client";

import { motion } from "motion/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import {
  Clock,
  ChefHat,
  Play,
  Trash2,
  Calendar,
} from "lucide-react";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface ActiveSessionsProps {
  userId: string;
}

export function ActiveSessions({ userId }: ActiveSessionsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sessions, isLoading, refetch } = api.cookingSession.getUserSessions.useQuery({
    userId,
    status: undefined, // Get all sessions
  }) as any;

  const deleteSessionMutation = api.cookingSession.delete.useMutation({
    onSuccess: () => {
      setDeletingId(null);
      refetch();
    },
  });

  const handleDelete = (sessionId: string) => {
    setDeletingId(sessionId);
    deleteSessionMutation.mutate(sessionId);
  };

  // Filter for active and paused sessions only
  const activeSessions =
    sessions?.filter(
      (s) => s.status === "active" || s.status === "paused"
    ) || [];

  if (isLoading) {
    return (
      <Card className="bg-[#428a93] border-[#fcf45a] texture-paper">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-white font-body">
              Loading sessions...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeSessions.length === 0) {
    return (
      <Card className="bg-[#428a93] border-[#fcf45a] texture-paper">
        <CardHeader>
          <CardTitle className="text-[#fcf45a] font-body-bold flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Active Cooking Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 text-sm font-body">
            No active cooking sessions. Start cooking a recipe to see it here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean-lg">
      <CardHeader>
        <CardTitle className="text-[#fcf45a] font-body-bold flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Active Cooking Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSessions.map((session, index) => {
          const recipe = session.recipe;
          if (!recipe) return null;

          const progress =
            ((session.currentStep + 1) / recipe.instructions.length) * 100;
          const isPaused = session.status === "paused";

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#1d7b86] border-[#fcf45a]/30 hover:border-[#fcf45a] transition-colors">
                <CardContent className="p-4 space-y-3">
                  {/* Recipe Name and Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-white font-body-bold text-lg mb-1">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-body">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(session.lastActiveAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {new Date(session.lastActiveAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "font-body-semibold border-0",
                        isPaused
                          ? "bg-orange-500 text-white"
                          : "bg-green-500 text-white"
                      )}
                    >
                      {isPaused ? "Paused" : "Active"}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/90 font-body-medium">
                        Step {session.currentStep + 1} of{" "}
                        {recipe.instructions.length}
                      </span>
                      <span className="text-[#fcf45a] font-body-semibold">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2 bg-[#428a93]/50 [&>div]:bg-[#fcf45a]"
                    />
                  </div>

                  {/* Current Step Preview */}
                  <p className="text-white/80 text-sm font-body line-clamp-2 italic">
                    "{recipe.instructions[session.currentStep]}"
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 font-body-semibold"
                    >
                      <Link href={`/recipes/${recipe.id}/cook?session=${session.id}`}>
                        <Play className="h-4 w-4 mr-1" />
                        {isPaused ? "Resume" : "Continue"} Cooking
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(session.id)}
                      disabled={deletingId === session.id}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-body-semibold"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
