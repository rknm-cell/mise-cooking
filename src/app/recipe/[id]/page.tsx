import React from "react";
import RecipeDetail from "~/app/components/recipes/RecipeDetail";
import { getRecipeById } from "~/server/db/queries";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  console.log(id)
  const {data: recipe} = api.recipe.getRecipe.useQuery(id);
  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  return <RecipeDetail recipe={recipe} />;
}
