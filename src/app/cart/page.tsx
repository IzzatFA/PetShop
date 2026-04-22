import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import CartClient from "./CartClient";
import { getDictionary } from "@/lib/getLang";

export default async function UnifiedCartPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    const t = await getDictionary();

    const { data: orders, error } = await supabase
        .from("orders")
        .select(`
            id,
            totalPrice,
            status,
            createdAt,
            order_items (
                quantity,
                price,
                animals (
                    name,
                    imageUrl,
                    species
                )
            )
        `)
        .eq("userId", session.user.id)
        .order("createdAt", { ascending: false });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.cart.title}</h1>

            {/* Shopping Cart Layer */}
            <CartClient />

            {/* Order History Layer */}
            <div className="mt-20">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-pink-500 pl-4">{t.cart.history}</h1>

                {error ? (
                    <div className="text-center p-10 text-red-500">Gagal memuat pesanan: {error.message}</div>
                ) : (!orders || orders.length === 0) ? (
                    <div className="py-10 text-center">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">{t.cart.noHistory}</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order: any) => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Tanggal</p>
                                            <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total</p>
                                            <p className="text-sm font-black text-gray-900">${order.totalPrice}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                            <CheckCircleIcon /> {order.status}
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium hidden sm:inline">Order #{order.id.toString().padStart(6, '0')}</span>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100 p-6">
                                    {order.order_items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-6 py-4 first:pt-0 last:pb-0 items-center">
                                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                {item.animals?.imageUrl ? (
                                                    <img src={item.animals.imageUrl} alt={item.animals.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-pink-50 flex items-center justify-center text-[10px] text-pink-300 font-bold">No Photo</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 text-lg">{item.animals?.name || "Hewan Tidak Diketahui"}</h3>
                                                <p className="text-sm text-gray-500 mb-1">{item.animals?.species}</p>
                                                <p className="text-xs font-bold text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CheckCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    )
}
