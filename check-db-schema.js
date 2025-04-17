require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkDatabaseInfo() {
  console.log('🔍 Checking database schema and permissions...');
  
  try {
    // Check which user we're connecting as
    const { data: userInfo, error: userError } = await supabase
      .from('_schema_info')
      .select('current_user, current_database()')
      .limit(1)
      .single();
    
    if (userError) {
      console.log('❌ Error getting current user:', userError.message);
      
      // Let's try a direct query
      try {
        const { data, error } = await supabase.rpc('get_current_user_info');
        if (error) {
          console.error('❌ Error with RPC call:', error.message);
        } else {
          console.log('✅ Current user info:', data);
        }
      } catch (e) {
        console.error('❌ Failed to get user info via RPC:', e.message);
      }
    } else {
      console.log('✅ Connected as:', userInfo);
    }
    
    // Check if tables exist in public schema
    console.log('\n📊 Checking if tables exist in public schema...');
    try {
      const { data: tablesData, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_schema, table_name')
        .in('table_name', ['folhas_obras', 'items', 'profiles', 'roles'])
        .eq('table_schema', 'public');
      
      if (tablesError) {
        console.error('❌ Error checking tables:', tablesError.message);
      } else {
        console.log('✅ Found tables:');
        tablesData.forEach(table => {
          console.log(`   - ${table.table_schema}.${table.table_name}`);
        });
      }
    } catch (e) {
      console.error('❌ Failed to check tables:', e.message);
    }
    
    // Try to access tables directly by schema
    console.log('\n🔐 Trying tables with explicit schema reference...');
    const tablesToCheck = [
      'public.folhas_obras',
      'public.items',
      'auth.users',
      'storage.objects'
    ];
    
    for (const fullTableName of tablesToCheck) {
      try {
        console.log(`   Checking ${fullTableName}...`);
        const { data, error } = await supabase
          .from(fullTableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`   ❌ Error accessing ${fullTableName}: ${error.message}`);
        } else {
          console.log(`   ✅ Successfully accessed ${fullTableName}`);
        }
      } catch (e) {
        console.error(`   ❌ Error accessing ${fullTableName}: ${e.message}`);
      }
    }
    
    // Check if profiles table is actually "profile" (singular)
    console.log('\n🧪 Checking for alternative table names...');
    const alternativeTables = [
      'folhas_obra', // singular
      'folha_obra',  // more singular
      'profile',     // singular profiles
      'item'         // singular items
    ];
    
    for (const table of alternativeTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          if (error.message.includes('does not exist')) {
            console.log(`   ❌ Table '${table}' does not exist`);
          } else {
            console.log(`   ❓ Table '${table}' exists but error: ${error.message}`);
          }
        } else {
          console.log(`   ✅ Table '${table}' exists!`);
        }
      } catch (e) {
        console.error(`   ❌ Error checking ${table}: ${e.message}`);
      }
    }
    
    // Check RLS status
    console.log('\n🔒 Checking RLS status...');
    try {
      const { data: rlsData, error: rlsError } = await supabase
        .from('pg_tables')
        .select(`
          tablename,
          tableowner,
          (
            SELECT relrowsecurity 
            FROM pg_class 
            WHERE oid = (
              SELECT oid FROM pg_class WHERE relname = tablename
            )
          ) as has_rls
        `)
        .in('tablename', ['folhas_obras', 'items', 'profiles', 'roles']);
      
      if (rlsError) {
        console.error('❌ Error checking RLS status:', rlsError.message);
      } else {
        console.log('✅ RLS status:');
        rlsData.forEach(table => {
          console.log(`   - ${table.tablename}: RLS ${table.has_rls ? 'enabled' : 'disabled'}, owner: ${table.tableowner}`);
        });
      }
    } catch (e) {
      console.error('❌ Failed to check RLS status:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkDatabaseInfo().catch(console.error); 