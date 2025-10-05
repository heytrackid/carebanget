// Migration script to move from mock data to Supabase
import { supabase } from '@/lib/supabase';
import { mockEducationalContent } from '@/data/mockData';

// Migrate educational content to Supabase
export async function migrateEducationalContent() {
  try {
    // Check if data already exists
    const { data: existing } = await supabase
      .from('educational_content')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('Data already exists, skipping migration');
      return;
    }

    // Insert mock data to Supabase
    const { data, error } = await supabase
      .from('educational_content')
      .insert(mockEducationalContent.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        age_range: item.ageRange,
        tags: item.tags,
        read_time: item.readTime,
        status: item.status || 'published'
      })));

    if (error) {
      console.error('Migration error:', error);
      throw error;
    }

    console.log('Successfully migrated educational content to Supabase');
    return data;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('educational_content')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }

    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}
