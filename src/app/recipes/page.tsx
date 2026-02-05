"use client";
import { api } from "~/trpc/react";
import { RecipeCard } from "../components/recipes/RecipeCard";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";

export default function Page() {
  const { data: recipes } = api.recipe.getAllRecipes.useQuery();
  const [search, setSearch] = useState("");
  const utils = api.useUtils();
  
  const recipeList = (recipes ?? []).filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Prefetch all recipe data when the page loads
  useEffect(() => {
    if (recipes) {
      recipes.forEach((recipe) => {
        utils.recipe.getRecipe.prefetch(recipe.id);
      });
    }
  }, [recipes, utils.recipe.getRecipe]);

  return (
    <div className="mx-auto h-screen bg-gradient-to-b from-[#1d7b86] to-[#426b70] p-4 texture-grain pattern-organic">
      <h1 className="mb-6 text-center text-3xl font-bold text-[#fcf45a] font-nanum-pen-script-regular">
        Recipes 
      </h1>
      <SearchBar search={search} setSearch={setSearch} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipeList.length > 0 ? (
          recipeList.map((recipe, index) => (
            <RecipeCard key={recipe.id || index} recipe={recipe} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-700">
            No recipes found
          </p>
        )}
      </div>
    </div>
  );
}
