/**
 * Script to update existing recipes with appropriate image URLs
 * Run with: bun run scripts/updateRecipeImages.ts
 */

import { db } from "~/server/db";
import { recipe } from "~/server/db/schema";
import { getRecipeImage } from "~/lib/recipeImageMapper";
import { eq } from "drizzle-orm";

async function updateRecipeImages() {
  console.log("Starting recipe image update...");

  try {
    // Get all recipes
    const recipes = await db.select().from(recipe);
    console.log(`Found ${recipes.length} recipes to update`);

    // Update each recipe with an appropriate image
    for (const r of recipes) {
      // Skip if already has an image
      if (r.imageUrl) {
        console.log(`  ✓ Recipe "${r.name}" already has an image, skipping`);
        continue;
      }

      const imageUrl = getRecipeImage(r.name);

      await db
        .update(recipe)
        .set({ imageUrl })
        .where(eq(recipe.id, r.id));

      console.log(`  ✓ Updated "${r.name}" with image: ${imageUrl}`);
    }

    console.log("\n✅ All recipes updated successfully!");
  } catch (error) {
    console.error("❌ Error updating recipes:", error);
    throw error;
  }
}

// Run the script
updateRecipeImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
