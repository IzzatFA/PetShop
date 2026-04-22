import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: users, error } = await supabase
            .from("users")
            .select("id, name, email, role, createdAt, ktpUrl")
            .order("createdAt", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ users }, { status: 200 });
    } catch (error: any) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
