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
import { cn } from "~/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  featured?: boolean;
}

export const RecipeCard = ({ recipe, featured = false }: RecipeCardProps) => {
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
        whileHover={{
          rotate: featured ? 0 : 1,
          scale: 1.02,
          transition: { type: "spring", stiffness: 300 }
        }}
      >
        <Card className={cn(
          "h-full cursor-pointer bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean transition-all duration-300 hover:shadow-yellow-lg hover:glow-yellow hover:border-[#fcf45a]",
          featured && "border-2 border-[#fcf45a] shadow-yellow-lg"
        )}>
          <CardHeader className={cn("space-y-3", featured && "p-6 sm:p-8")}>
            <div className="flex items-start gap-3">

              <div className="flex-1 min-w-0">
                <CardTitle className={cn(
                  "text-[#fcf45a] font-body line-clamp-2 mb-2",
                  featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl"
                )}>
                  {name}
                </CardTitle>
                <CardDescription className={cn(
                  "text-white/90 font-body",
                  featured ? "text-base sm:text-lg line-clamp-4" : "text-sm sm:text-base line-clamp-3"
                )}>
                  {description}
                </CardDescription>
              </div>
            </div>
            {totalTime && (
              <div className="flex items-center gap-2 pt-2 border-t border-[#fcf45a]/20">
                <Clock className={cn(
                  "text-[#fcf45a] shrink-0",
                  featured ? "h-5 w-5" : "h-4 w-4"
                )} />
                <span className={cn(
                  "text-[#fcf45a] font-body-semibold",
                  featured ? "text-sm sm:text-base" : "text-xs"
                )}>
                  {totalTime}
                </span>
              </div>
            )}
            {featured && (
              <div className="absolute top-3 right-3 bg-[#fcf45a] text-[#1d7b86] px-3 py-1 rounded-full text-xs font-body-bold shadow-lg transform rotate-3">
                Featured
              </div>
            )}
          </CardHeader>
        </Card>
      </motion.div>
    </Link>
  );
};
