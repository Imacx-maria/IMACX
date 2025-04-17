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

async function grantPermissions() {
  console.log('🔑 Starting permission grants...');

  try {
    // List of tables to grant permissions on
    const tables = [
      'folhas_obras',
      'items',
      'profiles',
      'roles',
      'users_with_profiles'
    ];

    // Grant permissions to authenticated role for each table
    for (const table of tables) {
      console.log(`\n🔐 Granting permissions on ${table}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: `GRANT SELECT, INSERT, UPDATE, DELETE ON "${table}" TO authenticated;`
        });

        if (error) {
          if (error.message.includes('function') && error.message.includes('exec_sql') && error.message.includes('not exist')) {
            console.log('❌ exec_sql function not found. Trying direct SQL execution...');
            console.log('⚠️ Note: Direct SQL execution is not possible through the Supabase JS client.');
            console.log('⚠️ Please run this SQL in the Supabase SQL Editor or database console:');
            console.log(`GRANT SELECT, INSERT, UPDATE, DELETE ON "${table}" TO authenticated;`);
          } else {
            console.error(`❌ Error granting permissions on ${table}:`, error.message);
          }
        } else {
          console.log(`✅ Successfully granted permissions on ${table}`);
        }
      } catch (err) {
        console.error(`❌ Unexpected error with ${table}:`, err.message);
      }
    }

    // Make note of manual SQL instructions 
    console.log('\n📝 Instructions for manual execution in SQL Editor:');
    console.log('If the above grants failed, please run these commands in the Supabase SQL Editor:');
    console.log('```sql');
    tables.forEach(table => {
      console.log(`GRANT SELECT, INSERT, UPDATE, DELETE ON "${table}" TO authenticated;`);
    });
    console.log('```');

    console.log('\n📝 Row Level Security (RLS) Reminder:');
    console.log('Remember that even with these grants, Row Level Security policies also need to be configured');
    console.log('For tables with RLS enabled, you need policies that allow the authenticated role to access rows');
    console.log('Example policy for SELECT:');
    console.log('```sql');
    console.log('CREATE POLICY "Allow select for authenticated users" ON "table_name"');
    console.log('FOR SELECT TO authenticated USING (true);');
    console.log('```');

    console.log('\n✅ Permission grant process completed!');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

grantPermissions(); 