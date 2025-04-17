const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with anon key for authentication
const supabaseUrl = 'https://hwadpgrstlrmpvkntopf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWRwZ3JzdGxybXB2a250b3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NDU4ODIsImV4cCI6MjA1OTUyMTg4Mn0.jsIJtQEEJ-VAyaeApLx_dKl7xRDJv84dnZilEyaVhnE';

// Create a Supabase client (this will be authenticated later)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthenticatedAccess() {
  console.log('Testing access to folhas_obras and items tables with authentication...\n');
  
  try {
    // Step 1: Sign in with provided credentials
    console.log('1. Signing in to Supabase...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'maria.martins@imacx.pt',
      password: 'Imacx_123456789'
    });
    
    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`);
    }
    
    console.log('✅ Authentication successful!');
    console.log(`User: ${authData.user.email} (${authData.user.id})`);
    
    // Step 2: Test access to folhas_obras
    console.log('\n2. Testing access to folhas_obras table...');
    const { data: folhasObras, error: folhasObrasError } = await supabase
      .from('folhas_obras')
      .select('*')
      .limit(5);
    
    if (folhasObrasError) {
      console.log(`❌ Error accessing folhas_obras: ${folhasObrasError.message}`);
    } else {
      console.log(`✅ Successfully accessed folhas_obras! Found ${folhasObras.length} records.`);
      
      if (folhasObras.length > 0) {
        console.log('\nSample folhas_obras record:');
        console.log(folhasObras[0]);
      }
    }
    
    // Step 3: Test access to items
    console.log('\n3. Testing access to items table...');
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .limit(5);
    
    if (itemsError) {
      console.log(`❌ Error accessing items: ${itemsError.message}`);
    } else {
      console.log(`✅ Successfully accessed items! Found ${items.length} records.`);
      
      if (items.length > 0) {
        console.log('\nSample items record:');
        console.log(items[0]);
      }
    }
    
    // Step 4: Test CRUD operations on folhas_obras
    console.log('\n4. Testing CRUD operations on folhas_obras...');
    
    // Create test
    console.log('\nTesting INSERT into folhas_obras...');
    const testWorkOrder = {
      numero_fo: Math.floor(Math.random() * 9000) + 1000,
      nome_campanha: 'Test Campaign ' + Date.now(),
      notas: 'Testing authenticated access',
      prioridade: false
    };
    
    const { data: insertedFO, error: insertFOError } = await supabase
      .from('folhas_obras')
      .insert(testWorkOrder)
      .select()
      .single();
    
    if (insertFOError) {
      console.log(`❌ Error inserting into folhas_obras: ${insertFOError.message}`);
    } else {
      console.log(`✅ Successfully inserted record into folhas_obras: ${insertedFO.id}`);
      
      // Update test
      console.log('\nTesting UPDATE in folhas_obras...');
      const { error: updateFOError } = await supabase
        .from('folhas_obras')
        .update({ nome_campanha: 'Updated Test ' + Date.now() })
        .eq('id', insertedFO.id);
      
      if (updateFOError) {
        console.log(`❌ Error updating folhas_obras: ${updateFOError.message}`);
      } else {
        console.log('✅ Successfully updated record in folhas_obras!');
      }
      
      // Step 5: Test CRUD operations on items
      console.log('\n5. Testing CRUD operations on items...');
      
      // Create test
      console.log('\nTesting INSERT into items...');
      const testItem = {
        folha_obra_id: insertedFO.id,
        descricao: 'Test Item ' + Date.now(),
        codigo: 'TST-' + Date.now(),
        em_curso: true
      };
      
      const { data: insertedItem, error: insertItemError } = await supabase
        .from('items')
        .insert(testItem)
        .select()
        .single();
      
      if (insertItemError) {
        console.log(`❌ Error inserting into items: ${insertItemError.message}`);
      } else {
        console.log(`✅ Successfully inserted record into items: ${insertedItem.id}`);
        
        // Update test
        console.log('\nTesting UPDATE in items...');
        const { error: updateItemError } = await supabase
          .from('items')
          .update({ descricao: 'Updated Item ' + Date.now() })
          .eq('id', insertedItem.id);
        
        if (updateItemError) {
          console.log(`❌ Error updating items: ${updateItemError.message}`);
        } else {
          console.log('✅ Successfully updated record in items!');
        }
        
        // Delete test for item
        console.log('\nTesting DELETE from items...');
        const { error: deleteItemError } = await supabase
          .from('items')
          .delete()
          .eq('id', insertedItem.id);
        
        if (deleteItemError) {
          console.log(`❌ Error deleting from items: ${deleteItemError.message}`);
        } else {
          console.log('✅ Successfully deleted record from items!');
        }
      }
      
      // Delete test for folhas_obras
      console.log('\nTesting DELETE from folhas_obras...');
      const { error: deleteFOError } = await supabase
        .from('folhas_obras')
        .delete()
        .eq('id', insertedFO.id);
      
      if (deleteFOError) {
        console.log(`❌ Error deleting from folhas_obras: ${deleteFOError.message}`);
      } else {
        console.log('✅ Successfully deleted record from folhas_obras!');
      }
    }
    
    // Final summary
    console.log('\n=== ACCESS TEST SUMMARY ===');
    console.log('folhas_obras access: ' + (folhasObrasError ? '❌ FAILED' : '✅ SUCCESS'));
    console.log('items access: ' + (itemsError ? '❌ FAILED' : '✅ SUCCESS'));
    
  } catch (error) {
    console.error('❌ TEST ERROR:', error.message);
  } finally {
    // Sign out when done
    await supabase.auth.signOut();
    console.log('\nTest complete. Signed out.');
  }
}

// Run the test
testAuthenticatedAccess(); 