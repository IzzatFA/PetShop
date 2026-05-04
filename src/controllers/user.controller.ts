import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { userService } from "@/services/user.service";

export const updateProfileController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, password } = await req.json();

        const updated = await userService.updateProfile(session.user.id, name, password);

        if (!updated) {
            return NextResponse.json({ success: true, message: "No changes requested" });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export const upgradeRoleController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { targetRole, ktpUrl } = await req.json();

        if (targetRole !== "SELLER" && targetRole !== "ADMIN") {
            return NextResponse.json({ error: "Invalid Role" }, { status: 400 });
        }

        await userService.upgradeRole(session.user.id, targetRole, ktpUrl);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Upgrade Role Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
