import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    try {
        const id = parseInt(resolvedParams.id);
        const body = await req.json();

        const { data: updated, error } = await supabase
            .from('animals')
            .update({ isDeleted: body.isDeleted })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    try {
        const id = parseInt(resolvedParams.id);
        const { error } = await supabase
            .from('animals')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    try {
        const id = parseInt(resolvedParams.id);
        const body = await req.json();

        if (!body.name || !body.species || !body.price || !body.categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data: updated, error } = await supabase
            .from('animals')
            .update({
                name: body.name,
                species: body.species,
                price: parseFloat(body.price),
                categoryId: parseInt(body.categoryId),
                description: body.description ?? null,
                imageUrl: body.imageUrl ?? null,
                stock: body.stock !== undefined ? Number(body.stock) : 1,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update animal" }, { status: 500 });
    }
}
