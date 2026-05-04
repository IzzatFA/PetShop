"use client";

import { useCart } from "@/lib/CartContext";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function CartClient() {
    const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const { t } = useLanguage();

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartItems)
            });

            if (!res.ok) throw new Error("Checkout failed");

            clearCart();
            window.location.reload(); // Refresh the unified page to show new history
        } catch (e) {
            console.error(e);
            alert("Error checking out. Please try again.");
            setIsCheckingOut(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="py-20 text-center">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.cart.emptyTitle}</h2>
                <p className="text-gray-500">{t.cart.emptyDesc}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
                {cartItems.map((item) => (
                    <div key={item.animalId} className="flex p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 gap-4 md:gap-6 items-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-50 rounded-xl overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[10px] text-pink-300 w-full h-full flex items-center justify-center font-bold">{t.cart.noImage}</span>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg md:text-xl text-gray-900">{item.name}</h3>
                                <p className="font-semibold text-pink-600">${item.price}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <button
                                    onClick={() => updateQuantity(item.animalId, item.quantity - 1)}
                                    className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition"
                                >-</button>
                                <span className="font-bold text-gray-700 w-4 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.animalId, item.quantity + 1)}
                                    className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition"
                                >+</button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.animalId)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Checkout Summary */}
            <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t.cart.orderSummary}</h2>

                    <div className="space-y-4 mb-6 text-gray-600">
                        <div className="flex justify-between">
                            <span>{t.cart.subtotal} ({cartItems.length} {t.cart.items})</span>
                            <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t.cart.taxes}</span>
                            <span className="text-emerald-600 font-medium">{t.cart.included}</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 mb-8">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 text-lg">{t.cart.total}</span>
                            <span className="font-black text-3xl text-pink-600">${subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-75"
                    >
                        {isCheckingOut ? t.cart.processing : (
                            <>
                                <span>{t.cart.processAdoption}</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
