import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminService } from "@/services/admin.service";

export const createAnimalController = async (req: Request) => {
    try {
        const body = await req.json();

        if (!body.name || !body.species || !body.price || !body.categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newAnimal = await adminService.createAnimal(body);
        return NextResponse.json(newAnimal, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create animal" }, { status: 500 });
    }
};

export const updateAnimalStatusController = async (req: Request, params: { id: string }) => {
    try {
        const id = parseInt(params.id);
        const body = await req.json();

        const updated = await adminService.updateAnimalStatus(id, body.isDeleted);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
};

export const deleteAnimalController = async (req: Request, params: { id: string }) => {
    try {
        const id = parseInt(params.id);

        await adminService.deleteAnimal(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
};

export const updateAnimalController = async (req: Request, params: { id: string }) => {
    try {
        const id = parseInt(params.id);
        const body = await req.json();

        if (!body.name || !body.species || !body.price || !body.categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updated = await adminService.updateAnimal(id, body);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update animal" }, { status: 500 });
    }
};

export const getUsersController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await adminService.getUsers();
        return NextResponse.json({ users }, { status: 200 });
    } catch (error: any) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export const updateUserController = async (req: Request, params: { id: string }) => {
    try {
        const { id } = params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { action } = await req.json();

        try {
            await adminService.updateUserRole(id, action, session.user.id);
            return NextResponse.json({ success: true }, { status: 200 });
        } catch (err: any) {
            if (err.message === "Invalid action") {
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
            }
            throw err;
        }
    } catch (error: any) {
        console.error("Modify User Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export const deleteUserController = async (req: Request, params: { id: string }) => {
    try {
        const { id } = params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await adminService.deleteUser(id, session.user.id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Delete User Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export const getStatsController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await adminService.getDashboardStats();
        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error("Fetch Admin Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
