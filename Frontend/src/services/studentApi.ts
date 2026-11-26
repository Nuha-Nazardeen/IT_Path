import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export interface StudentRecord {
  _id: string;
  [key: string]: unknown;
}

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
};

const crud = (path: string) => ({
  list: async <T = StudentRecord[]>(params?: Record<string, string>) => {
    const response = await api.get<T>(path, { params });
    return response.data;
  },
  get: async <T = StudentRecord>(id: string) => {
    const response = await api.get<T>(`${path}/${id}`);
    return response.data;
  },
  create: async <T = StudentRecord>(body: Record<string, unknown>) => {
    const response = await api.post<T>(path, body);
    return response.data;
  },
  update: async <T = StudentRecord>(id: string, body: Record<string, unknown>) => {
    const response = await api.patch<T>(`${path}/${id}`, body);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`${path}/${id}`);
    return response.data;
  },
});

export const studentApi = {
  dashboard: () => api.get("/student/dashboard").then((response) => response.data),
  profile: {
    get: () => api.get("/student/profile").then((response) => response.data),
    update: (body: Record<string, unknown>) => api.patch("/student/profile", body).then((response) => response.data),
  },
  portfolio: {
    get: () => api.get("/student/portfolio").then((response) => response.data),
    update: (body: Record<string, unknown>) => api.patch("/student/portfolio", body).then((response) => response.data),
  },
  insights: {
    list: () => api.get("/student/insights").then((response) => response.data),
    save: (body: Record<string, unknown>) => api.post("/student/insights", body).then((response) => response.data),
  },
  semesters: crud("/student/semesters"),
  modules: crud("/student/modules"),
  assessments: crud("/student/assessments"),
  academicResources: crud("/student/academic-resources"),
  skills: crud("/student/skills"),
  projects: crud("/student/projects"),
  internships: crud("/student/internships"),
  tasks: crud("/student/tasks"),
  achievements: crud("/student/achievements"),
  notifications: crud("/student/notifications"),
};
