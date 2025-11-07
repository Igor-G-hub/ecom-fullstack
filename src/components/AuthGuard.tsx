"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow login page without authentication
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !isLoginPage) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Allow login page to render without authentication
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For other pages, require authentication
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

