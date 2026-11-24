import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = cookies();
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  let supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).trim();

  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    supabaseUrl = "https://vhtdewkxwhysvjlopevi.supabase.co";
  }

  const isValidAnonKey =
    supabaseAnonKey &&
    !supabaseAnonKey.startsWith("http") &&
    !supabaseAnonKey.startsWith("sb_secret_") &&
    (supabaseAnonKey.startsWith("sb_") || supabaseAnonKey.startsWith("eyJ"));

  if (!isValidAnonKey) {
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
