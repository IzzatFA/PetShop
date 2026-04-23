import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export const registerController = async (req: Request) => {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        try {
            const user = await authService.registerUser(name, email, password);
            return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
        } catch (error: any) {
            if (error.message === "Email already in use") {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }
            throw error;
        }

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
