import axios from "axios";

const API_URL = process.env.NODE_ENV === "production"
    ? "https://admin-panel-api.vercel.app/api"
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api");

console.log("[Axios] Initializing with API_URL:", API_URL);

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Request interceptor — attach CSRF and other global headers
api.interceptors.request.use((config) => {
    console.log(`[Axios] Request: ${config.method?.toUpperCase()} ${config.url}`);
    config.headers["X-Requested-With"] = "XMLHttpRequest"; // CSRF Protection Header
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`[Axios] Response: ${response.status} from ${response.config.url}`);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.error(`[Axios] Error: ${error.response?.status} from ${originalRequest.url}`, error.response?.data);

        const isAuthRequest = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
            originalRequest._retry = true;
            try {
                console.log("[Axios] Token expired, attempting refresh...");
                await axios.post(`${API_URL}/auth/refresh`, {}, {
                    withCredentials: true,
                    headers: { "X-Requested-With": "XMLHttpRequest" }
                });
                return api(originalRequest);
            } catch (refreshError) {
                console.error("[Axios] Refresh failed, redirecting to login");
                if (typeof window !== "undefined") {
                    document.cookie = "_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
