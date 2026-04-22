import { supabase } from "@/lib/supabase";
import AnimalForm from "@/components/AnimalForm";
import { notFound } from "next/navigation";

export default async function SellerEditPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { data: categories } = await supabase.from('categories').select('*');
    const { data: animal } = await supabase.from('animals').select('*').eq('id', resolvedParams.id).single();

    if (!animal) return notFound();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Edit Listing</h1>
            </div>

            <div className="glass glow-card rounded-2xl p-6 md:p-8 bg-white/80 shadow border border-emerald-100">
                <AnimalForm categories={categories || []} initialData={animal} role="SELLER" />
            </div>
        </div>
    );
}
