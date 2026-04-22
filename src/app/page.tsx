import Link from "next/link";
import { SearchX, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getDictionary } from "@/lib/getLang";
import FilterBar from "@/components/FilterBar";
import { cookies } from "next/headers";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const currentParams = await searchParams;
  const searchString = currentParams.search || "";
  const categoryString = currentParams.category || "";
  const t = await getDictionary();
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  const { data: categories } = await supabase.from("categories").select("*");

  // The QUERY JOIN requirement ported to Supabase SDK
  let query = supabase
    .from('animals')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('isDeleted', false)
    .gt('stock', 0)
    .order('createdAt', { ascending: false });

  if (searchString) {
    // Basic ilike queries for searching name or species
    query = query.or(`name.ilike.%${searchString}%,species.ilike.%${searchString}%`);
  }

  if (categoryString) {
    query = query.eq('categoryId', categoryString);
  }

  const { data: animals, error } = await query;

  // Since we could have filtered by category conceptually, for now name/species are enough.
  const processedAnimals = animals || [];

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-600 mb-4 tracking-tight">
          {t.home.heroTitle}
        </h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
          {t.home.heroSubtitle}
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {searchString && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Search results for: </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">"{searchString}"</span>
            <Link href="/" className="text-sm text-pink-500 hover:underline ml-2">Clear search</Link>
          </div>
        )}
        <div className={!searchString ? "w-full flex justify-end" : ""}>
          <FilterBar categories={categories || []} />
        </div>
      </div>

      {error ? (
        <div className="text-red-500 text-center">Error loading animals: {error.message}</div>
      ) : processedAnimals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <SearchX size={64} className="mb-4 text-gray-300" />
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">No animals found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {processedAnimals.map((animal) => (
            <div key={animal.id} className="glass glow-card rounded-2xl overflow-hidden flex flex-col h-full bg-white transition-all transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {animal.imageUrl ? (
                  <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <span className="text-4xl text-gray-300">🐾</span>
                  </div>
                )}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-pink-600 font-bold px-3 py-1 text-xs rounded-full shadow-sm border border-pink-100">
                  {animal.categories?.name || 'Unknown'}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{animal.name}</h3>
                  <span className="font-semibold text-pink-600">${Number(animal.price).toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {animal.description || `A beautiful ${animal.species} looking for a home.`}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link
                    href={`/animals/${animal.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-emerald-500 text-white py-2 rounded-xl hover:shadow-lg hover:from-pink-700 hover:to-emerald-600 transition-all active:scale-95"
                  >
                    <ShoppingBag size={18} />
                    <span>{t.nav.adopt}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
