import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

async function checkDatabaseStatus() {
  console.log('🔍 Checking Supabase database status...\n');
  
  const expectedTables = [
    'user_profiles', 'user_preferences', 'children', 'educational_content',
    'content_interactions', 'recipes', 'ingredients', 'recipe_ingredients',
    'meal_plans', 'daily_meals', 'shopping_lists', 'shopping_list_items',
    'expenses', 'tasks', 'budgets', 'ai_chat_history', 'user_analytics'
  ];
  
  console.log('📋 Table Status:');
  console.log('='.repeat(50));
  
  let existing = 0;
  let missing = 0;
  
  for (const table of expectedTables) {
    try {
      const { error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (!error) {
        console.log(`✅ ${table.padEnd(20)} | ${count || 0} records`);
        existing++;
      } else {
        console.log(`❌ ${table.padEnd(20)} | ${error.message}`);
        missing++;
      }
    } catch (err) {
      console.log(`❌ ${table.padEnd(20)} | Error`);
      missing++;
    }
  }
  
  console.log('='.repeat(50));
  console.log(`📊 Summary: ${existing} tables exist, ${missing} missing`);
  
  if (existing > 0) {
    console.log('\n🎯 Database is partially set up!');
  } else {
    console.log('\n⚠️  No tables found - need to run migration');
  }
}

checkDatabaseStatus().catch(err => console.log('❌ Check failed:', err.message));
