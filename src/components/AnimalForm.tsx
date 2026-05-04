"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnimalForm({
    categories,
    initialData,
    role = "ADMIN"
}: {
    categories: any[],
    initialData?: any,
    role?: "ADMIN" | "SELLER"
}) {
    const isEditing = !!initialData;
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        species: initialData?.species || "",
        price: initialData?.price?.toString() || "",
        categoryId: initialData?.categoryId?.toString() || (categories[0]?.id.toString() || ""),
        description: initialData?.description || "",
        imageUrl: initialData?.imageUrl || "",
        stock: initialData?.stock?.toString() || "1",
    });

    const [fileOptions, setFileOptions] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let finalImageUrl = formData.imageUrl;

            if (fileOptions) {
                setUploadingImage(true);
                const fd = new FormData();
                fd.append("file", fileOptions);

                const upRes = await fetch("/api/upload", {
                    method: "POST",
                    body: fd,
                });
                if (!upRes.ok) throw new Error("Image upload failed. Is your storage bucket configured?");

                const upData = await upRes.json();
                finalImageUrl = upData.url;
                setUploadingImage(false);
            }

            const baseUrl = role === "ADMIN" ? "/api/admin/animals" : "/api/seller/animals";
            const url = isEditing ? `${baseUrl}/${initialData.id}` : baseUrl;
            const method = isEditing ? 'PUT' : 'POST';

            const payloadData = { ...formData, imageUrl: finalImageUrl };
            payloadData.stock = Number(payloadData.stock) || 1;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadData),
            });

            if (!res.ok) {
                throw new Error("Failed to save animal");
            }

            const redirectPath = role === "ADMIN" ? "/admin/animals" : "/seller";
            router.push(redirectPath);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Species / Breed</label>
                    <input
                        type="text"
                        name="species"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        value={formData.species}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock / Jumlah</label>
                    <input
                        type="number"
                        min="1"
                        name="stock"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        value={formData.stock}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        name="categoryId"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        value={formData.categoryId}
                        onChange={handleChange}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Representation</label>

                {/* Visual Preview / Old Image state UI */}
                {formData.imageUrl && !fileOptions && (
                    <div className="mb-2 w-32 h-32 rounded-xl overflow-hidden border-2 border-emerald-100 flex items-center justify-center bg-gray-50">
                        <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                )}
                {fileOptions && (
                    <div className="mb-2 px-3 py-2 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 inline-block text-sm">
                        Selected File: <span className="font-semibold">{fileOptions.name}</span>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setFileOptions(e.target.files[0]);
                        }
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => router.push(role === 'ADMIN' ? '/admin/animals' : '/seller')}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                >
                    {uploadingImage ? "Uploading Photo..." : loading ? "Saving..." : isEditing ? "Update Animal" : "List Animal"}
                </button>
            </div>
        </form>
    );
}
