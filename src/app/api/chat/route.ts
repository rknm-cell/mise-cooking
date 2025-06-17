/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { openai } from "@ai-sdk/openai";
import { generateId, streamText } from "ai";
import { uuid } from "drizzle-orm/pg-core";
import type { ChatCompletionMessageParam } from "openai/resources.js";
import { nanoid } from "nanoid";
import { saveRecipe } from "~/server/db/queries";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const id = generateId();
  console.log("messages", messages)
  const result = streamText({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    model: openai("gpt-4-turbo"),
    system: "You are a helpful assistant.",
    messages: [
      {
        role: "system",
        content: `You are a professional chef and recipe assistant. When providing recipes, always follow this list and generate it json format:
        Please respond with only a valid JSON object following this exact structure, please keep keys lowercase:
                {
                  "name": "string",
                  "time": "string", 
                  "servings": number,
                  "ingredients": ["string"],
                  "instructions": ["string"],
                  "storage": "string",
                  "nutrition": "string"
                }
                

                1. Tame
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
      } as ChatCompletionMessageParam,
      ...messages,
    ],
    async onFinish({text }) {
      const recipe = JSON.parse(text);

      const recipeId = nanoid();
      const saveResult = saveRecipe({
        id: recipeId,
        name: recipe.name,
        totalTime: recipe.time,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        storage: recipe.storage,
        nutrition: recipe.nutrition,
      })
      
    },
  });

  return result.toDataStreamResponse();
}
