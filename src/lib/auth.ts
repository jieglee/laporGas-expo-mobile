import api from "./api";

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; }

export async function loginUser({ email, password }: LoginPayload) {
    const res = await api.post("/login", { email, password });
    const token = res.data?.data?.token;
    if (!token) throw new Error("Token tidak ditemukan");

    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
        token,
        user: {
            id: String(payload.id),
            name: payload.name,
            role: payload.role,
            email,
        },
    };
}

export async function registerUser({ name, email, password }: RegisterPayload) {
    const res = await api.post("/register", { name, email, password });
    return res.data;
}

export async function verifyIdentity(email: string, name: string) {
    const res = await api.post("/verify-identity", { email, name });
    return res.data;
}

export async function resetPasswordByName(email: string, name: string, newPassword: string) {
    const res = await api.post("/reset-password", { email, name, newPassword });
    return res.data;
}