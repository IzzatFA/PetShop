import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkoutService } from "@/services/checkout.service";

export const checkoutController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const cartItems = await req.json();

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        try {
            const orderId = await checkoutService.processCheckout(session.user.id, cartItems);
            return NextResponse.json({ success: true, orderId }, { status: 201 });
        } catch (error: any) {
            if (error.message.startsWith("Not enough stock")) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            throw error;
        }

    } catch (e: any) {
        console.error("Checkout Error:", e);
        return NextResponse.json({ error: "Checkout sequence failed" }, { status: 500 });
    }
};
