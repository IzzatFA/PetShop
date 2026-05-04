import { supabase } from "@/lib/supabase";

export const uploadRepository = {
    uploadFile: async (filename: string, buffer: Buffer, contentType: string) => {
        const { error } = await supabase.storage
            .from("animals")
            .upload(filename, buffer, {
                contentType,
                upsert: false
            });

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from("animals")
            .getPublicUrl(filename);

        return publicUrlData.publicUrl;
    }
};
