import { createContext } from "react";
import type { AuthUser, LoginCredentials } from "../services/authService";

export type User = AuthUser;

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  sessionError: string | null;
  clearSessionError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
