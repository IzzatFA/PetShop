import { supabase } from "@/lib/supabase";

export const adminRepository = {
    createAnimal: async (data: any) => {
        const { data: newAnimal, error } = await supabase
            .from('animals')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return newAnimal;
    },
    updateAnimalStatus: async (id: number, isDeleted: boolean) => {
        const { data: updated, error } = await supabase
            .from('animals')
            .update({ isDeleted })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updated;
    },
    deleteAnimal: async (id: number) => {
        const { error } = await supabase
            .from('animals')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },
    updateAnimal: async (id: number, data: any) => {
        const { data: updated, error } = await supabase
            .from('animals')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updated;
    },
    getUsers: async () => {
        const { data: users, error } = await supabase
            .from("users")
            .select("id, name, email, role, createdAt, ktpUrl")
            .order("createdAt", { ascending: false });

        if (error) throw error;
        return users;
    },
    updateUserRole: async (id: string, roleParams: any, currentUserId: string) => {
        const { error } = await supabase
            .from("users")
            .update(roleParams)
            .eq("id", id)
            .neq("id", currentUserId);

        if (error) throw error;
        return true;
    },
    deleteUser: async (id: string, currentUserId: string) => {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id)
            .neq("id", currentUserId);

        if (error) throw error;
        return true;
    },
    getDashboardStats: async () => {
        const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true });
        const { count: animalsCount } = await supabase.from("animals").select("*", { count: "exact", head: true });
        const { count: ordersCount } = await supabase.from("orders").select("*", { count: "exact", head: true });

        const { data: recentUsers } = await supabase
            .from("users")
            .select("id, name, email, role, createdAt")
            .order("createdAt", { ascending: false })
            .limit(5);

        return { usersCount, animalsCount, ordersCount, recentUsers };
    }
};
