-- Migration 001: tabel hasil_belbin sesuai PRD bagian 8
CREATE TABLE IF NOT EXISTS hasil_belbin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    departemen TEXT NOT NULL,
    jabatan TEXT NOT NULL,
    jawaban JSONB NOT NULL,
    skor_sh INT NOT NULL,
    skor_co INT NOT NULL,
    skor_pl INT NOT NULL,
    skor_ri INT NOT NULL,
    skor_me INT NOT NULL,
    skor_imp INT NOT NULL,
    skor_tw INT NOT NULL,
    skor_cf INT NOT NULL,
    peran_utama TEXT NOT NULL,
    peran_sekunder TEXT NOT NULL,
    versi_kunci TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS) aktif
ALTER TABLE hasil_belbin ENABLE ROW LEVEL SECURITY;

-- Policy SELECT hanya untuk role authenticated
CREATE POLICY "Allow authenticated select on hasil_belbin"
    ON hasil_belbin
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy DELETE hanya untuk role authenticated
CREATE POLICY "Allow authenticated delete on hasil_belbin"
    ON hasil_belbin
    FOR DELETE
    TO authenticated
    USING (true);

-- Policy INSERT agar penulisan data tes peserta dapat berjalan
CREATE POLICY "Allow insert on hasil_belbin"
    ON hasil_belbin
    FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

-- Berikan izin akses tabel ke role postgres, anon, authenticated, dan service_role
GRANT ALL ON TABLE public.hasil_belbin TO postgres, anon, authenticated, service_role;

-- Tanpa policy INSERT untuk anon. Penulisan data peserta dilakukan oleh server action memakai service role key.
