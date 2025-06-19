"use client";

import { HydrateClient } from "~/trpc/server";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useChat } from "@ai-sdk/react";
import RecipeGenerator from "./components/RecipeGenerator";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1d7b86] to-[#426b70] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[#fcf45a]">Mise</span>
          </h1>

          {/* <ChatBot /> */}
          <RecipeGenerator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {/* <RecipeDetail recipe={recipe} /> */}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
