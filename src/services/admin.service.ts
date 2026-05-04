import { adminRepository } from "@/repositories/admin.repository";

export const adminService = {
    createAnimal: async (body: any) => {
        const data = {
            name: body.name,
            species: body.species,
            price: parseFloat(body.price),
            categoryId: parseInt(body.categoryId),
            description: body.description ?? null,
            imageUrl: body.imageUrl ?? null,
            stock: body.stock !== undefined ? Number(body.stock) : 1,
        };
        return await adminRepository.createAnimal(data);
    },
    updateAnimalStatus: async (id: number, isDeleted: boolean) => {
        return await adminRepository.updateAnimalStatus(id, isDeleted);
    },
    deleteAnimal: async (id: number) => {
        return await adminRepository.deleteAnimal(id);
    },
    updateAnimal: async (id: number, body: any) => {
        const data = {
            name: body.name,
            species: body.species,
            price: parseFloat(body.price),
            categoryId: parseInt(body.categoryId),
            description: body.description ?? null,
            imageUrl: body.imageUrl ?? null,
            stock: body.stock !== undefined ? Number(body.stock) : 1,
        };
        return await adminRepository.updateAnimal(id, data);
    },
    getUsers: async () => {
        return await adminRepository.getUsers();
    },
    updateUserRole: async (id: string, action: string, currentUserId: string) => {
        let roleParams = {};
        if (action === "SUSPEND") roleParams = { role: "SUSPENDED" };
        else if (action === "RESTORE") roleParams = { role: "BUYER" };
        else if (action === "PROMOTE_ADMIN") roleParams = { role: "ADMIN" };
        else throw new Error("Invalid action");

        return await adminRepository.updateUserRole(id, roleParams, currentUserId);
    },
    deleteUser: async (id: string, currentUserId: string) => {
        return await adminRepository.deleteUser(id, currentUserId);
    },
    getDashboardStats: async () => {
        const { usersCount, animalsCount, ordersCount, recentUsers } = await adminRepository.getDashboardStats();
        return {
            stats: {
                users: usersCount || 0,
                animals: animalsCount || 0,
                orders: ordersCount || 0,
            },
            recentUsers: recentUsers || [],
        };
    }
};
