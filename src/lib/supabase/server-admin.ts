import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://vhtdewkxwhysvjlopevi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_yDL2KF3NTRP93OJNZnPIJw_mPOKBmq3";

/**
 * Supabase client dengan service role / secret key.
 * HANYA boleh dipakai di server (Server Actions / Route Handlers).
 * Jika service role key belum disetel di Vercel, otomatis fallback ke anon key agar tidak melempar uncaught exception.
 */
export function createAdminClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    supabaseUrl = DEFAULT_SUPABASE_URL;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
