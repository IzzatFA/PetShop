"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/CartContext";
import { LanguageProvider } from "@/lib/LanguageContext";

export function ClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LanguageProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </LanguageProvider>
        </SessionProvider>
    );
}
