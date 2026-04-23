import { checkoutRepository } from "@/repositories/checkout.repository";

export const checkoutService = {
    processCheckout: async (userId: string, cartItems: any[]) => {
        // Verify Inventory
        for (const item of cartItems) {
            const animal = await checkoutRepository.getAnimalStock(item.animalId);
            if (!animal || animal.stock < item.quantity) {
                throw new Error(`Not enough stock for ${animal?.name || 'Item'}`);
            }
        }

        const totalPrice = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

        const order = await checkoutRepository.createOrder(userId, totalPrice);

        const lineItems = cartItems.map((item: any) => ({
            orderId: order.id,
            animalId: item.animalId,
            quantity: item.quantity,
            price: item.price
        }));

        await checkoutRepository.createOrderItems(lineItems);

        for (const item of cartItems) {
            const animal = await checkoutRepository.getAnimalStock(item.animalId);
            if (animal) {
                await checkoutRepository.updateAnimalStock(item.animalId, Math.max(0, animal.stock - item.quantity));
            }
        }

        return order.id;
    }
};
