"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function FilterBar({ categories }: { categories: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { locale } = useLanguage();

    const currentCategory = searchParams.get("category") || "";

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value) {
            params.set("category", e.target.value);
        } else {
            params.delete("category");
        }
        router.push(`/?${params.toString()}`);
    };

    const categoryTranslations: Record<string, string> = {
        "Cats": "Kucing",
        "Dogs": "Anjing",
        "Birds": "Burung",
        "Reptiles": "Reptil",
        "Fish": "Ikan",
        "Small Pets": "Hewan Kecil"
    };

    return (
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full md:w-auto">
            <Filter size={18} className="text-pink-500" />
            <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                {locale === 'id' ? 'Kategori:' : 'Category:'}
            </span>
            <select
                value={currentCategory}
                onChange={handleCategoryChange}
                className="flex-1 px-3 py-1.5 rounded-lg border-none bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-0 font-medium transition cursor-pointer hover:bg-gray-100"
            >
                <option value="">{locale === 'id' ? 'Semua Kategori' : 'All Categories'}</option>
                {categories.map(c => {
                    const displayName = locale === 'id' ? (categoryTranslations[c.name] || c.name) : c.name;
                    return <option key={c.id} value={c.id}>{displayName}</option>;
                })}
            </select>
        </div>
    );
}
