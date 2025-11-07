"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated on mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Handle routing based on auth status
    if (isLoading) return;

    const isLoginPage = pathname === "/login";

    // If authenticated and on login page, redirect to homepage
    if (isAuthenticated && isLoginPage) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();
      const { token: authToken } = data;

      // Store token in localStorage
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

