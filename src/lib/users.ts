import api from "./api";

export async function updateProfile(data: {
    name?: string;
    email?: string;
    password?: string;
}): Promise<{ id: number; name: string; email: string; role: string }> {
    const res = await api.patch("/users/me/profile", data);
    return res.data;
}
