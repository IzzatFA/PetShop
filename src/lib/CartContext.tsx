"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
    animalId: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (animalId: number) => void;
    clearCart: () => void;
    updateQuantity: (animalId: number, qty: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // key bound to user ID or guest
    const cartKey = session?.user?.id ? `cart_items_${session.user.id}` : "cart_items_guest";

    useEffect(() => {
        if (status === "loading") return;
        const stored = localStorage.getItem(cartKey);
        if (stored) {
            try { setCartItems(JSON.parse(stored)); } catch (e) {
                console.error("Cart retrieval fail", e)
            }
        } else {
            setCartItems([]);
        }
        setIsHydrated(true);
    }, [cartKey, status]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.animalId === item.animalId);
            let updated;
            if (existing) {
                updated = prev.map(i => i.animalId === item.animalId ? { ...i, quantity: i.quantity + item.quantity } : i);
            } else {
                updated = [...prev, item];
            }
            localStorage.setItem(cartKey, JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromCart = (animalId: number) => {
        setCartItems(prev => {
            const updated = prev.filter(i => i.animalId !== animalId);
            localStorage.setItem(cartKey, JSON.stringify(updated));
            return updated;
        });
    };

    const updateQuantity = (animalId: number, qty: number) => {
        if (qty <= 0) return removeFromCart(animalId);
        setCartItems(prev => {
            const updated = prev.map(i => i.animalId === animalId ? { ...i, quantity: qty } : i);
            localStorage.setItem(cartKey, JSON.stringify(updated));
            return updated;
        });
    }

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(cartKey);
    };

    // Before hydration, skip rendering items from localStorage to prevent server mismatch
    return (
        <CartContext.Provider value={{ cartItems: isHydrated ? cartItems : [], addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}
