"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "~/lib/utils";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  resultsCount?: number;
  isLoading?: boolean;
};

export default function SearchBar({
  search,
  setSearch,
  resultsCount,
  isLoading = false
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: CMD+K or CTRL+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // ESC to clear search when focused
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        if (search) {
          setSearch("");
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [search, setSearch]);

  const handleClear = () => {
    setSearch("");
    inputRef.current?.focus();
  };

  // Show results count text
  const resultsText = useMemo(() => {
    if (isLoading) return "Searching...";
    if (!search) return null;
    if (resultsCount === 0) return "No recipes found";
    if (resultsCount === 1) return "1 recipe";
    return `${resultsCount} recipes`;
  }, [search, resultsCount, isLoading]);

  return (
    <div className="mb-6 flex flex-col items-center gap-2 relative z-10">
      <div className="relative w-full max-w-2xl">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className={cn(
            "h-5 w-5 transition-all duration-200",
            isFocused ? "text-[#fcf45a]" : "text-white/60",
            isLoading && "animate-pulse"
          )} />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search recipes..."
          className={cn(
            "w-full h-12 pl-12 pr-24 rounded-xl transition-all duration-200",
            "bg-[#428a93]/60 backdrop-blur-sm",
            "text-white placeholder:text-white/50",
            "border-2 border-[#428a93]",
            "shadow-ocean",
            "focus:outline-none focus:border-[#fcf45a] focus:shadow-yellow focus:bg-[#428a93]/80",
            "hover:border-[#fcf45a]/50 hover:bg-[#428a93]/70"
          )}
          aria-label="Search recipes"
          aria-describedby={resultsText ? "search-results" : undefined}
        />

        {/* Clear Button & Keyboard Hint */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {search ? (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-[#1d7b86] hover:bg-[#fcf45a] text-white hover:text-[#1d7b86] transition-all duration-200 shadow-sm"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-white/60 bg-[#1d7b86]/50 rounded border border-white/20">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          )}
        </div>
      </div>

      {/* Results Count */}
      {resultsText && (
        <div
          id="search-results"
          className={cn(
            "text-sm font-body transition-all duration-200",
            isLoading ? "text-white/70" : "text-[#fcf45a]"
          )}
          role="status"
          aria-live="polite"
        >
          {resultsText}
        </div>
      )}
    </div>
  );
}
