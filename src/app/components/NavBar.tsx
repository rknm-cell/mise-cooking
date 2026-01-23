import Link from "next/link";
import React from "react";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-linear-to-b from-[#1d7b86] to-[#426b70] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 transition-colors hover:text-blue-600"
            >
              <span className="nanum-pen-script-regular text-6xl text-[#fcf45a]">
                Mise
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="nanum-pen-script-regular ml-10 flex items-baseline space-x-8 text-4xl text-[#fcf45a]">
              <Link
                href="/"
                className="rounded-md px-3 py-2 font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/recipes"
                className="rounded-md px-3 py-2 font-medium transition-colors duration-200"
              >
                Recipes
              </Link>
              {/* <Link
                href="/profile"
                className="rounded-md px-3 py-2 font-medium transition-colors duration-200"
              >
                Profile
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
