import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { authService, type LoginCredentials } from "../services/authService";
import { AuthContext, type User } from "./auth-context";

export type { User };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const wasAuthenticatedRef = useRef<boolean>(false);

  const checkSession = useCallback(async () => {
    try {
      const data = await authService.getMe();
      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        wasAuthenticatedRef.current = true;
        setSessionError(null);
      } else {
        if (wasAuthenticatedRef.current) {
          setSessionError("Your session has expired. Please log in again.");
        }
        setUser(null);
        setIsAuthenticated(false);
        wasAuthenticatedRef.current = false;
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      wasAuthenticatedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    authService
      .getMe()
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          wasAuthenticatedRef.current = true;
          setSessionError(null);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          wasAuthenticatedRef.current = false;
        }
      })
      .catch((error: unknown) => {
        console.error("Session check failed:", error);
        if (!isMounted) return;
        setUser(null);
        setIsAuthenticated(false);
        wasAuthenticatedRef.current = false;
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      wasAuthenticatedRef.current = true;
      setSessionError(null);
      return data.user;
    } catch (error: unknown) {
      setUser(null);
      setIsAuthenticated(false);
      wasAuthenticatedRef.current = false;
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      wasAuthenticatedRef.current = false;
      setSessionError(null);
      setIsLoading(false);
    }
  };

  const clearSessionError = () => {
    setSessionError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkSession,
        sessionError,
        clearSessionError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
