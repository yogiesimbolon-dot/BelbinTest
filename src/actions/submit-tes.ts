"use server";

import { z } from "zod";
import { SECTIONS } from "@/lib/belbin/questions";
import { validateJawaban, type Jawaban } from "@/lib/belbin/validate";
import { hitungSkor, tentukanPeran } from "@/lib/belbin/score";
import { Role, VERSI_KUNCI } from "@/lib/belbin/scoring-key";
import { createAdminClient } from "@/lib/supabase/server-admin";

const IdentitasSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi"),
  departemen: z.string().trim().min(1, "Departemen wajib diisi"),
  jabatan: z.string().trim().min(1, "Jabatan wajib diisi"),
});

export type HasilPeserta = {
  nama: string;
  departemen: string;
  jabatan: string;
  peranUtama: Role;
  peranSekunder: Role;
  skorUtama: number;
  skorSekunder: number;
  skorSemua: Record<Role, number>;
};

export type SubmitResult =
  | { success: true; hasil: HasilPeserta }
  | { success: false; error: string };

/**
 * Server action untuk validasi dan penyimpanan tes Belbin.
 * Semua validasi diulang di server. Data peserta tidak dicatat ke log.
 */
export async function submitTes(
  identitasRaw: unknown,
  jawabanRaw: unknown
): Promise<SubmitResult> {
  try {
    // 1. Cek apakah ada pernyataan berstatus TODO di questions.ts
    const hasTodo = SECTIONS.some((s) => s.pernyataan.some((p) => p.todo));
    if (hasTodo) {
      return {
        success: false,
        error:
          "Kuesioner belum lengkap: terdapat pernyataan yang berstatus TODO (Section E nomor 6). Pengiriman ditolak.",
      };
    }

    // 2. Validasi identitas dengan Zod
    const identitasParse = IdentitasSchema.safeParse(identitasRaw);
    if (!identitasParse.success) {
      const errorMsg = identitasParse.error.issues.map((i) => i.message).join(", ");
      return {
        success: false,
        error: errorMsg || "Identitas peserta tidak valid.",
      };
    }
    const identitas = identitasParse.data;

    // 3. Validasi seluruh jawaban dengan validateJawaban
    const jawaban = (jawabanRaw ?? {}) as Partial<Jawaban>;
    const hasilValidasi = validateJawaban(jawaban);
    if (!hasilValidasi.valid) {
      return {
        success: false,
        error:
          "Validasi jawaban gagal. Pastikan seluruh 7 section telah diisi tepat 10 poin dengan maksimal 3 pernyataan berpoin.",
      };
    }

    // 4. Hitung skor dan tentukan peran
    const skor = hitungSkor(jawaban);
    const peran = tentukanPeran(skor);

    // 5. Simpan ke database menggunakan service role client (server-side only)
    const supabase = createAdminClient();

    // Pencegahan kirim ganda: cek apakah sudah ada submission identik dalam 60 detik terakhir
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("hasil_belbin")
      .select("id")
      .eq("nama", identitas.nama)
      .eq("departemen", identitas.departemen)
      .eq("jabatan", identitas.jabatan)
      .gte("created_at", sixtySecondsAgo)
      .limit(1);

    const hasilPayload: HasilPeserta = {
      nama: identitas.nama,
      departemen: identitas.departemen,
      jabatan: identitas.jabatan,
      peranUtama: peran.utama,
      peranSekunder: peran.sekunder,
      skorUtama: skor[peran.utama],
      skorSekunder: skor[peran.sekunder],
      skorSemua: skor,
    };

    if (existing && existing.length > 0) {
      // Submission ganda terdeteksi, anggap berhasil tanpa menduplikasi data
      return { success: true, hasil: hasilPayload };
    }

    const { error: insertError } = await supabase.from("hasil_belbin").insert({
      nama: identitas.nama,
      departemen: identitas.departemen,
      jabatan: identitas.jabatan,
      jawaban: jawaban,
      skor_sh: skor.SH,
      skor_co: skor.CO,
      skor_pl: skor.PL,
      skor_ri: skor.RI,
      skor_me: skor.ME,
      skor_imp: skor.IMP,
      skor_tw: skor.TW,
      skor_cf: skor.CF,
      peran_utama: peran.utama,
      peran_sekunder: peran.sekunder,
      versi_kunci: VERSI_KUNCI,
    });

    if (insertError) {
      console.error("submitTes insert error:", insertError);
      return {
        success: false,
        error: `Gagal menyimpan jawaban ke database: ${insertError.message || "Izin ditolak atau masalah koneksi"}`,
      };
    }

    return { success: true, hasil: hasilPayload };
  } catch (err: unknown) {
    console.error("submitTes exception:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Terjadi kesalahan saat memproses jawaban: ${msg}`,
    };
  }
}

/**
 * Mengambil rekap skor 8 peran untuk peserta tertentu (digunakan oleh halaman /selesai jika local cache belum lengkap)
 */
export async function getHasilPesertaTerakhir(nama: string): Promise<HasilPeserta | null> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("hasil_belbin")
      .select("*")
      .eq("nama", nama)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!data) return null;

    const skorSemua: Record<Role, number> = {
      SH: data.skor_sh,
      CO: data.skor_co,
      PL: data.skor_pl,
      RI: data.skor_ri,
      ME: data.skor_me,
      IMP: data.skor_imp,
      TW: data.skor_tw,
      CF: data.skor_cf,
    };

    return {
      nama: data.nama,
      departemen: data.departemen,
      jabatan: data.jabatan,
      peranUtama: data.peran_utama as Role,
      peranSekunder: data.peran_sekunder as Role,
      skorUtama: skorSemua[data.peran_utama as Role] ?? 0,
      skorSekunder: skorSemua[data.peran_sekunder as Role] ?? 0,
      skorSemua,
    };
  } catch {
    return null;
  }
}
