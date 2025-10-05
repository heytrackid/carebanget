// Simple test script for Supabase connection
const SUPABASE_URL = 'https://vmibhmxfjhkgmatuslsp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rquQJO-cXFYvpOfp1PuEDg_v3kNCE-i';

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/educational_content?select=count&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('✅ Supabase connection successful!');
    console.log('📊 Response:', data);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function testInsert() {
  console.log('📤 Testing insert operation...');

  try {
    const testData = {
      title: 'Test Article - Please Delete',
      content: 'This is a test article to verify Supabase connection.',
      category: 'nutrition',
      age_range: { min: 0, max: 144 },
      tags: ['test'],
      read_time: 1,
      status: 'draft'
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/educational_content`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      console.error('❌ Insert failed:', response.status, response.statusText);
      return false;
    }

    console.log('✅ Insert test successful!');
    return true;
  } catch (error) {
    console.error('❌ Insert test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Supabase connection tests...\n');

  const connectionOk = await testConnection();

  if (!connectionOk) {
    console.log('\n❌ Connection test failed. Please check:');
    console.log('1. Supabase project is active');
    console.log('2. Database tables are created');
    console.log('3. RLS policies are set up');
    console.log('4. Environment variables are correct');
    return;
  }

  console.log('\n📝 Testing insert operation...');
  const insertOk = await testInsert();

  if (insertOk) {
    console.log('\n🎉 All tests passed! Supabase is ready for your app!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your Next.js app: npm run dev');
    console.log('2. Visit /admin/articles to add articles');
    console.log('3. Visit /education to see articles');
    console.log('4. Articles will sync automatically!');
  } else {
    console.log('\n⚠️  Connection works but insert failed. Check RLS policies.');
  }
}

runTests();
