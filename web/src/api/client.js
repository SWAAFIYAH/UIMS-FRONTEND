
import axios from "axios";

// Backend API URL
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://uims-67iz.onrender.com/api"
).replace(/\/+$/, "");

// Session information stored in the browser
const SESSION_KEYS = [
  "accessToken",
  "refreshToken",
  "user",
  "userName",
  "placementStatus",
];

// Clear saved session information
export const clearSession = () => {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
};

// Create Axios client
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication endpoints that should not receive an old access token
const AUTH_PATHS = [
  "/auth/login/",
  "/auth/register/",
  "/auth/token/refresh/",
];

// Attach access token to requests that need authentication
client.interceptors.request.use(
  (config) => {
    const isAuthCall = AUTH_PATHS.some((path) =>
      config.url?.includes(path)
    );

    // Never attach an old access token to login, registration or refresh
    if (isAuthCall) {
      if (config.headers) {
        delete config.headers.Authorization;
      }
      return config;
    }

    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Prevent multiple requests from refreshing the token simultaneously
let refreshPromise = null;

// Request a new access token using the refresh token
function refreshAccessToken() {
  if (!refreshPromise) {
    const refresh = localStorage.getItem("refreshToken");

    if (!refresh) {
      return Promise.reject(new Error("No refresh token available"));
    }

    // Use plain Axios to avoid triggering the same interceptors
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/token/refresh/`,
        { refresh },
        { timeout: 60000 }
      )
      .then(({ data }) => {
        if (!data.access) {
          throw new Error("The server did not return a new access token");
        }

        localStorage.setItem("accessToken", data.access);

        // Save a new refresh token if the backend rotates tokens
        if (data.refresh) {
          localStorage.setItem("refreshToken", data.refresh);
        }

        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Endpoints that should not trigger automatic token refresh
const NO_RETRY_PATHS = [
  "/auth/login/",
  "/auth/register/",
  "/auth/token/refresh/",
  "/auth/logout/",
];

// Handle API responses and expired access tokens
client.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    const isAuthCall = NO_RETRY_PATHS.some((path) =>
      original?.url?.includes(path)
    );

    // Only refresh when an authenticated request returns 401
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthCall
    ) {
      original._retry = true;

      try {
        const newToken = await refreshAccessToken();

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return client(original);
      } catch (refreshError) {
        // Refresh failed: clear the expired session
        clearSession();

        window.location.assign("/");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Convert API errors into readable messages
export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  if (error && !error.isAxiosError && error.message) {
    return error.message;
  }

  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. It may be waking up, so try again in a moment.";
  }

  if (!error?.response) {
    return "Cannot reach the server. Check your connection and try again.";
  }

  const data = error.response.data;

  if (typeof data === "string") {
    return data.trim().startsWith("<") ? fallback : data;
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.message) {
    return data.message;
  }

  if (data && typeof data === "object") {
    const parts = Object.entries(data).map(([field, value]) => {
      const message = [].concat(value).map(String).join(" ");

      return field === "non_field_errors"
        ? message
        : `${field}: ${message}`;
    });

    if (parts.length) {
      return parts.join(" ");
    }
  }

  return fallback;
}

export default client;
