import AnimalForm from "@/components/AnimalForm";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function EditAnimalPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // Parallel Supabase fetching without Prisma
    const [animalRes, categoriesRes] = await Promise.all([
        supabase.from('animals').select('*').eq('id', id).single(),
        supabase.from('categories').select('*')
    ]);

    if (animalRes.error || !animalRes.data) return notFound();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Animal</h1>
                <p className="text-gray-500 mt-1">Update details for {animalRes.data.name}</p>
            </div>

            <div className="glass glow-card rounded-2xl p-6 md:p-8 bg-white/80">
                <AnimalForm categories={categoriesRes.data || []} initialData={animalRes.data} />
            </div>
        </div>
    );
}
