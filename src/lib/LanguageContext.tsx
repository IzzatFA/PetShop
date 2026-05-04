"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, Locale, Dictionary } from "./dictionaries";
import { useRouter } from "next/navigation";

type LanguageContextType = {
    locale: Locale;
    t: Dictionary;
    setLanguage: (lang: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");
    const router = useRouter();

    useEffect(() => {
        // Read cookie on mount
        const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
        if (match && (match[2] === "en" || match[2] === "id")) {
            setLocaleState(match[2] as Locale);
        }
    }, []);

    const setLanguage = (lang: Locale) => {
        setLocaleState(lang);
        document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`; // 1 year expiry
        router.refresh(); // Refresh Server Components to get new language!
    };

    const t = dictionaries[locale];

    return (
        <LanguageContext.Provider value={{ locale, t, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
}
