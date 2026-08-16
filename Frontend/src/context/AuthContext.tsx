import { createContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";

export interface User {
  id: string;
  fullName: string;
  role: "student" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<User>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  sessionError: string | null;
  clearSessionError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const checkSession = async () => {
    try {
      const data = await authService.getMe();
      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setSessionError(null);
      } else {
        // If they were authenticated, but session is no longer active, show session expired message
        if (isAuthenticated) {
          setSessionError("Your session has expired. Please log in again.");
        }
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (credentials: any): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      setSessionError(null);
      return data.user;
    } catch (error: any) {
      setUser(null);
      setIsAuthenticated(false);
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
