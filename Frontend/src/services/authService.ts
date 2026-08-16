const API_URL = "http://localhost:5000/api/auth";

export const authService = {
  async register(profileData: any): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  },

  async login(credentials: any): Promise<{ message: string; user: any }> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data;
  },

  async getMe(): Promise<{ authenticated: boolean; user?: any }> {
    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch session");
    }
    return data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }
    return data;
  },
};
