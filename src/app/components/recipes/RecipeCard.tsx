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
            <div className="relative h-48 overflow-hidden">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-gradient(to top, #1d7b86/80, transparent)" />
            </div>
          )}
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
          {/* Dotted border on top of image/content - same dot length on all sides */}
          
        </Card>
      </motion.div>
    </Link>
  );
};
