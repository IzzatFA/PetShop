import { updateProfileController } from "@/controllers/user.controller";

export async function PUT(req: Request) {
    return updateProfileController(req);
}
