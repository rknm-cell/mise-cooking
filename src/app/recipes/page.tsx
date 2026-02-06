"use client";
import { api } from "~/trpc/react";
import { RecipeCard } from "../components/recipes/RecipeCard";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Masonry from "react-masonry-css";
import { Grid, LayoutGrid } from "lucide-react";

const springBouncy = { type: "spring" as const, stiffness: 280, damping: 40 };

export default function Page() {
  const { data: recipes } = api.recipe.getAllRecipes.useQuery();
  const [search, setSearch] = useState("");
  const [layoutMode, setLayoutMode] = useState<"hero" | "masonry">("hero");
  const utils = api.useUtils();

  const recipeList = (recipes ?? []).filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Parallax scroll for header
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 400], [0, -100]);
  const headerOpacity = useTransform(scrollY, [0, 250], [1, 0.7]);

  // Prefetch all recipe data when the page loads
  useEffect(() => {
    if (recipes) {
      recipes.forEach((recipe) => {
        utils.recipe.getRecipe.prefetch(recipe.id);
      });
    }
  }, [recipes, utils.recipe.getRecipe]);

  // Determine which cards should be featured (1st and every 6th card)
  const isFeatured = (index: number) => index === 0 || (index > 0 && (index + 1) % 6 === 0);

  return (
    <div className="relative mx-auto min-h-screen bg-gradient-to-b from-[#1d7b86] to-[#426b70] p-4 texture-grain pattern-organic">
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="flex items-center justify-between mb-6 relative z-10"
      >
        <h1 className="text-center text-4xl font-display text-[#fcf45a] flex-1">
          Recipes
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setLayoutMode("hero")}
            className={`p-2 rounded-lg transition-all ${
              layoutMode === "hero"
                ? "bg-[#fcf45a] text-[#1d7b86] shadow-yellow"
                : "bg-[#428a93] text-[#fcf45a] hover:bg-[#1d7b86]"
            }`}
            title="Hero Grid Layout"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setLayoutMode("masonry")}
            className={`p-2 rounded-lg transition-all ${
              layoutMode === "masonry"
                ? "bg-[#fcf45a] text-[#1d7b86] shadow-yellow"
                : "bg-[#428a93] text-[#fcf45a] hover:bg-[#1d7b86]"
            }`}
            title="Masonry Layout"
          >
            <Grid className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
      <SearchBar search={search} setSearch={setSearch} />

      {layoutMode === "hero" ? (
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
          {recipeList.length > 0 ? (
            recipeList.map((recipe, index) => {
              const featured = isFeatured(index);
              return (
                <motion.div
                  key={recipe.id || index}
                  className={featured ? "sm:col-span-2" : ""}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...springBouncy,
                    delay: index * 0.06
                  }}
                >
                  <RecipeCard recipe={recipe} featured={featured} />
                </motion.div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-white font-body-medium">
              No recipes found
            </p>
          )}
        </div>
      ) : (
        <Masonry
          breakpointCols={{
            default: 4,
            1536: 4,
            1280: 3,
            1024: 3,
            768: 2,
            640: 1
          }}
          className="masonry-grid relative z-10"
          columnClassName="masonry-grid-column"
        >
          {recipeList.length > 0 ? (
            recipeList.map((recipe, index) => (
              <div key={recipe.id || index} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...springBouncy,
                    delay: index * 0.06
                  }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              </div>
            ))
          ) : (
            <p className="text-center text-white font-body-medium w-full">
              No recipes found
            </p>
          )}
        </Masonry>
      )}
    </div>
  );
}
