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

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Random filename generation
        const ext = file.name.split('.').pop() || "jpg";
        const filename = `${Session_Id_Stamp()}-${Date.now()}.${ext}`;

        const { data, error } = await supabase.storage
            .from("animals")
            .upload(filename, buffer, {
                contentType: file.type || "image/jpeg",
                upsert: false
            });

        if (error) {
            console.error("Supabase Storage Error:", error);
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from("animals")
            .getPublicUrl(filename);

        return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: "Upload failed: " + e.message }, { status: 500 });
    }
}

function Session_Id_Stamp() {
    return Math.random().toString(36).substring(2, 9);
}
