import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { motion } from "motion/react";
import { Clock, Users, Utensils, ListChecks, Info } from "lucide-react";

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
  } = recipe;

  function handleInstructions(instructions: string[]) {
    return instructions.map((instruction, index) => {
      return (
        <div key={index} className="flex gap-3 text-white">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#fcf45a] text-[#1d7b86] font-semibold text-sm flex items-center justify-center">
            {index + 1}
          </span>
          <span className="flex-1">{instruction}</span>
        </div>
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
              className="px-3 py-1 rounded-full bg-[#fcf45a]/20 text-[#fcf45a] text-xs font-medium"
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
      return (
        <div
          key={index}
          className="flex items-start gap-3 text-white py-2 border-b border-[#fcf45a]/20 last:border-0"
        >
          <span className="flex-1">{ingredient}</span>
        </div>
      );
    });
  }

  return (
    <motion.div layoutId={`recipe-card-${id}`} className="w-full">
      <Card className="w-full bg-[#428a93] border-[#fcf45a]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#fcf45a] text-2xl sm:text-3xl font-bold mb-2">
            {name}
          </CardTitle>
          <CardDescription className="text-white/90 text-base sm:text-lg">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Recipe Info */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#fcf45a]/20">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#fcf45a]" />
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wide">
                  Total Time
                </p>
                <p className="text-white font-semibold">{totalTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#fcf45a]" />
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wide">
                  Servings
                </p>
                <p className="text-white font-semibold">{servings}</p>
              </div>
            </div>
          </div>

          {/* Nutrition Info */}
          {nutrition && nutrition.length > 0 && (
            <div className="pb-4 border-b border-[#fcf45a]/20">
              <h3 className="text-[#fcf45a] font-semibold text-lg mb-3 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Nutrition
              </h3>
              {handleNutrition(nutrition)}
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="text-[#fcf45a] font-semibold text-lg mb-4 flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Ingredients
            </h3>
            <div className="space-y-1 bg-[#1d7b86]/30 rounded-lg p-4">
              {handleIngredients(ingredients)}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-[#fcf45a] font-semibold text-lg mb-4 flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Instructions
            </h3>
            <div className="space-y-4 bg-[#1d7b86]/30 rounded-lg p-4">
              {handleInstructions(instructions)}
            </div>
          </div>
        </CardContent>

        {/* Storage Info */}
        {storage && (
          <CardFooter className="pt-4 border-t border-[#fcf45a]/20">
            <div className="flex items-start gap-3 w-full">
              <Info className="h-5 w-5 text-[#fcf45a] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#fcf45a] font-semibold text-sm mb-1">
                  Storage
                </p>
                <p className="text-white/90 text-sm">{storage}</p>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};
export default RecipeDetail;
