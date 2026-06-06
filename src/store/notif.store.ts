import { create } from "zustand";

interface NotifState {
    unreadCount: number;
    setUnreadCount: (count: number) => void;
}

export const useNotifStore = create<NotifState>((set) => ({
    unreadCount: 0,
    setUnreadCount: (count) => set({ unreadCount: count }),
}));

