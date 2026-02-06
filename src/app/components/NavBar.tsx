"use client";

import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Recipes", href: "/recipes" },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#fcf45a] hover:text-[#fcf45a]/80 transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-gradient-to-b from-[#1d7b86] to-[#426b70] border-t border-[#fcf45a]/20 shadow-ocean"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col items-end">
              {navLinks.map(({ name, href }, index) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="w-full text-right"
                >
                  <Link
                    href={href}
                    className="block text-3xl nanum-pen-script-regular text-[#fcf45a] hover:text-[#fcf45a]/80 transition-colors py-2 border-b border-[#fcf45a]/10 last:border-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
