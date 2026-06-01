import api from "./api";
import { Platform } from "react-native";

export type ReportStatus = "pending" | "approved" | "on_progress" | "completed" | "rejected";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Report {
    id: number;
    user_id: number;
    user_name: string;
    title: string;
    description: string;
    category_id: number;
    category_name: string | null;
    location: string | null;
    priority: Priority;
    status: ReportStatus;
    latitude: number | null;
    longitude: number | null;
    image_url: string | null;
    images: string[];
    upvote_count: number;
    comment_count: number;
    edit_count: number;
    reject_reason: string | null;
    created_at: string;
    updated_at: string;
}

// ── GET ALL ───────────────────────────────────────────
export async function getReports(params?: {
    category?: string;
    status?: string;
    priority?: string;
    sort?: string;
}): Promise<Report[]> {
    const res = await api.get("/reports", { params });
    return res.data;
}

// ── GET BY ID ─────────────────────────────────────────
export async function getReportById(id: number): Promise<Report> {
    const res = await api.get(`/reports/${id}`);
    return res.data;
}

// ── CREATE ────────────────────────────────────────────
export async function createReport(payload: {
    title: string;
    description: string;
    category_id: number;
    priority: Priority;
    location?: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
}): Promise<Report> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("category_id", String(payload.category_id));
    formData.append("priority", payload.priority);
    if (payload.location) formData.append("location", payload.location);
    if (payload.latitude && payload.latitude !== 0) {
        formData.append("latitude", String(payload.latitude));
    }
    if (payload.longitude && payload.longitude !== 0) {
        formData.append("longitude", String(payload.longitude));
    }

    if (payload.images && payload.images.length > 0) {
        for (let i = 0; i < payload.images.length; i++) {
            const uri = payload.images[i];
            if (Platform.OS === "web") {
                try {
                    const response = await fetch(uri);
                    const blob = await response.blob();
                    const filename = `photo_${i}.${blob.type.includes("png") ? "png" : "jpg"}`;
                    formData.append("images", blob, filename);
                } catch (err) {
                    console.error("Gagal convert foto:", err);
                }
            } else {
                const filename = uri.split("/").pop() ?? `photo_${i}.jpg`;
                const type = filename.endsWith(".png") ? "image/png" : "image/jpeg";
                formData.append("images", { uri, name: filename, type } as any);
            }
        }
    }

    const res = await api.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

// ── UPVOTE ────────────────────────────────────────────
export async function toggleUpvote(reportId: number): Promise<{ upvote_count: number; upvoted: boolean }> {
    const res = await api.post(`/reports/${reportId}/upvote`);
    return res.data;
}

export async function getUpvoteStatus(reportId: number): Promise<{ upvote_count: number; upvoted: boolean }> {
    const res = await api.get(`/reports/${reportId}/upvote`);
    return res.data;
}