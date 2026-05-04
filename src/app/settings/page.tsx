"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Store, Loader2, ShieldAlert, User, Save, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const { t } = useLanguage();

    const [isUpgradingSeller, setIsUpgradingSeller] = useState(false);
    const [isUpgradingAdmin, setIsUpgradingAdmin] = useState(false);

    // Profile State
    const [name, setName] = useState(session?.user?.name || "");
    const [password, setPassword] = useState("");
    const [isSavingName, setIsSavingName] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const handleUpgrade = async (targetRole: string, setLoading: (b: boolean) => void) => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetRole }),
            });
            if (res.ok) {
                await update({ role: targetRole });
                router.refresh();
                if (targetRole === "SELLER") router.push("/seller");
                if (targetRole === "ADMIN") router.push("/admin");
            } else {
                alert("Upgrade failed. Please try again.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (field: "name" | "password") => {
        const value = field === "name" ? name : password;
        if (!value.trim()) return;

        const setLoading = field === "name" ? setIsSavingName : setIsSavingPassword;
        setLoading(true);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: value }),
            });

            if (res.ok) {
                if (field === "name") {
                    await update({ name });
                    router.refresh();
                } else {
                    setPassword(""); // clear password input on success
                    alert("Password updated successfully!");
                }
            } else {
                alert("Failed to update profile.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };


    if (!session) return <div className="p-6">Loading...</div>;

    const currentRole = session.user.role;

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white shadow rounded-2xl border border-gray-100 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold mb-1 text-gray-800">Your Current Plan: <span className="text-pink-600">{currentRole}</span></h2>
                    <p className="text-gray-600">Manage your profile and privileges.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* PROFILE INFORMATION */}
                <div className="p-6 bg-white shadow rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <User className="text-gray-400" /> {t.settings.personalInfo}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                                />
                                <button
                                    onClick={() => handleUpdateProfile("name")}
                                    disabled={isSavingName || name === session.user.name}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSavingName ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-xs text-gray-400 font-normal">(Cannot be changed)</span></label>
                            <input
                                type="email"
                                value={session.user.email || ""}
                                disabled
                                className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* SECURITY */}
                <div className="p-6 bg-white shadow rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <Lock className="text-gray-400" /> {t.settings.security}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                                />
                                <button
                                    onClick={() => handleUpdateProfile("password")}
                                    disabled={isSavingPassword || !password.trim()}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSavingPassword ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* SELLER UPGRADE / SELLER STATUS */}
                {(currentRole === "CUSTOMER" || currentRole === "BUYER" || currentRole === "ADMIN") && (
                    <div className="p-6 border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/50 flex flex-col gap-4 shadow-sm hover:bg-emerald-50 transition-colors">
                        <div>
                            <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 mb-2">
                                <Store className="text-emerald-600" /> Become a Seller
                            </h3>
                            <p className="text-emerald-800 w-[90%] text-sm">Turn your account into a merchant store and begin managing your own pets catalog online.</p>
                        </div>
                        <button
                            onClick={() => router.push("/settings/upgrade")}
                            className="mt-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl shadow hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center"
                        >
                            {isUpgradingSeller ? <Loader2 className="animate-spin w-5 h-5" /> : "Upgrade to Store"}
                        </button>
                    </div>
                )}



            </div>
        </div>
    );
}
