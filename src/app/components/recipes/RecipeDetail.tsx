import React from "react";
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
  imageUrl?: string;
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
  } = recipe;

  function handleInstructions(instructions: string[]) {
    return instructions.map((instruction, index) => {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
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
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="flex items-start gap-3 text-white font-body py-2 border-b border-[#fcf45a]/20 last:border-0"
        >
          <span className="flex-1">{ingredient}</span>
        </motion.div>
      );
    });
  }

  return (
    <motion.div layoutId={`recipe-card-${id}`} className="w-full">
      <Card className="w-full bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean-lg glow-ocean overflow-hidden">
        {imageUrl && (
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#428a93] via-[#428a93]/50 to-transparent" />
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
            transition={{ duration: 0.4 }}
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
  );
};
export default RecipeDetail;
