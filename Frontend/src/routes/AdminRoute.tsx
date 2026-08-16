import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface AdminRouteProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export function AdminRoute({ children, onNavigate }: AdminRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        window.history.replaceState({}, "", "/login");
        onNavigate("/login");
      } else if (user?.role !== "admin") {
        window.history.replaceState({}, "", "/dashboard");
        onNavigate("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, onNavigate]);

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
          Checking admin permissions...
        </div>
      </div>
    );
  }

  return isAuthenticated && user?.role === "admin" ? <>{children}</> : null;
}

export default AdminRoute;
