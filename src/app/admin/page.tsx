"use client";

import { useState, useEffect } from "react";
import { Users, Cat, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

export default function AdminDashboardPage() {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [stats, setStats] = useState({ users: 0, animals: 0, orders: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    setRecentUsers(data.recentUsers);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if (session) fetchStats();
    }, [session]);

    if (!session) return <div className="p-6">Loading session...</div>;
    if (loading) return <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 border-none">
            <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 border border-white"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-3 tracking-tight">{t.admin.welcome}, {session.user.name}</h2>
                    <p className="text-emerald-100 mb-8 max-w-xl text-lg opacity-90">{t.admin.desc}</p>
                    <div className="flex gap-4">
                        <Link href="/admin/users" className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-3 rounded-2xl font-medium transition-all shadow-lg hover:shadow-xl border border-white/20 flex items-center gap-2 group">
                            {t.admin.monitor} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50 flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100     to-blue-50 flex items-center justify-center shadow-inner">
                        <Users className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{t.admin.totalUsers}</p>
                        <h3 className="text-4xl font-black text-gray-800">{stats.users}</h3>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-50 flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-inner">
                        <Cat className="w-10 h-10 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{t.admin.totalAnimals}</p>
                        <h3 className="text-4xl font-black text-gray-800">{stats.animals}</h3>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-50 flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-inner">
                        <ShoppingBag className="w-10 h-10 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{t.admin.totalOrders}</p>
                        <h3 className="text-4xl font-black text-gray-800">{stats.orders}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-emerald-500 pl-4">{t.admin.recentUsers}</h3>
                    <Link href="/admin/users" className="text-sm px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-semibold">{t.admin.viewAll}</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="pb-4 font-semibold uppercase tracking-wider">{t.admin.name}</th>
                                <th className="pb-4 font-semibold uppercase tracking-wider">{t.admin.email}</th>
                                <th className="pb-4 font-semibold uppercase tracking-wider">{t.admin.role}</th>
                                <th className="pb-4 font-semibold uppercase tracking-wider">{t.admin.date}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((u: any) => (
                                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-5 text-gray-800 font-bold flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold group-hover:scale-105 transition-transform">{u.name?.charAt(0) || "U"}</div>
                                        {u.name || "Unknown"}
                                    </td>
                                    <td className="py-5 text-gray-600 font-medium">{u.email}</td>
                                    <td className="py-5">
                                        <span className={`px-4 py-1.5 text-xs font-bold rounded-full border 
                                            ${u.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                                                u.role === 'SELLER' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-5 text-gray-500 text-sm font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {recentUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-gray-500">{t.admin.noUsers}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
