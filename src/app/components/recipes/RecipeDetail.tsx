"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Users, Utensils, ListChecks, Info, Printer, Share2 } from "lucide-react";
import { cn } from "~/lib/utils";

interface RecipeDetails {
  id: string;
  name: string;
  description: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  storage: string;
  nutrition: string[];
  totalTime: string;
  imageUrl?: string;
  difficulty?: string;
  cuisine?: string;
  dietaryTags?: string[];
  tip?: string;
}

const RecipeDetail = ({ recipe }: { recipe: RecipeDetails }) => {
  const {
    id,
    name,
    description,
    servings,
    ingredients,
    instructions,
    storage,
    nutrition,
    totalTime,
    imageUrl,
    difficulty,
    cuisine,
    dietaryTags,
    tip,
  } = recipe;

  const chefTip = tip ?? "Let ingredients come to room temperature when the recipe allows—it improves texture and flavor.";

  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const springBouncy = { type: "spring" as const, stiffness: 280, damping: 40 };

  function handleInstructions(instructions: string[]) {
    return instructions.map((instruction, index) => {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, ...springBouncy }}
          className="flex gap-3 text-white font-body"
        >
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#fcf45a] text-[#1d7b86] font-semibold text-sm flex items-center justify-center">
            {index + 1}
          </span>
          <span className="flex-1">{instruction}</span>
        </motion.div>
      );
    });
  }

  function handleNutrition(nutrients: string[]) {
    if (!nutrients || nutrients.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {nutrients.map((nutrient, index) => {
          return (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-[#fcf45a]/20 text-[#fcf45a] text-xs font-body-medium"
            >
              {nutrient}
            </span>
          );
        })}
      </div>
    );
  }

  function handleIngredients(ingredients: string[]) {
    return ingredients.map((ingredient, index) => {
      const isChecked = checkedIngredients.has(index);
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, ...springBouncy }}
          className={cn(
            "flex items-start gap-3 text-white font-body py-2 border-b border-[#fcf45a]/20 last:border-0 transition-opacity duration-200",
            isChecked && "opacity-50"
          )}
          whileTap={{ scale: 0.98 }}
        >
          <motion.button
            type="button"
            onClick={() => toggleIngredient(index)}
            className="shrink-0 w-5 h-5 rounded border-2 border-[#fcf45a] flex items-center justify-center bg-transparent focus:outline-none focus:ring-2 focus:ring-[#fcf45a] focus:ring-offset-2 focus:ring-offset-[#428a93]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isChecked ? `Uncheck ${ingredient}` : `Check ${ingredient}`}
          >
            {isChecked && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
          <span className={cn("flex-1", isChecked && "line-through")}>{ingredient}</span>
        </motion.div>
      );
    });
  }

  return (
    <>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 z-50 bg-[#fcf45a] text-[#1d7b86] px-4 py-2 rounded-lg shadow-lg font-body-semibold flex items-center gap-2"
          >
            <span className="text-lg">✓</span>
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div layoutId={`recipe-card-${id}`} className="w-full">
      <Card className={cn(
        "w-full bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean-lg glow-ocean overflow-hidden",
        imageUrl && "pt-0"
      )}>
        {imageUrl && (
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#428a93] via-[#428a93]/50 to-transparent" />
            {/* Steam effect - wispy rising steam */}
            <span className="steam-effect" aria-hidden />
            <span className="steam-effect" aria-hidden />
            <span className="steam-effect" aria-hidden />
            <span className="steam-effect" aria-hidden />
            <span className="steam-effect" aria-hidden />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <CardTitle className="text-[#fcf45a] text-3xl sm:text-4xl font-body-bold mb-2">
                {name}
              </CardTitle>
            </div>
          </div>
        )}
        <CardHeader className="pb-4">
          {!imageUrl && (
            <CardTitle className="text-[#fcf45a] text-3xl sm:text-4xl font-body-bold mb-2">
              {name}
            </CardTitle>
          )}
          <CardDescription className="text-white/90 text-base sm:text-lg font-body">
            {description}
          </CardDescription>

          {/* Recipe badges (difficulty, cuisine, dietary) */}
          {(difficulty || cuisine || (dietaryTags && dietaryTags.length > 0)) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {difficulty && (
                <Badge
                  className={cn(
                    "font-body-semibold border-0",
                    difficulty.toLowerCase() === "easy" && "badge-difficulty-easy",
                    difficulty.toLowerCase() === "medium" && "badge-difficulty-medium",
                    difficulty.toLowerCase() === "hard" && "badge-difficulty-hard"
                  )}
                >
                  {difficulty}
                </Badge>
              )}
              {cuisine && (
                <Badge className="badge-cuisine font-body-semibold border-0">
                  {cuisine}
                </Badge>
              )}
              {dietaryTags?.map((tag) => (
                <Badge key={tag} className="badge-dietary font-body-semibold">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Print & Share actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              type="button"
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="group border-[#fcf45a]/50 text-[#fcf45a] hover:bg-[#fcf45a]/10 hover:border-[#fcf45a]"
            >
              <Printer className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Print Recipe
            </Button>
            <Button
              type="button"
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="group border-[#fcf45a]/50 text-[#fcf45a] hover:bg-[#fcf45a]/10 hover:border-[#fcf45a]"
            >
              <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              Share
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Recipe Info */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#fcf45a]/20">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#fcf45a]" />
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wide font-body-medium">
                  Total Time
                </p>
                <p className="text-white font-body-semibold">{totalTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#fcf45a]" />
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wide font-body-medium">
                  Servings
                </p>
                <p className="text-white font-body-semibold">{servings}</p>
              </div>
            </div>
          </div>

          {/* Nutrition Info */}
          {nutrition && nutrition.length > 0 && (
            <div className="pb-4 border-b border-[#fcf45a]/20">
              <h3 className="text-[#fcf45a] font-body-bold text-lg mb-3 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Nutrition
              </h3>
              {handleNutrition(nutrition)}
            </div>
          )}

          {/* Ingredients & Instructions Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 40 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {/* Ingredients Accordion */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <AccordionItem
                  value="ingredients"
                  className="border-[#fcf45a]/20 px-0"
                >
                  <AccordionTrigger className="text-[#fcf45a] font-body-bold text-lg hover:no-underline py-4 [&>svg]:text-[#fcf45a] transition-all duration-200">
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Utensils className="h-5 w-5" />
                      Ingredients
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-1 bg-[#1d7b86]/30 rounded-lg p-4 texture-grain shadow-ocean"
                    >
                      {handleIngredients(ingredients)}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>

              {/* Instructions Accordion */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <AccordionItem
                  value="instructions"
                  className="border-[#fcf45a]/20 px-0"
                >
                  <AccordionTrigger className="text-[#fcf45a] font-body-bold text-lg hover:no-underline py-4 [&>svg]:text-[#fcf45a] transition-all duration-200">
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListChecks className="h-5 w-5" />
                      Instructions
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 bg-[#1d7b86]/30 rounded-lg p-4 texture-grain shadow-ocean"
                    >
                      {handleInstructions(instructions)}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            </Accordion>
          </motion.div>

          {/* Chef's Tip post-it style */}
          <motion.div
            initial={{ opacity: 0, rotate: -3 }}
            animate={{ opacity: 1, rotate: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className="relative mt-6 p-4 bg-[#fcf45a] text-[#1d7b86] rounded-lg shadow-lg transform rotate-1 font-body"
          >
            <div className="absolute -top-2 left-4 w-12 h-5 bg-mise-yellow-600 opacity-50 blur-sm rounded" aria-hidden />
            <p className="font-display text-lg text-[#1d7b86] mb-1">Chef&apos;s Tip</p>
            <p className="text-sm font-body-medium">{chefTip}</p>
          </motion.div>
        </CardContent>

        {/* Storage Info */}
        {storage && (
          <CardFooter className="pt-4 border-t border-[#fcf45a]/20">
            <div className="flex items-start gap-3 w-full">
              <Info className="h-5 w-5 text-[#fcf45a] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#fcf45a] font-body-semibold text-sm mb-1">
                  Storage
                </p>
                <p className="text-white/90 text-sm font-body">{storage}</p>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
    </>
  );
};
export default RecipeDetail;
