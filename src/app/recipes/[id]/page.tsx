"use client"
import React from "react";
import RecipeDetail from "~/app/components/recipes/RecipeDetail";
import { api } from "~/trpc/react";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
  
  const { data: recipe, isLoading, error } = api.recipe.getRecipe.useQuery(id, {
    // This will use prefetched data if available
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] items-center h-dvh flex flex-col">
        <div className="text-white">Loading recipe...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] items-center h-dvh flex flex-col">
        <div className="text-white">Error loading recipe: {error.message}</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] items-center h-dvh flex flex-col">
        <div className="text-white">Recipe not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1d7b86] to-[#426b70] items-center h-dvh flex flex-col">
      <RecipeDetail recipe={recipe} />
    </div>
  );
}
