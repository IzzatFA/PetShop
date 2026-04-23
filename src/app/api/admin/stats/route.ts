import { getStatsController } from "@/controllers/admin.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    return getStatsController(req);
}
