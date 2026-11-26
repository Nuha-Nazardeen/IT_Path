import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export interface AuthUser {
  id: string;
  fullName: string;
  role: "student" | "admin";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  uniEmail: string;
  password: string;
  academic: {
    university: string;
    degree: string;
    academicYear: string;
    semester: string;
    graduationYear: string;
    specialization: string;
  };
  career: string;
  skills: Record<string, "BEG" | "INT" | "ADV">;
  planning: {
    weekdayHours: string;
    weekendHours: string;
    challenges: string[];
  };
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
};

export const authService = {
  async register(profileData: RegisterPayload): Promise<{ message: string }> {
    try {
      const response = await api.post("/auth/register", profileData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Registration failed"), { cause: error });
    }
  },

  async login(credentials: LoginCredentials): Promise<{ message: string; user: AuthUser }> {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Login failed"), { cause: error });
    }
  },

  async getMe(): Promise<{ authenticated: boolean; user?: AuthUser }> {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch session"), { cause: error });
    }
  },

  async logout(): Promise<{ message: string }> {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Logout failed"), { cause: error });
    }
  },
};
