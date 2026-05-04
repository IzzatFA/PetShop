import Link from "next/link";
import { Plus, Edit2, Play, Pause, CheckCircle, XCircle } from "lucide-react";
import AdminActionButtons from "@/components/AdminActionButtons";
import { supabase } from "@/lib/supabase";

export default async function AdminAnimalsPage() {
    const { data: animals, error } = await supabase
        .from('animals')
        .select(`
      *,
      categories (
        name
      )
    `)
        .order('createdAt', { ascending: false });

    const processedAnimals = animals || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Animal Management</h1>
                    <p className="text-gray-500 mt-1">Create, update, and manage products (Supabase)</p>
                </div>
                <Link
                    href="/admin/animals/create"
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-pink-500/30 transition shadow-sm"
                >
                    <Plus size={20} />
                    <span>Add Animal</span>
                </Link>
            </div>

            {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">Error loading data: {error.message}</div>}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                <th className="px-6 py-4 font-semibold w-20">Image</th>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {processedAnimals.map((animal: any) => (
                                <tr key={animal.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                            {animal.imageUrl ? (
                                                <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{animal.name}</div>
                                        <div className="text-sm text-gray-500">{animal.species}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                            {animal.categories?.name || 'None'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        ${Number(animal.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {animal.isDeleted ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                                <XCircle size={14} /> Soft Deleted
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                <CheckCircle size={14} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link
                                            href={`/admin/animals/${animal.id}/edit`}
                                            className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </Link>

                                        <AdminActionButtons id={animal.id} isDeleted={animal.isDeleted} />
                                    </td>
                                </tr>
                            ))}
                            {processedAnimals.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        No animals found. Add one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
