import { supabase } from "@/lib/supabase";

export const sellerRepository = {
    createAnimal: async (data: any) => {
        const { data: newAnimal, error } = await supabase
            .from('animals')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return newAnimal;
    },
    updateAnimalStatus: async (id: number, isDeleted: boolean, sellerId: string) => {
        const { data: updated, error } = await supabase
            .from('animals')
            .update({ isDeleted })
            .eq('id', id)
            .eq('sellerId', sellerId)
            .select()
            .single();

        if (error) throw error;
        return updated;
    },
    deleteAnimal: async (id: number, sellerId: string) => {
        const { error } = await supabase
            .from('animals')
            .delete()
            .eq('id', id)
            .eq('sellerId', sellerId);

        if (error) throw error;
        return true;
    },
    updateAnimal: async (id: number, data: any, sellerId: string) => {
        const { data: updated, error } = await supabase
            .from('animals')
            .update(data)
            .eq('id', id)
            .eq('sellerId', sellerId)
            .select()
            .single();

        if (error) throw error;
        return updated;
    }
};
