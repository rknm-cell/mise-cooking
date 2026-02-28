"use client";

import { motion } from "motion/react";
import { Bookmark } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { useBookmarkContext } from "./BookmarkContext";
import { useAuth } from "../auth/AuthContext";

interface BookmarkButtonProps {
  recipeId: string;
  className?: string;
  size?: number;
  variant?: "default" | "large";
}

export const BookmarkButton = ({
  recipeId,
  className,
  size = 20,
  variant = "default",
}: BookmarkButtonProps) => {
  const { userId, isAuthenticated } = useAuth();

  const utils = api.useUtils();
  const { bookmarkIds, isLoaded: contextLoaded } = useBookmarkContext();

  // Only run the per-item query when there's no provider (e.g. detail page)
  const { data: queriedIsBookmarked } = api.recipe.isBookmarked.useQuery(
    { userId: userId!, recipeId },
    { enabled: !!userId && !contextLoaded },
  );

  const bookmarked = contextLoaded
    ? bookmarkIds.has(recipeId)
    : (queriedIsBookmarked ?? false);

  const saveBookmark = api.recipe.saveBookmark.useMutation({
    onSuccess: () => {
      utils.recipe.isBookmarked.invalidate({ userId: userId!, recipeId });
      utils.recipe.getBookmarkIds.invalidate(userId!);
      utils.recipe.getBookmarks.invalidate(userId!);
      utils.recipe.getBookmarkedRecipes.invalidate(userId!);
      toast.success("Recipe bookmarked!");
    },
    onError: (error) => {
      console.error("Error saving bookmark:", error);
      toast.error("Failed to bookmark recipe");
    },
  });

  const removeBookmark = api.recipe.removeBookmark.useMutation({
    onSuccess: () => {
      utils.recipe.isBookmarked.invalidate({ userId: userId!, recipeId });
      utils.recipe.getBookmarkIds.invalidate(userId!);
      utils.recipe.getBookmarks.invalidate(userId!);
      utils.recipe.getBookmarkedRecipes.invalidate(userId!);
      toast.success("Bookmark removed");
    },
    onError: (error) => {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    },
  });

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark recipes");
      return;
    }

    if (!userId) return;

    if (bookmarked) {
      removeBookmark.mutate({ userId, recipeId });
    } else {
      saveBookmark.mutate({ userId, recipeId });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const isPending = saveBookmark.isPending || removeBookmark.isPending;

  return (
    <motion.button
      type="button"
      onClick={handleToggleBookmark}
      disabled={isPending}
      className={cn(
        "group relative p-2 rounded-full transition-all duration-200",
        variant === "default" && "hover:bg-[#fcf45a]/10",
        variant === "large" && "hover:bg-[#fcf45a]/20",
        isPending && "opacity-50 cursor-not-allowed",
        className,
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <motion.div
        initial={false}
        animate={{
          scale: bookmarked ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Bookmark
          className={cn(
            "transition-all duration-200",
            bookmarked
              ? "fill-[#fcf45a] text-[#fcf45a]"
              : "text-[#fcf45a] group-hover:text-[#fcf45a]/80",
          )}
          size={size}
          strokeWidth={2}
        />
      </motion.div>
    </motion.button>
  );
};
