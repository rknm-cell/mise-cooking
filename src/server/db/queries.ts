"server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client, {schema});

export async function saveRecipe({
  id,
  name,
  totalTime,
  servings,
  ingredients,
  instructions,
  storage,
  nutrition,
}: {
  id: string,
  name: string;
  totalTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  storage: string;
  nutrition: string[];
}) {
  try {
    return await db.insert(schema.recipe).values({
      id,
      name,
      totalTime,
      servings,
      ingredients,
      instructions,
      storage,
      nutrition,
      createdAt: new Date(),
    });
  } catch (error) {
    const e = error as Error;
    console.error("Error saving recipe:", e);
    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
}

export async function getRecipeById(id: string): Promise<schema.Recipe | undefined>{
  try {
    const recipeDetail = await db.query.recipe.findFirst({
      where: eq(schema.recipe.id, id),
    })
    return recipeDetail
  } catch (error) {
    console.error(`Error fetching recipe ${id}`, error)
  }
}
