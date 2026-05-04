import { updateAnimalStatusController, deleteAnimalController, updateAnimalController } from "@/controllers/seller.controller";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return updateAnimalStatusController(req, resolvedParams);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return deleteAnimalController(req, resolvedParams);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return updateAnimalController(req, resolvedParams);
}
