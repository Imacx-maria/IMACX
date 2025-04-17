const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key (required for managing RLS policies)
const supabaseUrl = 'https://hwadpgrstlrmpvkntopf.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWRwZ3JzdGxybXB2a250b3BmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk0NTg4MiwiZXhwIjoyMDU5NTIxODgyfQ.0JP5Q-l3ZAbEaEj-VgnU_r1eNjaGIfnaQGrgaOmymqI';

// Create client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkAndUpdateRLSPolicies() {
  console.log('Checking and updating RLS policies for folhas_obras and items tables...\n');
  
  try {
    // Step 1: Query existing RLS policies
    console.log('1. Checking existing RLS policies...');
    
    // Note: We need to use raw SQL queries to check policies since there isn't a direct API for this
    const { data: policyData, error: policyError } = await supabase.rpc('get_rls_policies');
    
    if (policyError) {
      console.log('Error getting policies, trying alternative approach...');
      
      // Alternative: Use system tables directly
      const { data: policies, error: sqlError } = await supabase
        .from('pg_policies')
        .select('*')
        .or('tablename.eq.folhas_obras,tablename.eq.items');
      
      if (sqlError) {
        console.log('❌ Unable to retrieve RLS policies directly');
        
        // Since the above methods didn't work, we'll use SQL directly
        const { data: sqlPolicies, error: rawSqlError } = await supabase.rpc('exec_sql', {
          sql_query: `
            SELECT 
              schemaname, 
              tablename, 
              policyname, 
              permissive, 
              roles::text[], 
              cmd, 
              qual::text, 
              with_check::text
            FROM pg_policies 
            WHERE 
              tablename IN ('folhas_obras', 'items') 
              AND schemaname = 'public'
          `
        });
        
        if (rawSqlError) {
          throw new Error(`Unable to retrieve policy information: ${rawSqlError.message}`);
        }
        
        if (sqlPolicies) {
          console.log('Current RLS policies:');
          console.table(sqlPolicies);
        }
      } else {
        console.log('Current RLS policies:');
        console.table(policies);
      }
    } else {
      console.log('Current RLS policies:');
      console.table(policyData);
    }
    
    // Step 2: Enable RLS on both tables if not already enabled
    console.log('\n2. Ensuring RLS is enabled for both tables...');
    
    // For folhas_obras
    try {
      const { error: enableFOError } = await supabase.rpc('exec_sql', {
        sql_query: `ALTER TABLE public.folhas_obras ENABLE ROW LEVEL SECURITY;`
      });
      
      if (enableFOError) {
        console.log(`❌ Error enabling RLS on folhas_obras: ${enableFOError.message}`);
      } else {
        console.log('✅ RLS enabled or already active on folhas_obras');
      }
    } catch (err) {
      console.log(`❌ Error with folhas_obras RLS: ${err.message}`);
    }
    
    // For items
    try {
      const { error: enableItemsError } = await supabase.rpc('exec_sql', {
        sql_query: `ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;`
      });
      
      if (enableItemsError) {
        console.log(`❌ Error enabling RLS on items: ${enableItemsError.message}`);
      } else {
        console.log('✅ RLS enabled or already active on items');
      }
    } catch (err) {
      console.log(`❌ Error with items RLS: ${err.message}`);
    }
    
    // Step 3: Create or update RLS policies for folhas_obras
    console.log('\n3. Setting up RLS policies for folhas_obras...');
    
    // First drop existing policies (to avoid conflicts)
    try {
      const { error: dropFOPolicyError } = await supabase.rpc('exec_sql', {
        sql_query: `
          DROP POLICY IF EXISTS "Allow authenticated users full access to folhas_obras" ON public.folhas_obras;
        `
      });
      
      if (dropFOPolicyError) {
        console.log(`Warning dropping folhas_obras policy: ${dropFOPolicyError.message}`);
      }
      
      // Create policy for folhas_obras
      const { error: createFOPolicyError } = await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE POLICY "Allow authenticated users full access to folhas_obras"
          ON public.folhas_obras
          FOR ALL
          TO authenticated
          USING (true)
          WITH CHECK (true);
        `
      });
      
      if (createFOPolicyError) {
        throw new Error(`Error creating folhas_obras policy: ${createFOPolicyError.message}`);
      }
      
      console.log('✅ Successfully created/updated policy for folhas_obras');
      
    } catch (err) {
      console.log(`❌ Error with folhas_obras policy: ${err.message}`);
    }
    
    // Step 4: Create or update RLS policies for items
    console.log('\n4. Setting up RLS policies for items...');
    
    // First drop existing policies (to avoid conflicts)
    try {
      const { error: dropItemsPolicyError } = await supabase.rpc('exec_sql', {
        sql_query: `
          DROP POLICY IF EXISTS "Allow authenticated users full access to items" ON public.items;
        `
      });
      
      if (dropItemsPolicyError) {
        console.log(`Warning dropping items policy: ${dropItemsPolicyError.message}`);
      }
      
      // Create policy for items
      const { error: createItemsPolicyError } = await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE POLICY "Allow authenticated users full access to items"
          ON public.items
          FOR ALL
          TO authenticated
          USING (true)
          WITH CHECK (true);
        `
      });
      
      if (createItemsPolicyError) {
        throw new Error(`Error creating items policy: ${createItemsPolicyError.message}`);
      }
      
      console.log('✅ Successfully created/updated policy for items');
      
    } catch (err) {
      console.log(`❌ Error with items policy: ${err.message}`);
    }
    
    // Step 5: Verify final policies
    console.log('\n5. Verifying final RLS policies...');
    
    const { data: finalPolicies, error: finalPolicyError } = await supabase.rpc('exec_sql', {
      sql_query: `
        SELECT 
          schemaname, 
          tablename, 
          policyname, 
          permissive, 
          roles::text[], 
          cmd, 
          qual::text, 
          with_check::text
        FROM pg_policies 
        WHERE 
          tablename IN ('folhas_obras', 'items') 
          AND schemaname = 'public'
      `
    });
    
    if (finalPolicyError) {
      console.log(`❌ Error verifying final policies: ${finalPolicyError.message}`);
    } else {
      console.log('Final RLS policies:');
      console.table(finalPolicies);
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('✅ RLS policy setup process completed!');
    console.log('👉 Next step: Run the test-auth-access.js script to verify your access with authentication');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

// Run the policy update process
checkAndUpdateRLSPolicies(); 