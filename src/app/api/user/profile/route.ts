import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, password } = await req.json();

        let updateData: any = {};

        if (name && name.trim().length > 0) {
            updateData.name = name;
        }

        if (password && password.trim().length > 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // If nothing to update, return success early
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: true, message: "No changes requested" });
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
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
