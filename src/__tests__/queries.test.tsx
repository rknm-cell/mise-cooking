import { vi, expect, describe, it, beforeEach } from "vitest";

vi.mock("~/server/db", async (importActual) => {
  const actual = await importActual<typeof import("~/server/db")>();
  return {
    ...actual,
    db: {
      query: {
        recipe: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
      },
      insert: vi.fn(() => ({
        values: vi.fn(),
      })),
    },
  };
});

import { getAllRecipes, getRecipeById, saveRecipe } from "~/server/db/queries";
import { db } from "~/server/db";
import {type Recipe, type RecipeSchema } from "~/server/db/schema";
import * as schema from "~/server/db/schema"

describe("getAllRecipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const mockRecipes: Recipe[] = [
    {
      id: "lo6QNhzdJ-5olh0oqIl7L",
      name: "Southwestern Corn Salad",
      description:
        "A vibrant and flavorful corn salad with a southwestern twist, featuring black beans, bell peppers, and a zesty lime dressing. Perfect for potlucks!",
      totalTime: "20 minutes",
      servings: 8,
      ingredients: ["4 cups fresh corn kernels (or 2 cans of corn, drained)"],
      instructions: [
        "In a large bowl, combine the corn, black beans, red bell pepper, green bell pepper, red onion, and cilantro.",
      ],
      storage:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days.",
      nutrition: [
        "Calories: 150 per serving",
        "Protein: 6g",
        "Carbohydrates: 25g",
        "Fat: 5g",
        "Fiber: 6g",
      ],
      imageUrl: null,
      createdAt: new Date(),
    },
  ];
  it("should return recipes when database has items", async () => {
    vi.mocked(db.query.recipe.findMany).mockResolvedValue(mockRecipes);

    const recipes = await getAllRecipes();

    expect(recipes).toEqual(mockRecipes);
    expect(recipes).toHaveLength(1);
    expect(db.query.recipe.findMany).toHaveBeenCalled();
  });
});

describe("getRecipeById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a recipe when found by id", async () => {
    const mockRecipe: Recipe = {
      id: "lo6QNhzdJ-5olh0oqIl7L",
      name: "Southwestern Corn Salad",
      description:
        "A vibrant and flavorful corn salad with a southwestern twist, featuring black beans, bell peppers, and a zesty lime dressing. Perfect for potlucks!",
      totalTime: "20 minutes",
      servings: 8,
      ingredients: ["4 cups fresh corn kernels (or 2 cans of corn, drained)"],
      instructions: [
        "In a large bowl, combine the corn, black beans, red bell pepper, green bell pepper, red onion, and cilantro.",
      ],
      storage:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days.",
      nutrition: [
        "Calories: 150 per serving",
        "Protein: 6g",
        "Carbohydrates: 25g",
        "Fat: 5g",
        "Fiber: 6g",
      ],
      imageUrl: null,
      createdAt: new Date(),
    };

    vi.mocked(db.query.recipe.findFirst).mockResolvedValue(mockRecipe);

    const result = await getRecipeById("lo6QNhzdJ-5olh0oqIl7L");

    expect(db.query.recipe.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRecipe);
    expect(result).toHaveProperty("id", "lo6QNhzdJ-5olh0oqIl7L");
    expect(result).toHaveProperty("name", "Southwestern Corn Salad");
  });

  it("should return null when recipe is not found", async () => {
    vi.mocked(db.query.recipe.findFirst).mockResolvedValue(undefined);

    const result = await getRecipeById("non-existent-id");

    expect(db.query.recipe.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });
});

describe("saveRecipe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should insert a recipe object", async () => {

 const mockRecipe = {
      id: "lo6QNhzdJ-5olh0oqIl7L",
      name: "Southwestern Corn Salad",
      description:
        "A vibrant and flavorful corn salad with a southwestern twist, featuring black beans, bell peppers, and a zesty lime dressing. Perfect for potlucks!",
      totalTime: "20 minutes",
      servings: 8,
      ingredients: ["4 cups fresh corn kernels (or 2 cans of corn, drained)"],
      instructions: [
        "In a large bowl, combine the corn, black beans, red bell pepper, green bell pepper, red onion, and cilantro.",
      ],
      storage:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days.",
      nutrition: [
        "Calories: 150 per serving",
        "Protein: 6g",
        "Carbohydrates: 25g",
        "Fat: 5g",
        "Fiber: 6g",
      ],
    };

    const mockInsertResult = { success: true };
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockResolvedValue(mockInsertResult),
    } as any);

    const result = await saveRecipe(mockRecipe);

    expect(db.insert).toHaveBeenCalledWith(schema.recipe);
    expect(result).toEqual(mockInsertResult);
  });

  it("should handle errors when saving recipe fails", async () => {
    const mockRecipeData = {
      id: "lo6QNhzdJ-5olh0oqIl7L",
      name: "Southwestern Corn Salad",
      description:
        "A vibrant and flavorful corn salad with a southwestern twist, featuring black beans, bell peppers, and a zesty lime dressing. Perfect for potlucks!",
      totalTime: "20 minutes",
      servings: 8,
      ingredients: ["4 cups fresh corn kernels (or 2 cans of corn, drained)"],
      instructions: [
        "In a large bowl, combine the corn, black beans, red bell pepper, green bell pepper, red onion, and cilantro.",
      ],
      storage:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days.",
      nutrition: [
        "Calories: 150 per serving",
        "Protein: 6g",
        "Carbohydrates: 25g",
        "Fat: 5g",
        "Fiber: 6g",
      ],
    };

    const mockError = new Error("Database connection failed");
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockRejectedValue(mockError),
    } as any);

    const result = await saveRecipe(mockRecipeData);

    expect(result).toEqual({
      success: false,
      message: "Database connection failed",
    });
  });
});
