import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");
const apiBaseUrl = configuredApiUrl
    ? configuredApiUrl.endsWith("/api")
        ? configuredApiUrl
        : `${configuredApiUrl}/api`
    : "https://uims-67iz.onrender.com/api";

const client = axios.create({
    baseURL: apiBaseUrl,
    timeout: 30000,
});

client.interceptors.request.use(
    (config) => {
        const isPublicAuthRoute = [
            "/auth/login/",
            "/auth/register/",
            "/auth/invite/accept/",
            "/auth/verify-email/",
            "/auth/invite/check/",
        ].some((route) => config.url?.includes(route));

        if (!isPublicAuthRoute && typeof localStorage !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers.set("Authorization", `Bearer ${token}`);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default client;
