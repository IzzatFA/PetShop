import { supabase } from "@/lib/supabase";
import AnimalForm from "@/components/AnimalForm";

export default async function SellerCreatePage() {
    const { data: categories } = await supabase.from('categories').select('*');

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Post New Listing</h1>
                <p className="text-gray-500 mt-2">Fill in your pet's details to publish it broadly across the store.</p>
            </div>

            <div className="glass glow-card rounded-2xl p-6 md:p-8 bg-white/80 shadow border border-emerald-100">
                <AnimalForm categories={categories || []} role="SELLER" />
            </div>
        </div>
    );
}
