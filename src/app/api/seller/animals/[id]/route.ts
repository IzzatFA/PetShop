import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SELLER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = parseInt(resolvedParams.id);
        const body = await req.json();

        const { data: updated, error } = await supabase
            .from('animals')
            .update({ isDeleted: body.isDeleted })
            .eq('id', id)
            .eq('sellerId', session.user.id) // security check isolate to specific seller
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
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SELLER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = parseInt(resolvedParams.id);
        const { error } = await supabase
            .from('animals')
            .delete()
            .eq('id', id)
            .eq('sellerId', session.user.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SELLER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
            .eq('sellerId', session.user.id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update animal" }, { status: 500 });
    }
}
