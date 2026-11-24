import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://vhtdewkxwhysvjlopevi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_yDL2KF3NTRP93OJNZnPIJw_mPOKBmq3";

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  let supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).trim();

  // Fallback jika env di Vercel belum disetel atau salah paste
  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    supabaseUrl = DEFAULT_SUPABASE_URL;
  }

  const isValidAnonKey =
    supabaseAnonKey &&
    !supabaseAnonKey.startsWith("http") &&
    !supabaseAnonKey.startsWith("sb_secret_") &&
    (supabaseAnonKey.startsWith("sb_") || supabaseAnonKey.startsWith("eyJ"));

  if (!isValidAnonKey) {
    supabaseAnonKey = DEFAULT_SUPABASE_ANON_KEY;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
