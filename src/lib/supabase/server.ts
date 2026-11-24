import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = cookies();
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    supabaseUrl = "https://vhtdewkxwhysvjlopevi.supabase.co";
  }

  if (!supabaseAnonKey || supabaseAnonKey.startsWith("sb_secret_")) {
    supabaseAnonKey = "sb_publishable_yDL2KF3NTRP93OJNZnPIJw_mPOKBmq3";
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Dipanggil dari Server Component; cookie refresh ditangani oleh middleware
        }
      },
    },
  });
}
