import Link from "next/link";
import React from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Recipes", href: "/recipes" },
];

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#1d7b86]/95 to-[#426b70]/95 backdrop-blur-soft shadow-ocean-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-display-bold text-gray-900 transition-colors hover:text-blue-600"
            >
              <span className="nanum-pen-script-regular text-6xl text-[#fcf45a]">
                Mise
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 text-2xl text-[#fcf45a]">
              {navLinks.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-3 py-2 text-4xl nanum-pen-script-regular transition-colors duration-200 hover:text-[#fcf45a]/80"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
