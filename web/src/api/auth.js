import client from "./client";

export const login = async (email, password) => {
    // 1. Destructure 'data' from the Axios response object
    const { data } = await client.post("/auth/login/", { email, password });
    
    // 2. Use 'data' (not 'response') and the correct plural 'tokens' key
    if (data.tokens) {
        localStorage.setItem("accessToken", data.tokens.access);
        localStorage.setItem("refreshToken", data.tokens.refresh);
    }
    
    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
    }
    
    if (data.placement_status) {
        localStorage.setItem("placementStatus", data.placement_status);
    }

    // 3. Return the entire data object so Login.jsx can inspect response.user.role
    return data;
};