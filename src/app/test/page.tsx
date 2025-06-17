"use client";

import { useState } from "react";
import RecipeDetail from "../components/RecipeDetail";
import {recipeObject, type  RecipeSchema } from "~/server/db/schema";
import { z } from "zod";



export default function Page() {
  const [generation, setGeneration] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [recipeRequest, setRecipeRequest] = useState("");
  const [input, setInput] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    }

  const handleGenerateRecipe = (generation: RecipeSchema) => {
    return <RecipeDetail recipe={generation} />;
  };
  async function handleSubmit() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          prompt: { recipeRequest },
        }),
      });
      await response.json().then((json) => {
        setGeneration(json);
        setIsLoading(false);
      });
    } catch (error) {
      const e = error as Error;
      return {
        success: false,
        message: e.message || "An unknown error occurred.",
      };
    }
  }

  return (
    <div>
        <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Ask about recipes..."
        className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-[hsl(280,100%,70%)] focus:outline-none"
        disabled={isLoading}
        />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="rounded-lg bg-[hsl(280,100%,70%)] px-4 py-2 font-semibold text-white hover:bg-[hsl(280,100%,60%)] focus:ring-2 focus:ring-[hsl(280,100%,70%)] focus:outline-none disabled:opacity-50 disabled:hover:bg-[hsl(280,100%,70%)]"
        >
        Send
      </button>
          </form>

      {isLoading ? "Loading..." : <> </>}
      {generation ? handleGenerateRecipe(generation) : <></>}
    </div>
  );
}
