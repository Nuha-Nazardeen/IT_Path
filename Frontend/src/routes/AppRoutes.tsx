import { useState, useEffect } from "react";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { useAuth } from "../hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

export function AppRoutes() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isAuthenticated, isLoading, user, sessionError, clearSessionError } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  // Show session expiration message if present
  useEffect(() => {
    if (sessionError) {
      alert(sessionError);
      clearSessionError();
    }
  }, [sessionError, clearSessionError]);

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
        <h2 style={{ color: "var(--brand-primary)" }}>Verifying session...</h2>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  // Handle routing using the central auth state
  switch (currentPath) {
    case "/login":
      if (isAuthenticated) {
        if (isAdmin) {
          window.history.replaceState({}, "", "/admin-dashboard");
          return (
            <AdminRoute onNavigate={navigate}>
              <AdminDashboardPage onNavigate={navigate} />
            </AdminRoute>
          );
        } else {
          window.history.replaceState({}, "", "/dashboard");
          return (
            <ProtectedRoute onNavigate={navigate}>
              <DashboardPage onNavigate={navigate} />
            </ProtectedRoute>
          );
        }
      }
      return <LoginPage onNavigate={navigate} />;
    case "/register":
      if (isAuthenticated) {
        if (isAdmin) {
          window.history.replaceState({}, "", "/admin-dashboard");
          return (
            <AdminRoute onNavigate={navigate}>
              <AdminDashboardPage onNavigate={navigate} />
            </AdminRoute>
          );
        } else {
          window.history.replaceState({}, "", "/dashboard");
          return (
            <ProtectedRoute onNavigate={navigate}>
              <DashboardPage onNavigate={navigate} />
            </ProtectedRoute>
          );
        }
      }
      return <RegisterPage onNavigate={navigate} />;

    // Authenticated Student Routes
    case "/dashboard":
    case "/academic":
    case "/career":
    case "/balance":
    case "/portfolio":
    case "/resources":
    case "/profile":
    case "/settings":
      return (
        <ProtectedRoute onNavigate={navigate}>
          <DashboardPage onNavigate={navigate} />
        </ProtectedRoute>
      );

    // Admin Protected Routes
    case "/admin-dashboard":
    case "/admin":
    case "/admin/users":
    case "/admin/academic":
    case "/admin/careers":
    case "/admin/skills":
    case "/admin/resources":
    case "/admin/projects":
    case "/admin/reports":
    case "/admin/settings":
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminDashboardPage onNavigate={navigate} />
        </AdminRoute>
      );

    case "/":
    default:
      return <LandingPage onNavigate={navigate} />;
  }
}
export default AppRoutes;
