// Manual setup script for Supabase
// Run this in browser console on Supabase SQL Editor

// 1. Create educational_content table
const createEducationalTable = `
CREATE TABLE IF NOT EXISTS educational_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  age_range JSONB NOT NULL DEFAULT '{"min": 0, "max": 144}',
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER DEFAULT 5,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

// 2. Create expenses table
const createExpensesTable = `
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
`;

// 3. Create tasks table
const createTasksTable = `
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
`;

// 4. Enable Row Level Security
const enableRLS = `
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
`;

// 5. Create policies
const createPolicies = `
CREATE POLICY "Public can read educational content" ON educational_content FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Public can read tasks" ON tasks FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage educational content" ON educational_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage expenses" ON expenses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage tasks" ON tasks FOR ALL USING (auth.role() = 'authenticated');
`;

// 6. Create indexes
const createIndexes = `
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_status ON educational_content(status);
CREATE INDEX IF NOT EXISTS idx_educational_content_created_at ON educational_content(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
`;

// 7. Insert sample data
const insertSampleData = `
INSERT INTO educational_content (title, content, category, age_range, tags, read_time, status) VALUES
('Panduan MPASI 6 Bulan', 'Panduan lengkap untuk memperkenalkan makanan padat pertama kali pada bayi 6 bulan...', 'mpasi', '{"min": 6, "max": 8}', ARRAY['mpasi', 'nutrisi', 'bayi'], 8, 'published'),
('Tips Mengatasi Picky Eater', 'Strategi praktis mengatasi anak yang susah makan...', 'picky-eater', '{"min": 12, "max": 60}', ARRAY['makan', 'picky-eater', 'tips'], 6, 'published'),
('Perkembangan Motorik Anak', 'Panduan perkembangan motorik anak dari 0-5 tahun...', 'development', '{"min": 0, "max": 60}', ARRAY['motorik', 'perkembangan', 'anak'], 10, 'published'),
('Nutrisi untuk Ibu Menyusui', 'Kebutuhan nutrisi penting selama masa menyusui...', 'nutrition', '{"min": 18, "max": 144}', ARRAY['menyusui', 'nutrisi', 'ibu'], 7, 'published'),
('Mengatasi Tantrum Anak', 'Cara efektif mengelola emosi dan tantrum anak...', 'behavior', '{"min": 12, "max": 48}', ARRAY['tantrum', 'emosi', 'pengasuhan'], 9, 'published');

INSERT INTO expenses (category, amount, description, date, payment_method, tags) VALUES
('food', 150000, 'Belanja sayur dan buah mingguan', '2025-10-01', 'cash', ARRAY['groceries', 'healthy']),
('health', 500000, 'Vaksin anak', '2025-10-02', 'debit', ARRAY['medical', 'vaccination']),
('education', 300000, 'Buku cerita anak', '2025-10-03', 'e-wallet', ARRAY['books', 'learning']),
('clothing', 250000, 'Baju anak musim hujan', '2025-10-04', 'credit', ARRAY['clothing', 'seasonal']);

INSERT INTO tasks (title, description, priority, status, due_date) VALUES
('Beli bahan MPASI', 'Beli wortel, kentang, dan ayam untuk MPASI', 'high', 'pending', '2025-10-06'),
('Jadwalkan vaksin', 'Hubungi dokter untuk jadwal vaksin berikutnya', 'medium', 'in_progress', '2025-10-08'),
('Baca artikel parenting', 'Baca artikel tentang perkembangan anak', 'low', 'completed', '2025-10-05');
`;

console.log('Copy and paste these SQL commands to Supabase SQL Editor:');
console.log('='.repeat(50));
console.log(createEducationalTable);
console.log(createExpensesTable);
console.log(createTasksTable);
console.log(enableRLS);
console.log(createPolicies);
console.log(createIndexes);
console.log(insertSampleData);
console.log('='.repeat(50));
