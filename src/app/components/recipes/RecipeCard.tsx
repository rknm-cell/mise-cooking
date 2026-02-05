import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Recipe } from "~/server/db/schema";
import { motion } from "motion/react";
import { api } from "~/trpc/react";
import { Clock } from "lucide-react";

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const { id, name, totalTime, description } = recipe;
  const utils = api.useUtils();

  const handleMouseEnter = () => {
    // Prefetch the recipe data when hovering over the card
    utils.recipe.getRecipe.prefetch(id);
  };

  return (
    <Link href={`/recipes/${id}`} prefetch={true}>
      <motion.div
        layoutId={`recipe-card-${id}`}
        onMouseEnter={handleMouseEnter}
        className="h-full"
      >
        <Card className="h-full cursor-pointer bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean transition-all duration-300 hover:shadow-yellow-lg hover:glow-yellow hover:border-[#fcf45a] hover:scale-[1.02]">
          <CardHeader className="space-y-3">
            <div className="flex items-start gap-3">
              
              <div className="flex-1 min-w-0">
                <CardTitle className="text-[#fcf45a] text-lg sm:text-xl font-bold line-clamp-2 mb-2">
                  {name}
                </CardTitle>
                <CardDescription className="text-white/90 text-sm sm:text-base line-clamp-3">
                  {description}
                </CardDescription>
              </div>
            </div>
            {totalTime && (
              <div className="flex items-center gap-2 pt-2 border-t border-[#fcf45a]/20">
                <Clock className="h-4 w-4 text-[#fcf45a] shrink-0" />
                <span className="text-[#fcf45a] text-xs font-medium">
                  {totalTime}
                </span>
              </div>
            )}
          </CardHeader>
        </Card>
      </motion.div>
    </Link>
  );
};
