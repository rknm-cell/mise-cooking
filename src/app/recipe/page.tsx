"use client";
import { api } from "~/trpc/react";
import { RecipeCard } from "../components/recipes/RecipeCard";

export default function Page() {
  const { data: recipes } = api.recipe.getAllRecipes.useQuery();

  const recipeList = recipes ?? [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipes {recipeList.length}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recipeList.length > 0 ? (
          recipeList.map((recipe, index) => (
            <RecipeCard key={recipe.id || index} recipe={recipe} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No recipes found</p>
        )}
      </div>
    </div>
  );
}
