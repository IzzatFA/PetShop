import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { action } = await req.json(); // "SUSPEND" or "RESTORE" or "PROMOTE_ADMIN"
        let roleParams = {};

        if (action === "SUSPEND") roleParams = { role: "SUSPENDED" };
        else if (action === "RESTORE") roleParams = { role: "BUYER" }; // defaults back to customer
        else if (action === "PROMOTE_ADMIN") roleParams = { role: "ADMIN" };
        else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

        const { error } = await supabase
            .from("users")
            .update(roleParams)
            .eq("id", id)
            .neq("id", session.user.id); // Prevent modifying self

        if (error) throw error;
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error("Modify User Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id)
            .neq("id", session.user.id); // Prevent deleting self

        if (error) throw error;
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error("Delete User Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
