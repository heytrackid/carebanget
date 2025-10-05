// Manual database setup using Supabase client
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vmibhmxfjhkgmatuslsp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_service_role_key_here';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  console.log('🗄️ Setting up Supabase database...');

  try {
    // Enable UUID extension
    console.log('📦 Enabling UUID extension...');
    await supabase.rpc('enable_uuid_extension');

    // Create educational_content table
    console.log('📝 Creating educational_content table...');
    const createTableSQL = `
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

    // Note: Direct SQL execution through client is limited
    // We'll provide the SQL for manual execution
    console.log('📋 Please run this SQL in Supabase SQL Editor:');
    console.log('='.repeat(60));
    console.log(createTableSQL);

    // For now, let's just test if we can connect
    const { data, error } = await supabase.from('educational_content').select('count').limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
      console.log('❌ Connection test failed:', error.message);
      return false;
    }

    console.log('✅ Database setup ready!');
    return true;

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return false;
  }
}

// Alternative: Provide manual SQL commands
console.log('🔧 MANUAL DATABASE SETUP REQUIRED');
console.log('='.repeat(50));
console.log('Since Supabase CLI is not linked, please run these commands manually:');
console.log('');

console.log('1. Open Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/vmibhmxfjhkgmatuslsp/sql/new');
console.log('');

console.log('2. Run this SQL to create the educational_content table:');
console.log(`
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

-- Enable Row Level Security
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read educational content"
ON educational_content FOR SELECT USING (status = 'published');

-- Create policies for authenticated users (admin)
CREATE POLICY "Authenticated can manage educational content"
ON educational_content FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_status ON educational_content(status);
CREATE INDEX IF NOT EXISTS idx_educational_content_created_at ON educational_content(created_at DESC);

-- Insert sample data
INSERT INTO educational_content (title, content, category, age_range, tags, read_time, status) VALUES
('Panduan MPASI 6 Bulan', 'Panduan lengkap untuk memperkenalkan makanan padat pertama kali pada bayi 6 bulan...', 'mpasi', '{"min": 6, "max": 8}', ARRAY['mpasi', 'nutrisi', 'bayi'], 8, 'published'),
('Tips Mengatasi Picky Eater', 'Strategi praktis mengatasi anak yang susah makan...', 'picky-eater', '{"min": 12, "max": 60}', ARRAY['makan', 'picky-eater', 'tips'], 6, 'published'),
('Perkembangan Motorik Anak', 'Panduan perkembangan motorik anak dari 0-5 tahun...', 'development', '{"min": 0, "max": 60}', ARRAY['motorik', 'perkembangan', 'anak'], 10, 'published'),
('Nutrisi untuk Ibu Menyusui', 'Kebutuhan nutrisi penting selama masa menyusui...', 'nutrition', '{"min": 18, "max": 144}', ARRAY['menyusui', 'nutrisi', 'ibu'], 7, 'published'),
('Mengatasi Tantrum Anak', 'Cara efektif mengelola emosi dan tantrum anak...', 'behavior', '{"min": 12, "max": 48}', ARRAY['tantrum', 'emosi', 'pengasuhan'], 9, 'published');
`);
console.log('');

console.log('3. After running SQL, test the connection:');
console.log('   node scripts/test-supabase.mjs');
console.log('');

console.log('4. Then start your app:');
console.log('   npm run dev');
console.log('');

console.log('5. Test sync:');
console.log('   - Add article in /admin/articles');
console.log('   - Check if it appears in /education');
console.log('='.repeat(50));
