import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { targetRole, ktpUrl } = await req.json();

        if (targetRole !== "SELLER" && targetRole !== "ADMIN") {
            return NextResponse.json({ error: "Invalid Role" }, { status: 400 });
        }

        let updateData: any = { role: targetRole };
        if (ktpUrl) {
            updateData.ktpUrl = ktpUrl;
        }

        const { error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", session.user.id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Upgrade Role Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
