import { createClient } from "@/lib/supabase/server";
import { AdminTable, type BelbinRecord } from "@/components/AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hasil_belbin")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    const isPermissionError =
      error.message?.toLowerCase().includes("permission denied") ||
      error.code === "42501";

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-sm space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 font-bold text-base text-amber-800">
            <svg className="w-5 h-5 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Login Berhasil — Perlu Izin Akses Tabel di Supabase</span>
          </div>
          <p className="text-zinc-700 leading-relaxed">
            Anda telah berhasil terotentikasi sebagai administrator. Namun query database Supabase mengembalikan pesan:{" "}
            <span className="font-semibold text-rose-700">{error.message}</span>.
          </p>
          {isPermissionError && (
            <div className="space-y-3 pt-1">
              <p className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                Langkah Mengaktifkan Hak Akses Tabel:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://supabase.com/dashboard/project/vhtdewkxwhysvjlopevi/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#13583B] hover:bg-[#0f442e] text-white font-semibold text-xs shadow-xs transition"
                >
                  <span>1. Buka SQL Editor Supabase</span>
                  <span>↗</span>
                </a>
                <span className="text-xs text-zinc-500">2. Salin dan jalankan perintah di bawah ini, lalu refresh halaman ini:</span>
              </div>
              <pre className="p-3.5 bg-zinc-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto select-all">
                GRANT ALL ON TABLE public.hasil_belbin TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
              </pre>
              <p className="text-xs text-zinc-500">
                Setelah perintah SQL di atas dijalankan di Supabase SQL Editor (klik tombol <strong>Run</strong>), segarkan (refresh) halaman ini untuk melihat tabel data peserta.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <AdminTable initialData={(data ?? []) as BelbinRecord[]} />;
}
