import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
};

export const authService = {
  async register(profileData: any): Promise<{ message: string }> {
    try {
      const response = await api.post("/auth/register", profileData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Registration failed"));
    }
  },

  async login(credentials: any): Promise<{ message: string; user: any }> {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Login failed"));
    }
  },

  async getMe(): Promise<{ authenticated: boolean; user?: any }> {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch session"));
    }
  },

  async logout(): Promise<{ message: string }> {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Logout failed"));
    }
  },
};
