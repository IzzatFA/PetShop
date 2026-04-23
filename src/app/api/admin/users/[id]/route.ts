import { updateUserController, deleteUserController } from "@/controllers/admin.controller";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return updateUserController(req, resolvedParams);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return deleteUserController(req, resolvedParams);
}
