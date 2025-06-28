"use client";
import { api } from "~/trpc/react";
import { RecipeCard } from "../components/recipes/RecipeCard";
import SearchBar from "../components/SearchBar";
import { useState } from "react";

export default function Page() {
  const { data: recipes } = api.recipe.getAllRecipes.useQuery();
  const [search, setSearch] = useState("");
  const recipeList = (recipes ?? []).filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto bg-gradient-to-b from-[#1d7b86] to-[#426b70] p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Recipes {recipeList.length}
      </h1>
      <SearchBar search={search} setSearch={setSearch} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipeList.length > 0 ? (
          recipeList.map((recipe, index) => (
            <RecipeCard key={recipe.id || index} recipe={recipe} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No recipes found
          </p>
        )}
      </div>
    </div>
  );
}
