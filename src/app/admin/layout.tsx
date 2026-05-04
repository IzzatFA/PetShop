import Link from "next/link";
import { getDictionary } from "@/lib/getLang";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const t = await getDictionary();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">{t.admin.dashboard}</h1>
                    <nav className="flex items-center gap-6">
                        <Link href="/admin" className="text-emerald-700 hover:text-emerald-900 font-semibold">
                            {t.admin.dashboard}
                        </Link>
                        <Link href="/admin/users" className="text-emerald-600 hover:text-emerald-800 font-medium">
                            {t.admin.monitor}
                        </Link>
                        <Link href="/admin/animals" className="text-emerald-600 hover:text-emerald-800 font-medium">
                            {t.admin.manage}
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
