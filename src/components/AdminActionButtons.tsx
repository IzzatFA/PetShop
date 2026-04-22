"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Trash2 } from "lucide-react";

export default function AdminActionButtons({ id, isDeleted, role = "ADMIN" }: { id: number, isDeleted: boolean, role?: "ADMIN" | "SELLER" }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const toggleSoftDelete = async () => {
        setLoading(true);
        await fetch(`/api/${role.toLowerCase()}/animals/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: !isDeleted }),
        });
        setLoading(false);
        router.refresh();
    };

    const hardDelete = async () => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this animal?")) return;
        setLoading(true);
        await fetch(`/api/${role.toLowerCase()}/animals/${id}`, {
            method: 'DELETE',
        });
        setLoading(false);
        router.refresh();
    };

    return (
        <>
            <button
                onClick={toggleSoftDelete}
                disabled={loading}
                className={`p-2 rounded-lg transition ${isDeleted ? 'text-emerald-600 hover:bg-emerald-50' : 'text-orange-500 hover:bg-orange-50'}`}
                title={isDeleted ? "Restore (Undo Soft Delete)" : "Soft Delete (Pause)"}
            >
                {isDeleted ? <Play size={18} /> : <Pause size={18} />}
            </button>

            <button
                onClick={hardDelete}
                disabled={loading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Hard Delete"
            >
                <Trash2 size={18} />
            </button>
        </>
    );
}
