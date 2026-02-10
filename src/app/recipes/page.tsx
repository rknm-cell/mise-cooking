"use client";
import { api } from "~/trpc/react";
import { RecipeCard } from "../components/recipes/RecipeCard";
import { RecipeCardSkeleton } from "../components/recipes/RecipeCardSkeleton";
import { EmptyState } from "../components/recipes/EmptyState";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Masonry from "react-masonry-css";
import { Grid, LayoutGrid } from "lucide-react";

const springBouncy = { type: "spring" as const, stiffness: 280, damping: 40 };

export default function Page() {
  const { data: recipes, isLoading } = api.recipe.getAllRecipes.useQuery();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"hero" | "masonry">("hero");
  const utils = api.useUtils();

  // Debounce search input for better performance
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [search]);

  const recipeList = (recipes ?? []).filter((recipe) =>
    recipe.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
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
    <div className="relative mx-auto min-h-screen bg-linear-to-b from-[#1d7b86] to-[#426b70] p-4 texture-grain pattern-organic">
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
      <SearchBar
        search={search}
        setSearch={setSearch}
        resultsCount={recipeList.length}
        isLoading={isLoading || isSearching}
      />

      {layoutMode === "hero" ? (
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
          {isLoading ? (
            // Show skeleton loaders while loading
            Array(8).fill(0).map((_, index) => {
              const featured = isFeatured(index);
              return (
                <div
                  key={index}
                  className={featured ? "sm:col-span-2" : ""}
                >
                  <RecipeCardSkeleton featured={featured} />
                </div>
              );
            })
          ) : recipeList.length > 0 ? (
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
            <div className="col-span-full">
              <EmptyState
                message={search ? "No recipes match your search" : "No recipes found"}
                description={search ? "Try adjusting your search terms or browse all recipes" : "Get started by creating your first recipe!"}
              />
            </div>
          )}
        </div>
      ) : (
        isLoading ? (
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
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="mb-4">
                <RecipeCardSkeleton />
              </div>
            ))}
          </Masonry>
        ) : recipeList.length > 0 ? (
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
            {recipeList.map((recipe, index) => (
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
            ))}
          </Masonry>
        ) : (
          <div className="w-full">
            <EmptyState
              message={search ? "No recipes match your search" : "No recipes found"}
              description={search ? "Try adjusting your search terms or browse all recipes" : "Get started by creating your first recipe!"}
            />
          </div>
        )
      )}
    </div>
  );
}
