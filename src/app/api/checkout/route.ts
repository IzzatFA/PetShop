import { checkoutController } from "@/controllers/checkout.controller";

export async function POST(req: Request) {
    return checkoutController(req);
}
