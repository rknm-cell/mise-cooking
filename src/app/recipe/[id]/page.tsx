import React from "react";
import RecipeDetail from "~/app/components/RecipeDetail";
import { getRecipeById } from "~/server/db/queries";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const recipe = await getRecipeById(id);
  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  return <RecipeDetail recipe={recipe} />;
}
