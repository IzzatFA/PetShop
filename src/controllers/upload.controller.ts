import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadService } from "@/services/upload.service";

export const uploadController = async (req: Request) => {
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

        const url = await uploadService.uploadAnimalImage(file);

        return NextResponse.json({ url }, { status: 201 });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: "Upload failed: " + e.message }, { status: 500 });
    }
};
