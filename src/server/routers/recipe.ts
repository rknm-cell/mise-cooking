import { router, procedure } from "../trpc";
import { getRecipes } from "../db/queries";

export const recipeRouter = router({
  getRecipes: procedure.query(async () => {
    const recipes = await getRecipes();
    return recipes;
  }),
});
