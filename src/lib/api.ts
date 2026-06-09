import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, 
    timeout: 30000,
});

console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;