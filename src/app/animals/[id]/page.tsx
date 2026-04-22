import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { getDictionary } from "@/lib/getLang";

export default async function AnimalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const t = await getDictionary();

    const { data: animal } = await supabase
        .from('animals')
        .select('*, categories(name), users(name, email)') // users => seller
        .eq('id', resolvedParams.id)
        .single();

    if (!animal || animal.isDeleted) return notFound();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link href="/buyer" className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-600 mb-8 transition font-medium">
                <ArrowLeft size={20} /> {t.product.backToCatalog}
            </Link>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2 aspect-square md:aspect-auto md:min-h-[500px] bg-pink-50 relative">
                    {animal.imageUrl ? (
                        <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-pink-300">
                            <Search size={64} className="mb-4 opacity-50" />
                            <span className="font-bold">{t.product.noPhoto}</span>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                    <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 font-bold text-sm rounded-full">
                            {animal.categories?.name}
                        </span>
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{animal.name}</h1>
                    <p className="text-xl font-medium text-gray-500 mb-6">{animal.species}</p>

                    <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-2">{t.product.about} {animal.name}</h3>
                        <p className="text-gray-600 leading-relaxed min-h-[100px]">
                            {animal.description || t.product.noDesc}
                        </p>
                    </div>

                    <div className="mt-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">{t.product.listedBy}</p>
                                <p className="font-bold text-gray-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-pink-500" />
                                    {animal.users?.name || t.product.independentSeller}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">{t.product.price}</p>
                                <p className="font-black text-4xl text-gray-900">${animal.price}</p>
                            </div>
                        </div>

                        <AddToCartButton animal={animal} />
                    </div>
                </div>
            </div>
        </div>
    );
}
