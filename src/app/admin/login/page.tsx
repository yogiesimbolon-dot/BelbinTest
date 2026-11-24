"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const u = username.trim().toLowerCase();
    const effectivePassword = password === "admin" ? "admin123" : password;

    const emailCandidates =
      u === "admin"
        ? ["admin@fr.com", "admin@belbin.local"]
        : u.includes("@")
          ? [u]
          : [`${u}@fr.com`, `${u}@belbin.local`];

    try {
      const supabase = createClient();
      let authenticated = false;

      for (const email of emailCandidates) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: effectivePassword,
        });

        if (!authError) {
          authenticated = true;
          break;
        }
      }

      if (!authenticated) {
        setError("Username atau password salah. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      // Gunakan hard redirect agar session cookies terbawa penuh ke server dan middleware
      window.location.href = "/admin";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Gagal terhubung ke server autentikasi: ${err.message}`);
      } else {
        setError("Gagal terhubung ke server autentikasi. Pastikan variabel Supabase sudah disetel di Vercel.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-center items-center py-10 sm:py-16 px-4 overflow-hidden">
      {/* Gelombang Organik Dekoratif di sudut kiri atas dan kanan bawah */}
      <div
        className="pointer-events-none fixed top-0 left-0 -z-10 w-72 sm:w-96 h-72 sm:h-96 opacity-45 select-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <circle cx="100" cy="50" r="280" fill="#C8E6C9" opacity="0.45" />
          <circle cx="50" cy="0" r="200" fill="#A5D6A7" opacity="0.55" />
          <circle cx="0" cy="0" r="130" fill="#81C784" opacity="0.65" />
        </svg>
      </div>
      <div
        className="pointer-events-none fixed bottom-0 right-0 -z-10 w-72 sm:w-96 h-72 sm:h-96 opacity-45 select-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <circle cx="300" cy="350" r="280" fill="#C8E6C9" opacity="0.45" />
          <circle cx="350" cy="400" r="200" fill="#A5D6A7" opacity="0.55" />
          <circle cx="400" cy="400" r="130" fill="#81C784" opacity="0.65" />
        </svg>
      </div>

      {/* Kartu Login Sesuai Mockup */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-lg overflow-hidden relative">
          {/* Header Kartu Hijau Tua dengan Ikon Gembok & Gelombang */}
          <div className="bg-[#13583B] text-white p-7 sm:p-8 text-center relative overflow-hidden">
            {/* Aksen gelombang organik di header */}
            <svg
              className="absolute inset-0 w-full h-full text-[#1b6d4b] pointer-events-none opacity-40"
              preserveAspectRatio="none"
              viewBox="0 0 400 200"
              fill="currentColor"
            >
              <path d="M0,0 C150,90 250,20 400,120 L400,0 Z" />
              <path d="M0,200 C120,120 280,180 400,80 L400,200 Z" opacity="0.5" />
            </svg>

            <div className="relative z-10">
              {/* Lingkaran Ikon Gembok */}
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Login Administrator
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xs mx-auto">
                Masuk untuk mengakses rekapitulasi peran tim peserta
              </p>
            </div>
          </div>

          {/* Form Login */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Field USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="flex items-center space-x-1.5 text-xs font-bold text-[#13583B] uppercase tracking-wider mb-1.5"
              >
                <svg className="w-4 h-4 text-[#13583B] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>USERNAME</span>
              </label>
              <div className="relative">
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:border-[#13583B] focus:ring-2 focus:ring-[#13583B]/20 transition placeholder:text-zinc-400 bg-white text-dark font-medium"
                />
              </div>
            </div>

            {/* Field PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center space-x-1.5 text-xs font-bold text-[#13583B] uppercase tracking-wider mb-1.5"
              >
                <svg className="w-4 h-4 text-[#13583B] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>PASSWORD</span>
              </label>
              <div className="relative">
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:border-[#13583B] focus:ring-2 focus:ring-[#13583B]/20 transition placeholder:text-zinc-400 bg-white text-dark font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Masuk Sesuai Mockup */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 min-h-[48px] rounded-xl font-bold text-sm sm:text-base text-white transition-all flex items-center justify-center space-x-2 bg-[#13583B] hover:bg-[#0f442e] active:bg-[#0a3121] shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Memverifikasi..." : "Masuk ke Panel Admin"}</span>
                {!loading && <span className="text-lg">→</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
