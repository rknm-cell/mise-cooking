"use client"
import { api } from "~/trpc/react";
import { RecipeCard } from "../components/recipes/RecipeCard";

export default function Page() {
  const { data: recipes } = api.recipe.getAllRecipes.useQuery();
  
  
  const recipeList = recipes || [];
  
  return (
    <div className="flex flex-grid justify-center ">
      <h1>Recipes ({recipeList.length})</h1>
      {recipeList.length > 0 ? (
        recipeList.map((recipe, index) => (
          <RecipeCard key={recipe.id || index} recipe={recipe} />
        ))
      ) : (
        <p>No recipes found</p>
      )}
    </div>
  );
}
