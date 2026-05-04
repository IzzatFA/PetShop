"use client";

import { ShoppingCart, CheckCircle, AlertCircle, X, UserPlus } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function AddToCartButton({ animal }: { animal: any }) {
    const { addToCart } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [added, setAdded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const { t } = useLanguage();

    const handleAdd = () => {
        if (!session) {
            setShowPopup(true);
            return;
        }

        addToCart({
            animalId: animal.id,
            name: animal.name,
            price: animal.price,
            imageUrl: animal.imageUrl,
            quantity: 1
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    return (
        <>
            <button
                onClick={handleAdd}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${added
                    ? "bg-emerald-500 text-white shadow-emerald-500/30"
                    : "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-500/30 shadow-lg hover:-translate-y-1"
                    }`}
            >
                {added ? (
                    <>
                        <CheckCircle size={24} />
                        <span>Added to Cart!</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart size={24} />
                        <span>Add to Cart - ${animal.price}</span>
                    </>
                )}
            </button>

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-16 h-16 bg-pink-50 border-2 border-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <AlertCircle className="w-8 h-8 text-pink-500" />
                        </div>

                        <h3 className="text-2xl font-black text-center text-gray-800 mb-3 tracking-tight">Login Required!</h3>
                        <p className="text-center text-gray-500 mb-8 font-medium">
                            Silakan mendaftar atau login akun terlebih dahulu untuk mulai melakukan transaksi dan mengadopsi hewan lucu ini.
                        </p>

                        <div className="flex gap-4 flex-col sm:flex-row">
                            <button
                                onClick={() => router.push("/register")}
                                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white rounded-2xl shadow-lg shadow-pink-500/20 font-bold transition-all flex justify-center items-center gap-2"
                            >
                                <UserPlus size={18} /> Register Now
                            </button>
                            <button
                                onClick={() => router.push("/login")}
                                className="flex-1 py-3.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-2xl font-bold transition-all flex justify-center items-center shadow-sm"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
