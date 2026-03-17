const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:5000/api";


class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed() {
  refreshSubscribers.forEach((cb) => cb(""));
  refreshSubscribers = [];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const fetchOptions: RequestInit = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest", // CSRF Protection Header
      ...(init?.headers ?? {}),
    },
    credentials: "include", // Essential for HttpOnly cookies
    cache: "no-store",
  };

  const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

  // Handle 401 Unauthorized (Token expired)
  if (response.status === 401 && !path.includes("/auth/login") && !path.includes("/auth/refresh")) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
          credentials: "include",
        });

        if (refreshResponse.ok) {
          isRefreshing = false;
          onTokenRefreshed();
          // Retry original request
          return request<T>(path, init);
        }
      } catch (err) {
        isRefreshing = false;
        // If refresh fails, let it propagate and handle in UI/Redux
      }
    } else {
      // Return a promise that resolves when refresh is done
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(request<T>(path, init));
        });
      });
    }
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) {
        message = payload.message;
      }
    } catch {
      // Ignore malformed error payload.
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (path: string) =>
    request<void>(path, {
      method: "DELETE",
    }),
};
