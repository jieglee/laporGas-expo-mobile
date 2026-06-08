import { useEffect, useRef, useState } from "react";

const API = process.env.EXPO_PUBLIC_API_URL;

interface AIResult {
    category_id: string;
    priority: string;
    confidence: number;
}

interface Props {
    title: string;
    description: string;
    onResult: (result: AIResult) => void;
    minTitleLen?: number;
    minDescLen?: number;
    debounceMs?: number;
}

export function useAICategorizer({
    title,
    description,
    onResult,
    minTitleLen = 5,
    minDescLen = 20,
    debounceMs = 1200,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [lastResult, setLastResult] = useState<AIResult | null>(null);
    const [error, setError] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastInputRef = useRef("");

    useEffect(() => {
        const inputKey = `${title}|${description}`;
        if (inputKey === lastInputRef.current) return;
        if (title.length < minTitleLen || description.length < minDescLen) {
            setLastResult(null);
            return;
        }
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            lastInputRef.current = inputKey;
            setLoading(true);
            setError(false);
            try {
                const url = `${API}/ai/categorize`;
                console.log("[AI] Fetching:", url);
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description }),
                });
                const data = await res.json();
                console.log("[AI] Response:", data);

                if (data.success && data.data) {
                    // Normalize category_id ke string
                    const result: AIResult = {
                        category_id: String(data.data.category_id),
                        priority: data.data.priority,
                        confidence: data.data.confidence,
                    };
                    setLastResult(result);
                    onResult(result);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("[AI] Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }, debounceMs);

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [title, description]);

    return { loading, lastResult, error };
}
