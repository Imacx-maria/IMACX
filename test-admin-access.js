require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testTablesAccess() {
  console.log('🔍 Testing tables access with service role key...');
  
  const tables = ['folhas_obras', 'items'];
  
  for (const table of tables) {
    try {
      // Try to fetch rows from the table
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .limit(5);
      
      if (error) {
        console.error(`❌ Error accessing table ${table}:`, error.message);
      } else {
        console.log(`✅ Successfully accessed table ${table}`);
        console.log(`   Found ${data.length} rows in ${table}`);
        if (data.length > 0) {
          console.log(`   First row sample: ${JSON.stringify(data[0])}`);
        }
      }
    } catch (err) {
      console.error(`❌ Unexpected error with table ${table}:`, err.message);
    }
  }
}

async function testWrite() {
  console.log('\n🖊️ Testing write operations with service role key...');
  
  try {
    // Test insert into folhas_obras
    const testFoId = 'test-' + Date.now();
    const { data: newFO, error: foError } = await supabaseAdmin
      .from('folhas_obras')
      .insert({
        numero_fo: testFoId,
        nome_campanha: 'Test Campaign',
        profile_id: '123'
      })
      .select();
    
    if (foError) {
      console.error('❌ Error inserting into folhas_obras:', foError.message);
    } else {
      console.log('✅ Successfully inserted into folhas_obras:', newFO);
      
      // Test insert into items
      const { data: newItem, error: itemError } = await supabaseAdmin
        .from('items')
        .insert({
          folha_obra_id: newFO[0].id,
          nome_item: 'Test Item',
          estado: 'pendente'
        })
        .select();
      
      if (itemError) {
        console.error('❌ Error inserting into items:', itemError.message);
      } else {
        console.log('✅ Successfully inserted into items:', newItem);
      }
      
      // Cleanup test data
      await supabaseAdmin.from('items').delete().eq('folha_obra_id', newFO[0].id);
      await supabaseAdmin.from('folhas_obras').delete().eq('id', newFO[0].id);
      console.log('🧹 Cleaned up test data');
    }
  } catch (err) {
    console.error('❌ Unexpected error during write test:', err.message);
  }
}

async function checkRoles() {
  console.log('\n👤 Checking roles table...');
  try {
    const { data, error } = await supabaseAdmin
      .from('roles')
      .select('*');
    
    if (error) {
      console.error('❌ Error accessing roles table:', error.message);
    } else {
      console.log('✅ Available roles:');
      console.log(data);
    }
  } catch (err) {
    console.error('❌ Unexpected error checking roles:', err.message);
  }
}

async function checkProfiles() {
  console.log('\n👥 Checking profiles table for maria.martins@imacx.pt...');
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*, roles(*)')
      .eq('email', 'maria.martins@imacx.pt');
    
    if (error) {
      console.error('❌ Error accessing profiles:', error.message);
    } else if (data.length === 0) {
      console.log('❌ No profile found for maria.martins@imacx.pt');
    } else {
      console.log('✅ Found profile:');
      console.log(data[0]);
    }
  } catch (err) {
    console.error('❌ Unexpected error checking profiles:', err.message);
  }
}

async function runTest() {
  try {
    console.log('🚀 Starting admin access test using service role key...');
    
    // Test if we can access tables
    await testTablesAccess();
    
    // Test write operations
    await testWrite();
    
    // Check roles
    await checkRoles();
    
    // Check profile
    await checkProfiles();
    
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

runTest(); 