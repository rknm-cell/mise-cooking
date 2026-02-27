"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Users,
  Pause,
  Play,
  X,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { Recipe } from "~/server/db/schema";

interface CookingSessionProps {
  recipe: Recipe;
  sessionId: string;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onAbandon?: () => void;
  isPaused?: boolean;
}

export function CookingSession({
  recipe,
  sessionId,
  initialStep = 0,
  onStepChange,
  onComplete,
  onPause,
  onResume,
  onAbandon,
  isPaused = false,
}: CookingSessionProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );
  const [showIngredients, setShowIngredients] = useState(true);

  const totalSteps = recipe.instructions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const springBouncy = {
    type: "spring" as const,
    stiffness: 280,
    damping: 40,
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Session Header */}
      <Card className="bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-[#fcf45a] text-2xl sm:text-3xl font-body-bold mb-2">
                {recipe.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-white/90">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#fcf45a]" />
                  <span className="text-sm font-body">{recipe.totalTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#fcf45a]" />
                  <span className="text-sm font-body">
                    {recipe.servings} servings
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isPaused ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={onResume}
                  className="bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 font-body-semibold"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onPause}
                  className="border-[#fcf45a]/50 text-[#fcf45a] hover:bg-[#fcf45a]/10 font-body-semibold"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onAbandon}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-body-semibold"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/90 font-body-medium">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-[#fcf45a] font-body-semibold">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-[#1d7b86]/50 [&>div]:bg-[#fcf45a]"
            />
          </div>

          {/* Ingredients Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowIngredients(!showIngredients)}
            className="w-full border-[#fcf45a]/50 text-[#fcf45a] hover:bg-[#fcf45a]/10 font-body-semibold"
          >
            {showIngredients ? "Hide" : "Show"} Ingredients (
            {checkedIngredients.size}/{recipe.ingredients.length})
          </Button>

          {/* Ingredients List */}
          <AnimatePresence>
            {showIngredients && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 bg-[#1d7b86]/30 rounded-lg p-4 texture-grain shadow-ocean max-h-64 overflow-y-auto">
                  {recipe.ingredients.map((ingredient, index) => {
                    const isChecked = checkedIngredients.has(index);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.03,
                          ...springBouncy,
                        }}
                        className={cn(
                          "flex items-start gap-3 text-white font-body py-2 border-b border-[#fcf45a]/20 last:border-0 transition-opacity duration-200",
                          isChecked && "opacity-50"
                        )}
                      >
                        <motion.button
                          type="button"
                          onClick={() => toggleIngredient(index)}
                          className="shrink-0 w-5 h-5 rounded border-2 border-[#fcf45a] flex items-center justify-center bg-transparent focus:outline-none focus:ring-2 focus:ring-[#fcf45a] focus:ring-offset-2 focus:ring-offset-[#428a93]"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={
                            isChecked
                              ? `Uncheck ${ingredient}`
                              : `Check ${ingredient}`
                          }
                        >
                          {isChecked && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                              }}
                              className="w-3 h-3 text-[#fcf45a]"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="2,6 5,9 10,3" />
                            </motion.svg>
                          )}
                        </motion.button>
                        <span className={cn("flex-1 text-sm", isChecked && "line-through")}>
                          {ingredient}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Current Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ...springBouncy }}
        >
          <Card className="bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-[#fcf45a] text-[#1d7b86] font-body-bold text-lg px-4 py-1 border-0">
                  Step {currentStep + 1}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-lg sm:text-xl font-body leading-relaxed"
              >
                {recipe.instructions[currentStep]}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstStep}
          variant="outline"
          size="lg"
          className={cn(
            "border-[#fcf45a]/50 text-[#fcf45a] hover:bg-[#fcf45a]/10 font-body-semibold",
            isFirstStep && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Previous
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          size="lg"
          className={cn(
            "bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 font-body-semibold",
            isLastStep && "bg-green-500 hover:bg-green-600 text-white"
          )}
        >
          {isLastStep ? (
            <>
              <CheckCircle2 className="h-5 w-5 mr-1" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
