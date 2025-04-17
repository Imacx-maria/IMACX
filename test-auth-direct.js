require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a Supabase client with the public anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false  // Don't persist to avoid issues with cookies
  }
});

async function testAuthAndAccess() {
  console.log('🔑 Testing authentication and table access...');
  
  try {
    // Step 1: Sign in with email and password
    console.log('\n1️⃣ Signing in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'maria.martins@imacx.pt',
      password: 'Imacx_123456789'
    });
    
    if (signInError) {
      console.error('❌ Sign-in error:', signInError.message);
      return;
    }
    
    console.log('✅ Successfully signed in');
    console.log(`👤 User: ${signInData.user.email}`);
    console.log(`🔑 Role: ${signInData.user.role}`);
    
    // Step 2: Get the session and print the access token
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log(`\n🔒 Access token: ${session.access_token.substring(0, 10)}...`);
      console.log(`📆 Token expires: ${new Date(session.expires_at * 1000).toLocaleString()}`);
    }
    
    // Step 3: Test accessing the folhas_obras table
    console.log('\n2️⃣ Testing access to folhas_obras...');
    const { data: folhasData, error: folhasError } = await supabase
      .from('folhas_obras')
      .select('*')
      .limit(3);
    
    if (folhasError) {
      console.error('❌ Error accessing folhas_obras:', folhasError.message);
    } else {
      console.log('✅ Successfully accessed folhas_obras table');
      console.log(`📊 Found ${folhasData.length} records`);
      
      if (folhasData.length > 0) {
        console.log('\nSample record:');
        const sample = folhasData[0];
        console.log(`- ID: ${sample.id}`);
        console.log(`- Number: ${sample.numero_fo}`);
        console.log(`- Campaign: ${sample.nome_campanha}`);
      }
    }
    
    // Step 4: Test accessing the items table
    console.log('\n3️⃣ Testing access to items...');
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .limit(3);
    
    if (itemsError) {
      console.error('❌ Error accessing items:', itemsError.message);
    } else {
      console.log('✅ Successfully accessed items table');
      console.log(`📊 Found ${itemsData.length} records`);
      
      if (itemsData.length > 0) {
        console.log('\nSample record:');
        const sample = itemsData[0];
        console.log(`- ID: ${sample.id}`);
        console.log(`- Description: ${sample.descricao}`);
        console.log(`- Folha Obra ID: ${sample.folha_obra_id}`);
      }
    }
    
    // Step 5: Try inserting a test record
    console.log('\n4️⃣ Testing write access...');
    const testId = Date.now();
    const { data: insertData, error: insertError } = await supabase
      .from('folhas_obras')
      .insert({
        numero_fo: testId,
        nome_campanha: 'Test Campaign'
      })
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting into folhas_obras:', insertError.message);
    } else {
      console.log('✅ Successfully inserted into folhas_obras');
      console.log(`📝 Created record with ID: ${insertData[0].id}`);
      
      // Clean up the test record
      const { error: deleteError } = await supabase
        .from('folhas_obras')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.error('❌ Error cleaning up test record:', deleteError.message);
      } else {
        console.log('🧹 Successfully cleaned up test record');
      }
    }
    
    // Step 6: Check user profile and role
    console.log('\n5️⃣ Checking user profile and role...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        roles:role_id (
          id,
          name
        )
      `)
      .eq('user_id', signInData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Error fetching profile:', profileError.message);
    } else {
      console.log('✅ Successfully fetched user profile');
      console.log(`👤 User Profile:`);
      console.log(`- ID: ${profileData.id}`);
      console.log(`- User ID: ${profileData.user_id}`);
      console.log(`- Name: ${profileData.first_name} ${profileData.last_name}`);
      console.log(`- Role: ${profileData.roles ? profileData.roles.name : 'Unknown'}`);
    }
    
    // Step 7: Sign out
    await supabase.auth.signOut();
    console.log('\n6️⃣ Signed out successfully');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAuthAndAccess(); 