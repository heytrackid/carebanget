// One-time migration script
import { migrateEducationalContent, testSupabaseConnection } from '@/lib/migration';

async function runMigration() {
  console.log('🗄️  Starting migration to Supabase...');

  // Test connection first
  const connected = await testSupabaseConnection();
  if (!connected) {
    console.error('❌ Cannot connect to Supabase. Please check your environment variables.');
    process.exit(1);
  }

  try {
    // Run migration
    await migrateEducationalContent();
    console.log('✅ Migration completed successfully!');
    console.log('🎉 Your app now uses Supabase for data persistence.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
