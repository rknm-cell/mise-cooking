"server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { recipe, type Recipe } from "./schema";
import { uuid } from "drizzle-orm/pg-core";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

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
    return await db.insert(recipe).values({
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
    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
}
