import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, 
    timeout: 10000,
});

console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(err)
);


export default api;