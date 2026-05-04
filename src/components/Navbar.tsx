"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Dog, Settings, User, LogOut, Search, Shield, ShoppingCart, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
    const { data: session } = useSession();
    const { cartItems } = useCart();
    const { t, locale, setLanguage } = useLanguage();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search) {
            window.location.href = `/?search=${encodeURIComponent(search)}`;
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-pink-600 p-2 rounded-xl text-white group-hover:bg-pink-700 transition">
                            <Dog size={24} />
                        </div>
                        <span className="font-bold text-xl text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-emerald-600">
                            Rumah Hewan
                        </span>
                    </Link>

                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder={t.nav.searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all shadow-sm"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Selection Toggle */}
                        <div className="flex flex-col items-center bg-gray-100 p-1 rounded-lg">
                            <div className="flex text-xs font-bold w-16">
                                <button
                                    className={`flex-1 py-1 rounded text-center transition-all ${locale === 'en' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400'}`}
                                    onClick={() => setLanguage('en')}
                                >
                                    EN
                                </button>
                                <button
                                    className={`flex-1 py-1 rounded text-center transition-all ${locale === 'id' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400'}`}
                                    onClick={() => setLanguage('id')}
                                >
                                    ID
                                </button>
                            </div>
                        </div>

                        {session ? (
                            <div className="flex items-center gap-3">
                                {session.user.role === "ADMIN" && (
                                    <Link href="/admin" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-pink-50">
                                        <Shield size={18} />
                                        <span className="hidden sm:inline">{t.nav.admin}</span>
                                    </Link>
                                )}
                                {session.user.role === "SELLER" && (
                                    <Link href="/seller" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-pink-50">
                                        <User size={18} />
                                        <span className="hidden sm:inline">{t.nav.seller}</span>
                                    </Link>
                                )}
                                <div className="flex items-center gap-2 group relative border-l border-gray-200 pl-3 ml-1">
                                    <Link href="/cart" className="p-2 text-gray-500 hover:text-pink-600 transition-colors relative" title={t.nav.cart}>
                                        <ShoppingCart size={20} />
                                        {mounted && cartCount > 0 && (
                                            <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link href="/settings" className="p-2 text-gray-500 hover:text-gray-900 transition-colors hover:bg-gray-100 rounded-lg" title={t.nav.settings}>
                                        <Settings size={20} />
                                    </Link>
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-pink-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer ml-1">
                                        {session.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                        <LogOut size={18} />
                                        <span className="hidden sm:inline">{t.nav.logout}</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
                                    {t.nav.login}
                                </Link>
                                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-full shadow-md shadow-pink-500/20 transition-all active:scale-95">
                                    {t.nav.register}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
