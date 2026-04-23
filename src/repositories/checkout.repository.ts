import { supabase } from "@/lib/supabase";

export const checkoutRepository = {
    getAnimalStock: async (animalId: number) => {
        const { data, error } = await supabase.from('animals').select('stock, name').eq('id', animalId).single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },
    createOrder: async (userId: string, totalPrice: number) => {
        const { data: order, error } = await supabase
            .from("orders")
            .insert({
                userId: userId,
                totalPrice: totalPrice,
                status: "COMPLETED"
            })
            .select()
            .single();

        if (error) throw error;
        return order;
    },
    createOrderItems: async (lineItems: any[]) => {
        const { error } = await supabase
            .from("order_items")
            .insert(lineItems);

        if (error) throw error;
        return true;
    },
    updateAnimalStock: async (animalId: number, newStock: number) => {
        const { error } = await supabase.from('animals').update({ stock: newStock }).eq('id', animalId);
        if (error) throw error;
        return true;
    }
};
