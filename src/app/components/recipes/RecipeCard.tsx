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
import { Clock, Leaf, CircleDot, Flame } from "lucide-react";
import { cn } from "~/lib/utils";
import { BookmarkButton } from "./BookmarkButton";

/* Floating ingredient doodles for decorative atmosphere */
const FLOATING_DOODLES = [
  (props: React.ComponentProps<typeof Leaf>) => <Leaf {...props} />,
  (props: React.ComponentProps<typeof CircleDot>) => <CircleDot {...props} />,
  (props: React.ComponentProps<typeof Flame>) => <Flame {...props} />,
] as const;

function getDoodleIndex(id: string): number {
  let n = 0;
  for (let i = 0; i < Math.min(id.length, 6); i++) n += id.charCodeAt(i);
  return n % FLOATING_DOODLES.length;
}

function getDoodlePosition(id: string): { top?: string; right?: string; bottom?: string; left?: string; rotate: string } {
  const v = id.charCodeAt(0) % 4;
  if (v === 0) return { top: "-0.5rem", right: "-0.5rem", rotate: "12deg" };
  if (v === 1) return { top: "-0.5rem", left: "-0.5rem", rotate: "-8deg" };
  if (v === 2) return { bottom: "-0.5rem", right: "-0.25rem", rotate: "6deg" };
  return { bottom: "-0.25rem", left: "-0.5rem", rotate: "-10deg" };
}

interface RecipeCardProps {
  recipe: Recipe;
  featured?: boolean;
}

export const RecipeCard = ({ recipe, featured = false }: RecipeCardProps) => {
  const { id, name, totalTime, description, imageUrl } = recipe;
  const utils = api.useUtils();
  const DoodleIcon = FLOATING_DOODLES[getDoodleIndex(id)] ?? FLOATING_DOODLES[0];
  const doodlePos = getDoodlePosition(id);

  const handleMouseEnter = () => {
    utils.recipe.getRecipe.prefetch(id);
  };

  return (
    <Link href={`/recipes/${id}`} prefetch={true}>
      <motion.div
        layoutId={`recipe-card-${id}`}
        onMouseEnter={handleMouseEnter}
        className="relative"
        whileHover={{
          rotate: featured ? 0 : 2,
          scale: 1.03,
          skewX: featured ? 0 : 0.5,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
      
        <Card className={cn(
          "recipe-card-handdrawn cursor-pointer bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean transition-all duration-300 hover:shadow-yellow-lg hover:glow-yellow hover:border-[#fcf45a] overflow-hidden",
          imageUrl && "pt-0",
          featured && "border-2 border-[#fcf45a] shadow-yellow-lg"
        )}>
          {imageUrl && (
            <div className={cn(
              "relative overflow-hidden",
              featured ? "h-40" : "h-32"
            )}>
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-gradient(to top, #1d7b86/80, transparent)" />
            </div>
          )}
          <CardHeader className={cn("space-y-2 relative", featured ? "p-4 sm:p-5" : "p-3 sm:p-4")}>
            {/* Bookmark Button */}
            <div className="absolute top-2 right-2 z-10">
              <BookmarkButton recipeId={id} size={featured ? 20 : 18} />
            </div>

            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0 pr-7">
                <CardTitle className={cn(
                  "text-[#fcf45a] font-body line-clamp-2 mb-1.5",
                  featured ? "text-lg sm:text-xl lg:text-2xl" : "text-base sm:text-lg"
                )}>
                  {name}
                </CardTitle>
                <CardDescription className={cn(
                  "text-white/90 font-body leading-snug",
                  featured ? "text-sm line-clamp-3" : "text-xs sm:text-sm line-clamp-2"
                )}>
                  {description}
                </CardDescription>
              </div>
            </div>
            {totalTime && (
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#fcf45a]/20">
                <Clock className="text-[#fcf45a] shrink-0 h-3.5 w-3.5" />
                <span className={cn(
                  "text-[#fcf45a] font-body-semibold",
                  featured ? "text-xs sm:text-sm" : "text-xs"
                )}>
                  {totalTime}
                </span>
              </div>
            )}
            {featured && (
              <div className="absolute top-2 left-2 bg-[#fcf45a] text-[#1d7b86] px-2 py-0.5 rounded-full text-[10px] font-body-bold shadow-md transform rotate-3">
                Featured
              </div>
            )}
          </CardHeader>
          {/* Dotted border on top of image/content - same dot length on all sides */}
          
        </Card>
      </motion.div>
    </Link>
  );
};
