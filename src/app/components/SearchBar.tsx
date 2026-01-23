import React from "react";
import { Textarea } from "~/components/ui/textarea";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="mb-4 flex justify-center">
      <Textarea
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search recipes..."
        className="min-h-12 w-full max-w-md rounded-lg bg-zinc-500 px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-0 resize-none"
        rows={1}
      />
    </div>
  );
}
