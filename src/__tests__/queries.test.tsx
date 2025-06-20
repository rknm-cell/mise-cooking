import { vi, expect, describe, it, beforeEach } from "vitest";
import { db } from "~/server/db";
import { getAllRecipes } from "~/server/db/queries";


vi.mock("~/server/db", () => ({
  db: {
    select: vi.fn(),
    from: vi.fn(),
  },
}));


describe("getAllRecipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
});

it("should return recipes when database has items", async () => {
  const mockRecipes = [
    {
      id: "lo6QNhzdJ-5olh0oqIl7L",
      name: "Southwestern Corn Salad",
      description:
        "A vibrant and flavorful corn salad with a southwestern twist, featuring black beans, bell peppers, and a zesty lime dressing. Perfect for potlucks!",
      totalTime: "20 minutes",
      servings: 8,
      ingredients: [
        "4 cups fresh corn kernels (or 2 cans of corn, drained)",
        "1 can (15 oz) black beans, rinsed and drained",
        "1 red bell pepper, diced",
        "1 green bell pepper, diced",
        "1/2 red onion, finely chopped",
        "1/4 cup fresh cilantro, chopped",
        "1/4 cup lime juice",
        "2 tablespoons olive oil",
        "1 teaspoon cumin",
        "1 teaspoon chili powder",
        "Salt and pepper to taste",
        "Optional: 1 avocado, diced (for serving)",
      ],
      instructions: [
        "In a large bowl, combine the corn, black beans, red bell pepper, green bell pepper, red onion, and cilantro.",
        "In a separate small bowl, whisk together the lime juice, olive oil, cumin, chili powder, salt, and pepper.",
        "Pour the dressing over the corn mixture and toss gently to combine.",
        "Taste and adjust seasoning if necessary.",
        "If using, gently fold in the diced avocado just before serving to prevent browning.",
        "Serve chilled or at room temperature.",
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
      createdAt: "2025-06-19 20:19:29.044",
    },
    {
      id: "1noRKxC8mxqRqPk9VeyjJ",
      name: "Kale High Protein Salad",
      description: "A high protein kale salad with feta and avocado",
      totalTime: "15 minutes",
      servings: 8,
      ingredients: [
        "4 cups kale, chopped",
        "1 cup cooked quinoa",
        "1 cup chickpeas, drained and rinsed",
        "1/2 cup cherry tomatoes, halved",
        "1/4 cup red onion, finely chopped",
        "1/4 cup feta cheese, crumbled (optional)",
        "1/4 cup sunflower seeds",
        "2 tablespoons olive oil",
        "1 tablespoon lemon juice",
        "Salt and pepper to taste",
        "1 avocado, sliced (optional)",
      ],
      instructions: [
        "In a large bowl, combine the chopped kale, cooked quinoa, chickpeas, cherry tomatoes, red onion, and sunflower seeds.",
        "In a small bowl, whisk together the olive oil, lemon juice, salt, and pepper to create the dressing.",
        "Pour the dressing over the salad and toss well to combine all ingredients.",
        "If using, add the crumbled feta cheese and sliced avocado on top before serving.",
        "Serve immediately or let it sit for 5 minutes to allow the flavors to meld.",
      ],
      storage:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. The salad may become soggy over time, so it's best to add the dressing just before serving.",
      nutrition: [
        "Calories: 350 per serving",
        "Protein: 15g",
        "Carbohydrates: 30g",
        "Fat: 20g",
        "Fiber: 8g",
      ],
      createdAt: "2025-06-19 21:21:28.694",
    },
  ];

  vi.mocked(db.select).mockReturnValue({
    from: vi.fn().mockResolvedValue(mockRecipes) 
  } as any)

  const result = await getAllRecipes()

  expect(result).toEqual(mockRecipes)
});
