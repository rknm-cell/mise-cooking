
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { 
  getAllRecipes, 
  getRecipeById, 
  getBookmarks, 
  saveBookmark, 
  removeBookmark, 
  isBookmarked
} from "~/server/db/queries";

export const recipeRouter = createTRPCRouter({
  // Recipe queries

  getAllRecipes: publicProcedure.query(async () => {
    const allRecipes = await getAllRecipes();
    return allRecipes;
  }),

  getRecipe: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const recipe = await getRecipeById(input)
    return recipe;
  }),

  // Bookmark queries
  getBookmarks: protectedProcedure.input(z.string()).query(async (opts) => {
    const { input: userId } = opts;
    const bookmarks = await getBookmarks(userId);
    return bookmarks;
  }),

  saveBookmark: protectedProcedure
    .input(z.object({
      userId: z.string(),
      recipeId: z.string(),
    }))
    .mutation(async (opts) => {
      const { userId, recipeId } = opts.input;
      const result = await saveBookmark(userId, recipeId);
      return result;
    }),

  removeBookmark: protectedProcedure
    .input(z.object({
      userId: z.string(),
      recipeId: z.string(),
    }))
    .mutation(async (opts) => {
      const { userId, recipeId } = opts.input;
      const result = await removeBookmark(userId, recipeId);
      return result;
    }),

  isBookmarked: protectedProcedure
    .input(z.object({
      userId: z.string(),
      recipeId: z.string(),
    }))
    .query(async (opts) => {
      const { userId, recipeId } = opts.input;
      const result = await isBookmarked(userId, recipeId);
      return result;
    }),

});
