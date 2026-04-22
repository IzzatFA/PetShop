"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dog } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid email or password");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-pink-50">
            <div className="w-full max-w-md glass glow-card rounded-2xl p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-pink-400 opacity-20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-emerald-400 opacity-20 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="bg-pink-600 p-3 rounded-full text-white shadow-lg">
                            <Dog size={32} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{t.auth.welcome}</h2>
                    <p className="text-center text-gray-500 mb-8">{t.auth.signInDesc}</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {t.auth.invalidLogin}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.email}</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.password}</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-pink-700 hover:to-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? t.auth.signingIn : t.auth.signIn}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {t.auth.noAccount}{" "}
                        <Link href="/register" className="text-pink-600 font-medium hover:underline">
                            {t.auth.signUp}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
