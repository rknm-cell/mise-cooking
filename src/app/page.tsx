"use client";

import RecipeGenerator from "./components/recipes/RecipeGenerator";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1d7b86] to-[#426b70] text-white texture-grain pattern-organic">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <span className="nanum-pen-script-regular text-display-hero text-[#fcf45a] rotate-hand-1 text-shadow-dramatic inline-block">
              Mise
            </span>
            <span className="nanum-pen-script-regular text-[#fcf45a] text-5xl sm:text-6xl rotate-hand-2 inline-block font-body-light tracking-wider opacity-90">
              /meez/
            </span>
            <p className="text-white/70 text-lg sm:text-xl font-body-light mt-4 max-w-md text-center leading-relaxed">
              Your AI-powered culinary companion for <span className="font-body-semibold text-[#fcf45a]">personalized</span> recipes
            </p>
          </div>
        </h1>

        <RecipeGenerator />


      </div>
    </main>
  );
}
