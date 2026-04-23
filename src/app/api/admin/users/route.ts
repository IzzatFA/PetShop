import { getUsersController } from "@/controllers/admin.controller";

export async function GET(req: Request) {
    return getUsersController(req);
}
