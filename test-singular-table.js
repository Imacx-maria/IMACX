require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testSingularTable() {
  console.log('🚀 Testing access to folhas_obra (singular) table...');

  try {
    // Try to fetch data from folhas_obra
    const { data: folhasData, error: folhasError } = await supabase
      .from('folhas_obra')
      .select('*')
      .limit(5);

    if (folhasError) {
      console.error('❌ Error accessing folhas_obra:', folhasError.message);
    } else {
      console.log('✅ Successfully accessed folhas_obra!');
      console.log(`Found ${folhasData.length} records`);
      
      if (folhasData.length > 0) {
        // Log first record structure
        console.log('\nFirst record schema:');
        Object.keys(folhasData[0]).forEach(key => {
          console.log(`- ${key}: ${typeof folhasData[0][key]}`);
        });
      }
    }

    // Check columns to see if this is indeed the target table
    const { data: columnsData, error: columnsError } = await supabase
      .from('folhas_obra')
      .select('numero_fo, nome_campanha')
      .limit(1);

    if (columnsError) {
      console.error('❌ Error checking columns:', columnsError.message);
    } else {
      console.log('\n✅ Table has the expected columns!');
    }

    // Try accessing items table
    console.log('\n🔍 Testing if "item" (singular) table exists...');
    const { data: itemData, error: itemError } = await supabase
      .from('item')
      .select('*')
      .limit(1);

    if (itemError) {
      console.log('❌ Item table error:', itemError.message);
      
      // Try the items table (plural)
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .limit(1);
        
      if (itemsError) {
        console.log('❌ Items table error:', itemsError.message);
      } else {
        console.log('✅ Successfully accessed items (plural) table!');
      }
    } else {
      console.log('✅ Successfully accessed item (singular) table!');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testSingularTable(); 