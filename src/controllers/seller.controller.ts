import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sellerService } from "@/services/seller.service";

export const createAnimalController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SELLER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.name || !body.species || !body.price || !body.categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newAnimal = await sellerService.createAnimal(body, session.user.id);
        return NextResponse.json(newAnimal, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create animal" }, { status: 500 });
    }
};

export const updateAnimalStatusController = async (req: Request, params: { id: string }) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SELLER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = parseInt(params.id);
        const body = await req.json();

        const updated = await sellerService.updateAnimalStatus(id, body.isDeleted, session.user.id);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
};

export const deleteAnimalController = async (req: Request, params: { id: string }) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SELLER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = parseInt(params.id);

        await sellerService.deleteAnimal(id, session.user.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
};

export const updateAnimalController = async (req: Request, params: { id: string }) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SELLER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = parseInt(params.id);
        const body = await req.json();

        if (!body.name || !body.species || !body.price || !body.categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updated = await sellerService.updateAnimal(id, body, session.user.id);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update animal" }, { status: 500 });
    }
};
