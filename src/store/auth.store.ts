import { create } from "zustand";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Helper biar jalan di web juga
const storage = {
    getItem: async (key: string) => {
        if (Platform.OS === "web") return localStorage.getItem(key);
        return SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
        if (Platform.OS === "web") { localStorage.setItem(key, value); return; }
        return SecureStore.setItemAsync(key, value);
    },
    deleteItem: async (key: string) => {
        if (Platform.OS === "web") { localStorage.removeItem(key); return; }
        return SecureStore.deleteItemAsync(key);
    },
};

interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin" | "superadmin";
}

interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
    loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,

    setAuth: async (token, user) => {
        await storage.setItem("token", token);
        await storage.setItem("user", JSON.stringify(user));
        set({ token, user });
    },

    logout: async () => {
        await storage.deleteItem("token");
        await storage.deleteItem("user");
        set({ token: null, user: null });
    },

    loadFromStorage: async () => {
        const token = await storage.getItem("token");
        const userStr = await storage.getItem("user");
        if (token && userStr) {
            set({ token, user: JSON.parse(userStr) });
        }
    },
}));
