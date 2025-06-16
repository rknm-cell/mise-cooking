
export type Recipe = {
  name: string,
  time: string,
  servings: number,
  ingredients: string[],
  instructions: string,
  storage: string,
  nutrition: string,
}

// export const chickenrecipe = {
//   "Recipe Name": "Garlic Chicken and Broccoli Stir-Fry",
//   "Total Time": "25 minutes",
//   Servings: 4,
//   Ingredients: {
//     "Chicken Breast": "2 boneless, skinless chicken breasts, thinly sliced",
//     Broccoli: "2 cups broccoli florets",
//     Garlic: "3 cloves garlic, minced",
//     "Soy Sauce": "3 tablespoons soy sauce",
//     "Oyster Sauce": "2 tablespoons oyster sauce",
//     "Sesame Oil": "1 tablespoon sesame oil",
//     "Vegetable Oil": "2 tablespoons vegetable oil",
//     Salt: "1/2 teaspoon salt",
//     "Black Pepper": "1/4 teaspoon black pepper",
//     "Red Pepper Flakes": "1/4 teaspoon red pepper flakes (optional)",
//     Cornstarch:
//       "1 tablespoon cornstarch dissolved in 2 tablespoons water (for thickening)",
//     "Green Onions": "2 stalks green onions, chopped (for garnish)",
//   },
//   "Step-by-Step Instructions": [
//     "In a bowl, marinate the sliced chicken with soy sauce, oyster sauce, sesame oil, salt, black pepper, and red pepper flakes. Let it sit for 10 minutes.",
//     "In a large pan or wok, heat vegetable oil over medium-high heat. Add minced garlic and stir-fry for 30 seconds until fragrant.",
//     "Add the marinated chicken to the pan and stir-fry for 3-4 minutes until cooked through.",
//     "Add broccoli florets to the pan and stir-fry for another 2-3 minutes until the broccoli is tender-crisp.",
//     "Pour the cornstarch mixture over the chicken and broccoli, stirring constantly until the sauce thickens.",
//     "Garnish with chopped green onions and serve hot over steamed rice or noodles.",
//   ],
//   "Storage & Leftovers":
//     "Store any leftovers in an airtight container in the refrigerator for up to 2 days. Reheat in a pan or microwave until heated through.",
//   "Nutritional Notes":
//     "This stir-fry is high in protein and fiber, and low in carbohydrates. Adjust the seasoning and spice level according to your preference.",
// };

// export const recipe = {
//   "Recipe Name": "Quinoa Stuffed Bell Peppers",
//   "Total Time": "50 minutes",
//   Servings: 4,
//   Ingredients: {
//     Quinoa: "1 cup, rinsed",
//     "Bell peppers": "4 medium-sized",
//     "Black beans": "1 can (15 oz), drained and rinsed",
//     Corn: "1 cup, fresh or frozen",
//     Tomato: "1 large, diced",
//     Onion: "1 medium, diced",
//     Garlic: "2 cloves, minced",
//     Cumin: "1 tsp",
//     "Chili powder": "1 tsp",
//     Salt: "1/2 tsp",
//     "Black pepper": "1/4 tsp",
//     "Olive oil": "2 tbsp",
//     "Fresh cilantro": "2 tbsp, chopped (optional)",
//     Cheese: "1/2 cup, shredded (optional)",
//   },
//   "Equipment Needed": [
//     "Baking dish",
//     "Saucepan",
//     "Chef's knife",
//     "Cutting board",
//   ],
//   "Step-by-Step Instructions": [
//     "Preheat the oven to 375°F (190°C).",
//     "Cut the tops off the bell peppers and remove the seeds and membranes.",
//     "Heat olive oil in a saucepan over medium heat. Add onion and garlic, sauté until softened.",
//     "Add quinoa, black beans, corn, tomato, cumin, chili powder, salt, and black pepper to the saucepan. Cook for 5 minutes, stirring occasionally.",
//     "Fill each bell pepper with the quinoa mixture and place them in a baking dish. Cover with foil.",
//     "Bake for 25-30 minutes until the peppers are tender.",
//     "If using cheese, remove the foil, sprinkle cheese on top of each pepper, and bake for an additional 5 minutes until the cheese is melted.",
//     "Garnish with fresh cilantro before serving.",
//   ],
//   "Storage & Leftovers":
//     "Store any leftovers in an airtight container in the refrigerator for up to 3 days. Reheat in the oven or microwave before serving.",
//   "Nutritional Notes":
//     "This recipe is high in protein from the quinoa and black beans, and rich in vitamins and fiber from the vegetables. It can be a good source of calcium if cheese is added.",
// };

