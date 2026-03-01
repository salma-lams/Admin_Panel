import { api } from "../axios";

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string; role?: "admin" | "user" }

export const authApi = {
    login: (payload: LoginPayload) => api.post("/auth/login", payload),
    register: (payload: RegisterPayload) => api.post("/auth/register", payload),
    refresh: (refreshToken: string) => api.post("/auth/refresh", { refreshToken }),
    logout: () => api.post("/auth/logout"),
    getMe: () => api.get("/auth/me"),
};
