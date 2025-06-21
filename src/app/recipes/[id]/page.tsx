import React from "react";
import RecipeDetail from "~/app/components/recipes/RecipeDetail";
import { getRecipeById } from "~/server/db/queries";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  console.log(id);
  const recipe = await api.recipe.getRecipe(id);

  console.log("recipe", recipe);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] items-center h-dvh flex flex-col ">
      <RecipeDetail recipe={recipe} />;
    </div>
  );
}
