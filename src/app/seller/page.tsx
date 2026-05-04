import Link from "next/link";
import { Plus, Edit2, CheckCircle, XCircle } from "lucide-react";
import AdminActionButtons from "@/components/AdminActionButtons";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/getLang";

export default async function SellerAnimalsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SELLER") redirect("/");

    const t = await getDictionary();

    const { data: animals, error } = await supabase
        .from('animals')
        .select(`
            *,
            categories ( name )
        `)
        .eq('sellerId', session.user.id)
        .order('createdAt', { ascending: false });

    const processedAnimals = animals || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t.seller.title}</h1>
                    <p className="text-gray-500 mt-1">{t.seller.desc}</p>
                </div>
                <Link
                    href="/seller/create"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition shadow-sm"
                >
                    <Plus size={20} />
                    <span>{t.seller.postNew}</span>
                </Link>
            </div>

            {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">Error loading data: {error.message}</div>}

            <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="px-6 py-4 font-semibold hover:text-gray-800 transition rounded-tl-lg w-20">{t.seller.image}</th>
                                <th className="px-6 py-4 font-semibold hover:text-gray-800 transition">{t.seller.name}</th>
                                <th className="px-6 py-4 font-semibold hover:text-gray-800 transition">{t.seller.category}</th>
                                <th className="px-6 py-4 font-semibold hover:text-gray-800 transition">{t.seller.stock}</th>
                                <th className="px-6 py-4 font-semibold hover:text-gray-800 transition">{t.seller.price}</th>
                                <th className="px-6 py-4 font-semibold text-center hover:text-gray-800 transition">{t.seller.status}</th>
                                <th className="px-6 py-4 font-semibold text-right hover:text-gray-800 transition rounded-tr-lg">{t.seller.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {processedAnimals.map((animal: any) => (
                                <tr key={animal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                            {animal.imageUrl ? (
                                                <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-400 text-xs">{t.seller.noImage}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{animal.name}</div>
                                        <div className="text-sm text-gray-500">{animal.species}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                            {animal.categories?.name || t.seller.none}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">
                                        {animal.stock || 0}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">
                                        ${Number(animal.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {animal.isDeleted ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                                <XCircle size={14} /> {t.seller.unlisted}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <CheckCircle size={14} /> {t.seller.active}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link
                                            href={`/seller/${animal.id}/edit`}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </Link>

                                        {/* Since components are now dynamic based on role, explicitly define the SELLER prop so actions don't misroute to Admin API paths. */}
                                        <AdminActionButtons id={animal.id} isDeleted={animal.isDeleted} role="SELLER" />
                                    </td>
                                </tr>
                            ))}
                            {processedAnimals.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 font-medium">
                                        {t.seller.noItems}
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
