import { useAuthStore } from "@/store/auth-store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // If a refresh is already in flight, reuse it instead of firing multiple requests
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return null;

      const data = await res.json();
      const newToken = data.accessToken as string;

      const { user } = useAuthStore.getState();
      if (user) {
        useAuthStore.getState().setSession(user, newToken);
      }

      return newToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request(path: string, options: RequestInit = {}, isRetry = false): Promise<{ data: any }> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // On 401, try a silent refresh once, then retry the original request
  if (res.status === 401 && !isRetry && !path.startsWith("/auth/")) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      return request(path, options, true);
    }

    // Refresh failed — the session is genuinely over, log the user out
    useAuthStore.getState().clearSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please sign in again.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Something went wrong");
  }

  return { data };
}

export const apiClient = {
  get: (path: string) => request(path, { method: "GET" }),
  post: (path: string, body?: unknown) => request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: unknown) => request(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: (path: string) => request(path, { method: "DELETE" }),
};
