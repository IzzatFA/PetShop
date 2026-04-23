import { upgradeRoleController } from "@/controllers/user.controller";

export async function POST(req: Request) {
    return upgradeRoleController(req);
}
