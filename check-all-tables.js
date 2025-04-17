require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Function to safely check if a table exists
async function checkTableExists(tableName) {
  try {
    // Try to fetch a single row from the table
    console.log(`Checking if table '${tableName}' exists...`);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        return { exists: false, message: `Table '${tableName}' does not exist` };
      } else {
        return { exists: true, message: `Table '${tableName}' exists but error: ${error.message}` };
      }
    }
    
    return { 
      exists: true, 
      message: `Table '${tableName}' exists with ${data.length} sample records`,
      sample: data.length > 0 ? data[0] : null
    };
  } catch (err) {
    return { exists: false, message: `Error checking '${tableName}': ${err.message}` };
  }
}

async function checkAllTables() {
  console.log('🔍 Checking all possible table names for folhas_obras and items...');
  
  // Possible table names to check
  const tableNames = [
    'folhas_obras',
    'folhas_obra',
    'folha_obras',
    'folha_obra',
    'items',
    'item',
    'profiles',
    'profile',
    'roles',
    'role',
    'users_with_profiles'
  ];
  
  const results = {};
  
  for (const tableName of tableNames) {
    const result = await checkTableExists(tableName);
    results[tableName] = result;
    
    if (result.exists) {
      console.log(`✅ ${result.message}`);
      
      // If table exists, try to show its columns
      if (result.sample) {
        console.log(`   Columns: ${Object.keys(result.sample).join(', ')}`);
      }
    } else {
      console.log(`❌ ${result.message}`);
    }
  }
  
  // Summary
  console.log('\n📊 Database Table Summary:');
  const existingTables = Object.keys(results).filter(table => results[table].exists);
  
  console.log(`Found ${existingTables.length} existing tables:`);
  existingTables.forEach(table => console.log(`- ${table}`));
  
  console.log('\n📝 Recommendations:');
  
  // Check if we found folhas_obras or an alternative
  if (results['folhas_obras'].exists) {
    console.log('✅ Use table "folhas_obras" in your code (already exists)');
  } else if (results['folhas_obra'].exists) {
    console.log('⚠️ Your code uses "folhas_obras" but "folhas_obra" exists in the database');
    console.log('   Options:');
    console.log('   1. Rename your database table to match your code');
    console.log('   2. Change your code to use "folhas_obra" instead');
  }
  
  // Check if we found items or an alternative
  if (results['items'].exists) {
    console.log('✅ Use table "items" in your code (already exists)');
  } else if (results['item'].exists) {
    console.log('⚠️ Your code uses "items" but "item" exists in the database');
    console.log('   Options:');
    console.log('   1. Rename your database table to match your code');
    console.log('   2. Change your code to use "item" instead');
  }
}

checkAllTables(); 