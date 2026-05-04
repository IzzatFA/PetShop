import { createAnimalController } from "@/controllers/seller.controller";

export async function POST(req: Request) {
    return createAnimalController(req);
}
