"use client";

import { createContext, useContext, type ReactNode } from "react";

type BookmarkContextValue = {
  bookmarkIds: Set<string>;
  isLoaded: boolean;
};

const BookmarkContext = createContext<BookmarkContextValue>({
  bookmarkIds: new Set(),
  isLoaded: false,
});

export function BookmarkProvider({
  ids,
  children,
}: {
  ids: string[] | undefined;
  children: ReactNode;
}) {
  return (
    <BookmarkContext.Provider
      value={{
        bookmarkIds: new Set(ids ?? []),
        isLoaded: ids !== undefined,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  return useContext(BookmarkContext);
}
