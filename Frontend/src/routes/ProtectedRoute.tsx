import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export function ProtectedRoute({ children, onNavigate }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.history.replaceState({}, "", "/login");
      onNavigate("/login");
    }
  }, [isLoading, isAuthenticated, onNavigate]);

  if (isLoading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          backgroundColor: "#faf9f6",
        }}
      >
        <div className="spinner" style={{ marginBottom: "16px", fontSize: "24px", color: "var(--brand-primary)" }}>
          Loading your session...
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}

export default ProtectedRoute;
