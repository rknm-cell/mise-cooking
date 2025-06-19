import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAllRecipes } from "~/server/db/queries";

export const recipeRouter = createTRPCRouter({
  getAllRecipes: publicProcedure.query(async () => {
    const allRecipes = await getAllRecipes();
    return allRecipes;
  }),
});
