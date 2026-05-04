import { supabase } from "@/lib/supabase";

export const userRepository = {
    updateUser: async (id: string, updateData: any) => {
        const { error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", id);

        if (error) throw error;
        return true;
    }
};
