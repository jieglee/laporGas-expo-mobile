import api from "./api";

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; }

function decodeBase64(str: string) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    for (let bc = 0, enc: number[] = [], i = 0; i < str.length; i++) {
        const idx = chars.indexOf(str[i]);
        if (idx === -1) continue;
        enc[bc++] = idx;
        if (bc === 4) {
            output += String.fromCharCode((enc[0] << 2) | (enc[1] >> 4));
            if (enc[2] !== 64) output += String.fromCharCode(((enc[1] & 15) << 4) | (enc[2] >> 2));
            if (enc[3] !== 64) output += String.fromCharCode(((enc[2] & 3) << 6) | enc[3]);
            bc = 0;
        }
    }
    return output;
}

export async function loginUser({ email, password }: LoginPayload) {
    const res = await api.post("/login", { email, password });
    const data = res.data?.data ?? res.data;
    const token = data?.token ?? data?.access_token;
    if (!token) throw new Error("Token tidak ditemukan");

    const userFromApi = data?.user;
    if (userFromApi?.id) {
        return {
            token,
            user: {
                id: String(userFromApi.id),
                name: userFromApi.name ?? email.split("@")[0],
                role: userFromApi.role ?? "user",
                email: userFromApi.email ?? email,
            },
        };
    }

    try {
        const payload = JSON.parse(decodeBase64(token.split(".")[1]));
        return {
            token,
            user: {
                id: String(payload.sub ?? payload.id ?? payload.user_id),
                name: payload.name ?? payload.username ?? email.split("@")[0],
                role: payload.role ?? "user",
                email,
            },
        };
    } catch {
        throw new Error("Gagal memproses data pengguna");
    }
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