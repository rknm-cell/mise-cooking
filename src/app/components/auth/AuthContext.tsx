"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authClient } from "~/lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        const sessionData = session && "data" in session ? session.data : null;

        if (sessionData?.user) {
          const userData = sessionData.user;
          setUser({
            id: userData.id,
            name: userData.name || userData.email || "User",
            email: userData.email,
            image: userData.image ?? undefined,
            createdAt: userData.createdAt ? new Date(userData.createdAt).toISOString() : undefined,
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.id ?? null,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
