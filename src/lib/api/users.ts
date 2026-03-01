import { api } from "../axios";

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: "admin" | "user" | "";
}

export const usersApi = {
    list: (filters: UserFilters = {}) =>
        api.get("/users", { params: { page: filters.page ?? 1, limit: filters.limit ?? 10, search: filters.search ?? "", role: filters.role ?? "" } }),
    get: (id: string) => api.get(`/users/${id}`),
    create: (payload: { name: string; email: string; password: string; role?: string; isActive?: boolean }) =>
        api.post("/users", payload),
    update: (id: string, payload: Partial<{ name: string; email: string; role: string; isActive: boolean; password: string }>) =>
        api.put(`/users/${id}`, payload),
    delete: (id: string) => api.delete(`/users/${id}`),
};

export const dashboardApi = {
    stats: () => api.get("/dashboard/stats"),
};
