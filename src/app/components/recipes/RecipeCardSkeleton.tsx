import { Card, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface RecipeCardSkeletonProps {
  featured?: boolean;
}

export const RecipeCardSkeleton = ({ featured = false }: RecipeCardSkeletonProps) => {
  return (
    <Card className={cn(
      "h-full animate-pulse bg-[#428a93] border-[#fcf45a]/30 texture-paper shadow-ocean overflow-hidden",
      featured && "border-2"
    )}>
      {/* Image placeholder */}
      <div className="relative h-48 bg-[#1d7b86]/40">
        <div className="absolute inset-0 bg-linear-to-t from-[#1d7b86]/80 to-transparent" />
      </div>

      <CardHeader className={cn("space-y-3", featured && "p-6 sm:p-8")}>
        {/* Title skeleton */}
        <div className={cn(
          "bg-[#fcf45a]/20 rounded mb-2",
          featured ? "h-8 w-3/4" : "h-6 w-3/4"
        )} />

        {/* Description skeleton - multiple lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/10 rounded" />
          <div className="h-4 w-5/6 bg-white/10 rounded" />
          {featured && <div className="h-4 w-4/6 bg-white/10 rounded" />}
        </div>

        {/* Time skeleton */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#fcf45a]/20">
          <div className={cn(
            "bg-[#fcf45a]/20 rounded-full",
            featured ? "h-5 w-5" : "h-4 w-4"
          )} />
          <div className={cn(
            "bg-[#fcf45a]/20 rounded",
            featured ? "h-4 w-20" : "h-3 w-16"
          )} />
        </div>
      </CardHeader>
    </Card>
  );
};
