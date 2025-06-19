
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAllRecipes, getRecipeById } from "~/server/db/queries";

export const recipeRouter = createTRPCRouter({
  getAllRecipes: publicProcedure.query(async () => {
    const allRecipes = await getAllRecipes();
    return allRecipes;
  }),
  getRecipe: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const recipe = await getRecipeById(input)
    return recipe;
  }),
});
