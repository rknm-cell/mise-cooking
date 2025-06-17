
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { openai } from "@ai-sdk/openai";
import { generateObject, generateText, streamText } from "ai";
import type { ChatCompletionMessageParam } from "openai/resources.js";
import { nanoid } from "nanoid";
import { saveRecipe } from "~/server/db/queries";
import { recipeObject, type RecipeObject } from "~/server/db/schema";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

//RECIPE GENERATOR
//Unleash later
export async function POST(req: Request) {
  const {prompt}: {prompt: string} = await req.json();
  console.log("prompt: ", prompt)
   const result  = await generateObject({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    model: openai("gpt-4-turbo"),
    system: `You are a professional chef and recipe assistant. When providing recipes, always follow this list: 
               1. Name
               2. Time (prep + cooking)
               3. Servings
               4. Ingredients (with precise measurements)
                 - List all ingredients with their quantities
                 - Include any optional ingredients or substitutions
               5. Instructions
                 - Separate each step
                 - Include specific temperatures, times, and techniques
                 - Add helpful tips or notes where relevant
               6. Storage (if applicable) as storage
               7. Nutrition
               Keep your responses clear, precise, and easy to follow. Include helpful cooking tips and explain any technical terms. If asked about a specific cuisine or dietary requirement, adapt the recipe accordingly.
               `,
    prompt,
    schema: z.object({
      id: z.string(),
      name: z.string(),
      totalTime: z.string(),
      servings: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
      storage: z.string(),
      nutrition: z.array(z.string())
    }),
    
    
  });
  
  const recipe = result.object
  recipe.id = nanoid();
  const {id, name, totalTime, servings, ingredients, instructions, storage, nutrition } = recipe
  
  await saveRecipe({
    id: id,
    name: name,
    totalTime: totalTime,
    servings: servings,
    ingredients: ingredients,
    instructions: instructions,
    storage: storage,
    nutrition: nutrition,
  });
  console.log(recipe)

  return result.toJsonResponse();
}
