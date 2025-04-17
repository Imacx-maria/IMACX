// test-db-access.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key from .env
const supabaseUrl = 'https://hwadpgrstlrmpvkntopf.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWRwZ3JzdGxybXB2a250b3BmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk0NTg4MiwiZXhwIjoyMDU5NTIxODgyfQ.0JP5Q-l3ZAbEaEj-VgnU_r1eNjaGIfnaQGrgaOmymqI';

// Create client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testTableAccess() {
  console.log('Starting Supabase access test to find tables and relationships...');
  
  try {
    // First, check access to folhas_obra and explore its structure
    console.log('\n1. Confirming access to folhas_obra...');
    const { data: folhasObra, error: folhasObraReadError } = await supabase
      .from('folhas_obra')
      .select('*')
      .limit(5);
    
    if (folhasObraReadError) {
      throw new Error(`Failed to read from folhas_obra: ${folhasObraReadError.message}`);
    }
    console.log(`✅ Found ${folhasObra.length} records in folhas_obra table`);
    
    // Print out the schema of the first row to understand the structure
    if (folhasObra.length > 0) {
      console.log('\nSchema of folhas_obra (first record):');
      const firstRecord = folhasObra[0];
      const keys = Object.keys(firstRecord);
      keys.forEach(key => {
        console.log(`- ${key}: ${typeof firstRecord[key]}`);
      });
    }
    
    // Try accessing public schema tables
    console.log('\n2. Searching for other tables to find the items table...');
    const possibleItemTables = [
      'items',
      'item',
      'work_items',
      'trabalho_items',
      'folha_obra_items',
      'folha_obra_item',
      'folhas_obra_items',
      'folhas_obra_item'
    ];
    
    for (const tableName of possibleItemTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${tableName}': ${error.message}`);
        } else {
          console.log(`✅ Table '${tableName}' accessible! Found ${data.length} records`);
          if (data.length > 0) {
            console.log(`Schema of ${tableName} (first record):`);
            const firstRecord = data[0];
            const keys = Object.keys(firstRecord);
            keys.forEach(key => {
              console.log(`- ${key}: ${typeof firstRecord[key]}`);
            });
          }
        }
      } catch (err) {
        console.log(`❌ Error checking table '${tableName}': ${err.message}`);
      }
    }
    
    // Test CRUD operations on folhas_obra
    console.log('\n3. Testing CRUD operations on folhas_obra...');
    
    // Create (INSERT)
    console.log('\nTesting INSERT...');
    const testWorkOrder = {
      numero_fo: Math.floor(Math.random() * 9000) + 1000, // Random 4-digit number
      item: 'Test Item ' + Date.now(),  // 'item' field required based on schema
      designer_id: null,
      data_in: new Date().toISOString()
    };
    
    const { data: insertedWorkOrder, error: workOrderInsertError } = await supabase
      .from('folhas_obra')
      .insert(testWorkOrder)
      .select()
      .single();
    
    if (workOrderInsertError) {
      throw new Error(`Failed to insert into folhas_obra: ${workOrderInsertError.message}`);
    }
    console.log('✅ INSERT successful. Created record with ID:', insertedWorkOrder.id);
    
    // Read (SELECT)
    console.log('\nTesting SELECT of inserted record...');
    const { data: readWorkOrder, error: readError } = await supabase
      .from('folhas_obra')
      .select('*')
      .eq('id', insertedWorkOrder.id)
      .single();
    
    if (readError) {
      throw new Error(`Failed to read inserted record: ${readError.message}`);
    }
    console.log('✅ SELECT successful:', readWorkOrder);
    
    // Update (UPDATE)
    console.log('\nTesting UPDATE...');
    const workOrderUpdate = {
      item: 'Updated Test Item ' + Date.now()
    };
    
    const { error: workOrderUpdateError } = await supabase
      .from('folhas_obra')
      .update(workOrderUpdate)
      .eq('id', insertedWorkOrder.id);
    
    if (workOrderUpdateError) {
      throw new Error(`Failed to update folhas_obra: ${workOrderUpdateError.message}`);
    }
    console.log('✅ UPDATE successful');
    
    // Verify update
    const { data: updatedWorkOrder, error: verifyError } = await supabase
      .from('folhas_obra')
      .select('*')
      .eq('id', insertedWorkOrder.id)
      .single();
    
    if (verifyError) {
      throw new Error(`Failed to verify update: ${verifyError.message}`);
    }
    console.log('Updated record:', updatedWorkOrder);
    
    // Delete (DELETE)
    console.log('\nTesting DELETE...');
    const { error: workOrderDeleteError } = await supabase
      .from('folhas_obra')
      .delete()
      .eq('id', insertedWorkOrder.id);
    
    if (workOrderDeleteError) {
      throw new Error(`Failed to delete from folhas_obra: ${workOrderDeleteError.message}`);
    }
    console.log('✅ DELETE successful');
    
    console.log('\nSUMMARY: Full CRUD access to folhas_obra table confirmed! ✅');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\nSUMMARY: Test failed. See error above.');
  }
}

// Run the test
testTableAccess(); 