"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function UpgradeSellerPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const { t } = useLanguage();

    const [fileOptions, setFileOptions] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");

    const handleUpgrade = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fileOptions) {
            setError("Please upload a KTP image to continue.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            setUploadingImage(true);
            const fd = new FormData();
            fd.append("file", fileOptions);

            const upRes = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });

            if (!upRes.ok) throw new Error("Image upload failed. Is your storage bucket configured?");
            const upData = await upRes.json();
            const finalImageUrl = upData.url;
            setUploadingImage(false);

            const res = await fetch("/api/user/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetRole: "SELLER", ktpUrl: finalImageUrl }),
            });

            if (res.ok) {
                await update({ role: "SELLER" });
                router.refresh();
                router.push("/seller");
            } else {
                setError("Upgrade failed. Please try again.");
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
            setUploadingImage(false);
        }
    };

    if (!session) return <div className="p-6">Loading session...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/settings" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Settings
            </Link>

            <div className="bg-white p-8 rounded-2xl shadow border border-gray-100">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{t.upgrade.title}</h2>
                <p className="text-gray-600 mb-8">
                    {t.upgrade.desc}
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpgrade} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.upgrade.uploadKtp}
                        </label>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />

                            <label className="cursor-pointer">
                                <span className="mt-2 block text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                                    {t.upgrade.browseTitle}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFileOptions(e.target.files[0]);
                                            setError("");
                                        }
                                    }}
                                />
                            </label>

                            {fileOptions ? (
                                <p className="mt-2 text-sm text-gray-600">{t.upgrade.selected}: {fileOptions.name}</p>
                            ) : (
                                <p className="mt-2 text-sm text-gray-500">{t.upgrade.browseDesc}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => router.push("/settings")}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                        >
                            {t.upgrade.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {uploadingImage ? (
                                <><Loader2 className="animate-spin w-4 h-4 mr-2" /> {t.upgrade.uploading}</>
                            ) : loading ? (
                                <><Loader2 className="animate-spin w-4 h-4 mr-2" /> {t.upgrade.processing}</>
                            ) : (
                                t.upgrade.submit
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
