import { supabase } from "@/lib/supabase";
import AnimalForm from "@/components/AnimalForm";

export default async function CreateAnimalPage() {
    const { data: categories } = await supabase.from('categories').select('*');

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Add New Animal</h1>
                <p className="text-gray-500 mt-1">Fill in the details to list a new animal in the store.</p>
            </div>

            <div className="glass glow-card rounded-2xl p-6 md:p-8 bg-white/80">
                <AnimalForm categories={categories || []} />
            </div>
        </div>
    );
}
