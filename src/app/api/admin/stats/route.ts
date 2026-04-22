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

        // Fetch counts from Supabase
        const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true });
        const { count: animalsCount } = await supabase.from("animals").select("*", { count: "exact", head: true });
        const { count: ordersCount } = await supabase.from("orders").select("*", { count: "exact", head: true });

        // Fetch recent users
        const { data: recentUsers } = await supabase
            .from("users")
            .select("id, name, email, role, createdAt")
            .order("createdAt", { ascending: false })
            .limit(5);

        return NextResponse.json({
            stats: {
                users: usersCount || 0,
                animals: animalsCount || 0,
                orders: ordersCount || 0,
            },
            recentUsers: recentUsers || [],
        }, { status: 200 });

    } catch (error: any) {
        console.error("Fetch Admin Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
