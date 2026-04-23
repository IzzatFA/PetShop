import { createAnimalController } from "@/controllers/admin.controller";

export async function POST(req: Request) {
    return createAnimalController(req);
}
