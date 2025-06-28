import React from "react";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="mb-4 flex justify-center">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search recipes..."
        className="rounded-lg bg-zinc-500 px-4 py-2 text-white placeholder-white/50"
      />
    </div>
  );
}
