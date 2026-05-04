import { supabase } from "@/lib/supabase";

export const authRepository = {
    findUserByEmail: async (email: string) => {
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        return existingUser;
    },

    createUser: async (name: string, email: string, passwordHash: string, role: string) => {
        const { data: user, error } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password: passwordHash,
                role,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return user;
    }
};
