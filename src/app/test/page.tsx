"use client";

import { useState } from "react";
import RecipeDetail from "../components/RecipeDetail";
import { recipeObject, type RecipeSchema } from "~/server/db/schema";
import { z } from "zod";

export default function Page() {
  const [generation, setGeneration] = useState<RecipeSchema | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [recipeRequest, setRecipeRequest] = useState("");
  const [input, setInput] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleGenerateRecipe = (generation: RecipeSchema) => {
    return <RecipeDetail recipe={generation} />;
  };
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
        }),
      })
      const recipeData: RecipeSchema = await response.json();
      setGeneration(recipeData);
      console.log("recipedata: ", recipeData);
      
    } catch (error) {
        const e = error as Error;
        return {
            success: false,
            message: e.message || "An unknown error occurred.",
        };
    }
    setIsLoading(false);
  }

  return (
    <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-xl bg-zinc-200 p-4">
      <div className="mb-4 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="What do you want?"
            className="flex-1 rounded-lg bg-zinc-500 px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-[hsl(280,100%,70%)] focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-[hsl(136,11%,33%)] px-4 py-2 font-semibold text-white hover:bg-[hsl(280,100%,60%)] focus:ring-2 focus:ring-[hsl(280,100%,70%)] focus:outline-none disabled:opacity-50 disabled:hover:bg-[hsl(280,100%,70%)]"
          >
            Send
          </button>
        </form>

        {isLoading ? "Loading..." : <> </>}
        {generation && <RecipeDetail recipe={generation} />}
      </div>
    </div>
  );
}
