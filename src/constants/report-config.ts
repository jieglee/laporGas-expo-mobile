export type ReportStatus = "pending" | "approved" | "on_progress" | "completed" | "rejected";
export type Priority = "low" | "medium" | "high" | "urgent";

export const STATUS_CFG: Record<ReportStatus, {
    label: string;
    color: string;
    bg: string;
    dot: string;
}> = {
    pending: { label: "Menunggu", color: "#92400E", bg: "#FEF3C7", dot: "#F59E0B" },
    approved: { label: "Disetujui", color: "#1E40AF", bg: "#DBEAFE", dot: "#3B82F6" },
    on_progress: { label: "Diproses", color: "#C2410C", bg: "#FFEDD5", dot: "#FB923C" },
    completed: { label: "Selesai", color: "#065F46", bg: "#D1FAE5", dot: "#10B981" },
    rejected: { label: "Ditolak", color: "#991B1B", bg: "#FEE2E2", dot: "#EF4444" },
};

export const PRIORITY_CFG: Record<Priority, {
    label: string;
    color: string;
    bg: string;
}> = {
    low: { label: "Rendah", color: "#374151", bg: "#F3F4F6" },
    medium: { label: "Sedang", color: "#92400E", bg: "#FEF3C7" },
    high: { label: "Tinggi", color: "#C2410C", bg: "#FFEDD5" },
    urgent: { label: "Urgent", color: "#991B1B", bg: "#FEE2E2" },
};

export const CATEGORIES = [
    { id: "1", label: "Infrastruktur" },
    { id: "2", label: "Fasilitas Umum" },
    { id: "3", label: "Kebersihan" },
    { id: "4", label: "Lalu Lintas" },
];
