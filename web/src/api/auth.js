import client from "./client";

export const login = async (email, password) => {
    const { data } = await client.post("/auth/login/", { email, password });

    const accessToken = data.tokens?.access ?? data.access ?? data.access_token ?? data.token;
    const refreshToken = data.tokens?.refresh ?? data.refresh ?? data.refresh_token;
    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }

    let user = data.user;
    if (!user && accessToken) {
        const profileResponse = await client.get("/auth/me/");
        user = profileResponse.data;
    }

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    } else {
        throw new Error("The server did not return a user profile for this login.");
    }

    if (data.placement_status) {
        localStorage.setItem("placementStatus", data.placement_status);
    }

    return { ...data, user };
};

export const registerStudent = async (studentData) => {
    const { data } = await client.post("/auth/register/student/", studentData);
    return data;
};