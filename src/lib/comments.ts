import api from "./api";

export interface Comment {
    id: number;
    report_id: number;
    user_id: number;
    name: string;
    comment: string;
    type: "public" | "official";
    created_at: string;
}

export async function getComments(reportId: number): Promise<Comment[]> {
    const res = await api.get(`/reports/${reportId}/comments`);
    return res.data;
}

export async function createComment(payload: {
    report_id: number;
    comment: string;
}): Promise<Comment> {
    const res = await api.post("/comments", payload);
    return res.data;
}

export async function deleteComment(commentId: number): Promise<void> {
    await api.delete(`/comments/${commentId}`);
}
