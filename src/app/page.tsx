"use client";

import RecipeGenerator from "./components/recipes/RecipeGenerator";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1d7b86] to-[#426b70] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <div className="flex flex-col justify-center items-center">
            <span className="nanum-pen-script-regular text-8xl text-[#fcf45a]">
              Mise
            </span>
            <span className="nanum-pen-script-regular text-[#fcf45a] text-4xl">
              (meez)
            </span>
          </div>
        </h1>

        <RecipeGenerator />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {/* <RecipeDetail recipe={recipe} /> */}
        </div>
      </div>
    </main>
  );
}
