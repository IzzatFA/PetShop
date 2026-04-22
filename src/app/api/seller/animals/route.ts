import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SELLER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.name || !body.species || !body.price || !body.categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data: newAnimal, error } = await supabase
            .from('animals')
            .insert({
                name: body.name,
                species: body.species,
                price: parseFloat(body.price),
                categoryId: parseInt(body.categoryId),
                description: body.description ?? null,
                imageUrl: body.imageUrl ?? null,
                stock: body.stock !== undefined ? Number(body.stock) : 1,
                sellerId: session.user.id
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(newAnimal, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create animal" }, { status: 500 });
    }
}
