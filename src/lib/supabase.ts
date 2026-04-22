import { createClient } from "@supabase/supabase-js";

// We use the anon key for public actions if needed, but since we are handling DB safely through API routes & Server components,
// we'll default to the service_role key to bypass RLS locally (matching the Prisma equivalent of unrestricted backend access).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️  Supabase URL or Key is missing from the Environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
