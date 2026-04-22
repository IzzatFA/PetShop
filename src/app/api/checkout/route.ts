import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const cartItems = await req.json();

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Verify Inventory Constraints Before Transaction Start
        for (const item of cartItems) {
            const { data: animal } = await supabase.from('animals').select('stock, name').eq('id', item.animalId).single();
            if (!animal || animal.stock < item.quantity) {
                return NextResponse.json({ error: `Not enough stock for ${item.name}` }, { status: 400 });
            }
        }

        const totalPrice = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

        // 1. Create the overarching Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                userId: session.user.id,
                totalPrice: totalPrice,
                status: "COMPLETED"
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Prepare and Insert the exact Line Items associated to the order
        const lineItems = cartItems.map((item: any) => ({
            orderId: order.id,
            animalId: item.animalId,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(lineItems);

        if (itemsError) throw itemsError;

        // Drain Stock Quantities
        for (const item of cartItems) {
            const { data: animal } = await supabase.from('animals').select('stock').eq('id', item.animalId).single();
            if (animal) {
                await supabase.from('animals').update({ stock: Math.max(0, animal.stock - item.quantity) }).eq('id', item.animalId);
            }
        }

        return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
    } catch (e: any) {
        console.error("Checkout Error:", e);
        return NextResponse.json({ error: "Checkout sequence failed" }, { status: 500 });
    }
}
