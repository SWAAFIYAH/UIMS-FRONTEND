import axios from "axios";

const client = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// Automatically attach the JWT access token to every request if it exists
client.interceptors.request.use(
    (config) => {
        // Skip attaching tokens for public auth routes to prevent 401 login blocks
        if (config.url?.includes("/auth/login/") || config.url?.includes("/auth/register/")) {
             return config;
        }

        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;