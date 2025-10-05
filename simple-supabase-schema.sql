-- ===========================================
-- SUPABASE SCHEMA - SIMPLE & RELIABLE VERSION
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- CORE TABLES (Minimal & Working)
-- ===========================================

-- Educational content (most important for sync demo)
CREATE TABLE IF NOT EXISTS educational_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  age_range JSONB DEFAULT '{"min": 0, "max": 144}',
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER DEFAULT 5,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  description TEXT NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- SECURITY POLICIES
-- ===========================================

-- Enable Row Level Security
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Public read policies (simplified)
CREATE POLICY "Allow public read educational content" ON educational_content FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow public read tasks" ON tasks FOR SELECT USING (true);

-- Authenticated users can manage all (simplified)
CREATE POLICY "Allow authenticated manage educational content" ON educational_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated manage expenses" ON expenses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated manage tasks" ON tasks FOR ALL USING (auth.role() = 'authenticated');

-- ===========================================
-- INDEXES (Essential only)
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_educational_content_status ON educational_content(status);
CREATE INDEX IF NOT EXISTS idx_educational_content_created_at ON educational_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- ===========================================
-- SAMPLE DATA (Essential for testing)
-- ===========================================

-- Educational content samples
INSERT INTO educational_content (title, content, category, age_range, tags, read_time, status) VALUES
('Panduan MPASI 6 Bulan', 'Panduan lengkap untuk memperkenalkan makanan padat pertama kali pada bayi 6 bulan. Mulai dengan bubur nasi yang halus, tambahkan sayuran hijau, dan pastikan nutrisi seimbang...', 'mpasi', '{"min": 6, "max": 8}', ARRAY['mpasi', 'nutrisi', 'bayi'], 8, 'published'),
('Tips Mengatasi Picky Eater', 'Strategi praktis mengatasi anak yang susah makan: buat waktu makan menyenangkan, jangan paksa, tawarkan berbagai warna dan tekstur makanan...', 'picky-eater', '{"min": 12, "max": 60}', ARRAY['makan', 'picky-eater', 'tips'], 6, 'published'),
('Perkembangan Motorik Anak', 'Panduan perkembangan motorik anak dari 0-5 tahun. Pada usia 3-6 bulan biasanya mulai bisa berguling, 6-9 bulan mulai merangkak...', 'development', '{"min": 0, "max": 60}', ARRAY['motorik', 'perkembangan', 'anak'], 10, 'published'),
('Nutrisi untuk Ibu Menyusui', 'Kebutuhan nutrisi penting selama masa menyusui: protein tinggi, kalsium, zat besi, omega-3, dan vitamin D. Minum air putih minimal 2 liter per hari...', 'nutrition', '{"min": 18, "max": 144}', ARRAY['menyusui', 'nutrisi', 'ibu'], 7, 'published'),
('Mengatasi Tantrum Anak', 'Cara efektif mengelola emosi dan tantrum anak: tetap tenang, validasi perasaan anak, tawarkan pilihan, gunakan time-out jika perlu...', 'behavior', '{"min": 12, "max": 48}', ARRAY['tantrum', 'emosi', 'pengasuhan'], 9, 'published');

-- Expense samples
INSERT INTO expenses (category, amount, description, date, payment_method, tags) VALUES
('food', 150000.00, 'Belanja sayur dan buah mingguan', '2025-10-01', 'cash', ARRAY['groceries', 'healthy']),
('health', 500000.00, 'Vaksin anak', '2025-10-02', 'debit', ARRAY['medical', 'vaccination']),
('education', 300000.00, 'Buku cerita anak', '2025-10-03', 'e-wallet', ARRAY['books', 'learning']),
('clothing', 250000.00, 'Baju anak musim hujan', '2025-10-04', 'credit', ARRAY['clothing', 'seasonal']);

-- Task samples
INSERT INTO tasks (title, description, priority, status, due_date) VALUES
('Beli bahan MPASI', 'Beli wortel, kentang, dan ayam untuk MPASI', 'high', 'pending', '2025-10-06'),
('Jadwalkan vaksin', 'Hubungi dokter untuk jadwal vaksin berikutnya', 'medium', 'in_progress', '2025-10-08'),
('Baca artikel parenting', 'Baca artikel tentang perkembangan anak', 'low', 'completed', '2025-10-05');

-- ===========================================
-- SUCCESS MESSAGE
-- ===========================================

-- Schema berhasil dibuat! 🎉
-- Sekarang test dengan:
-- 1. node scripts/test-supabase.mjs
-- 2. npm run dev
-- 3. Test sync admin ↔ education pages