// export const recipe = { "Recipe Name": "Chicken Burritos", "Total Time": "30 minutes", "Servings": 4, "Ingredients": { "Chicken Breast": "2 medium, cooked and shredded", "Tortillas": "4 large", "Refried Beans": "1 can (16 oz)", "Mexican Rice": "1 cup, cooked", "Shredded Cheese": "1 cup (cheddar or Mexican blend)", "Sour Cream": "1/2 cup", "Salsa": "1/2 cup", "Lettuce": "1 cup, shredded", "Tomato": "1, diced", "Avocado": "1, sliced", "Cilantro": "2 tbsp, chopped", "Lime": "1, cut into wedges", "Salt": "to taste", "Pepper": "to taste", "Optional": "Jalapeños, hot sauce" }, "Step-by-Step Instructions": [ "Warm the tortillas in a skillet or microwave until soft and pliable.", "Spread a layer of refried beans on each tortilla.", "Top with shredded chicken, Mexican rice, shredded cheese, lettuce, tomato, avocado, sour cream, salsa, and cilantro.", "Season with salt and pepper to taste.", "Fold in the sides of the tortilla and roll it up tightly to form a burrito.", "Heat a non-stick skillet over medium heat and place the burritos seam-side down to seal them.", "Cook for 2-3 minutes on each side until golden brown and crispy.", "Serve hot with lime wedges and additional toppings like jalapeños or hot sauce.", "Enjoy your delicious chicken burritos!" ], "Storage & Leftovers": "If you have leftover burritos, wrap them individually in foil and store in the refrigerator for up to 3 days. Reheat in the oven or microwave before serving.", "Nutritional Notes": "Nutritional information may vary based on specific ingredients used and portion sizes. To lower the calorie content, you can use whole wheat tortillas and reduce the amount of cheese and sour cream." }

export const recipe = { "Name": "Protein Pancakes", "Time": "15 minutes", "Servings": 2, "Ingredients": { "Dry Ingredients": [ "1 cup oats", "1 scoop protein powder (flavor of your choice)", "1 tsp baking powder", "1/2 tsp cinnamon", "Pinch of salt" ], "Wet Ingredients": [ "1 ripe banana, mashed", "2 eggs", "1/2 cup milk of choice", "1 tsp vanilla extract" ], "Optional Toppings": [ "Fresh berries", "Greek yogurt", "Maple syrup", "Nut butter" ] }, "Instructions": [ "In a blender, combine oats, protein powder, baking powder, cinnamon, and salt. Blend until oats are finely ground.", "Add mashed banana, eggs, milk, and vanilla extract to the blender. Blend until smooth batter forms.", "Preheat a non-stick skillet or griddle over medium heat.", "Pour 1/4 cup of batter onto the skillet for each pancake.", "Cook for 2-3 minutes until bubbles form on the surface, then flip and cook for another 1-2 minutes until golden brown.", "Repeat with the remaining batter.", "Serve hot with your favorite toppings like fresh berries, Greek yogurt, maple syrup, or nut butter." ], "Storage": "Leftover pancakes can be stored in an airtight container in the refrigerator for up to 2 days. Reheat in a toaster or microwave before serving.", "Nutrition": "Each serving provides approximately: 350 calories, 25g protein, 40g carbohydrates, 10g fat, 5g fiber." }