import { sellerRepository } from "@/repositories/seller.repository";

export const sellerService = {
    createAnimal: async (body: any, sellerId: string) => {
        const data = {
            name: body.name,
            species: body.species,
            price: parseFloat(body.price),
            categoryId: parseInt(body.categoryId),
            description: body.description ?? null,
            imageUrl: body.imageUrl ?? null,
            stock: body.stock !== undefined ? Number(body.stock) : 1,
            sellerId: sellerId
        };
        return await sellerRepository.createAnimal(data);
    },
    updateAnimalStatus: async (id: number, isDeleted: boolean, sellerId: string) => {
        return await sellerRepository.updateAnimalStatus(id, isDeleted, sellerId);
    },
    deleteAnimal: async (id: number, sellerId: string) => {
        return await sellerRepository.deleteAnimal(id, sellerId);
    },
    updateAnimal: async (id: number, body: any, sellerId: string) => {
        const data = {
            name: body.name,
            species: body.species,
            price: parseFloat(body.price),
            categoryId: parseInt(body.categoryId),
            description: body.description ?? null,
            imageUrl: body.imageUrl ?? null,
            stock: body.stock !== undefined ? Number(body.stock) : 1,
        };
        return await sellerRepository.updateAnimal(id, data, sellerId);
    }
};
