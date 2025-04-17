require('dotenv').config();

// Function to mask sensitive data
function maskSensitiveData(str) {
  if (!str) return 'Not set';
  if (str.length <= 8) return '********';
  
  // For longer strings, show first 4 and last 4 characters
  return `${str.substring(0, 4)}...${str.substring(str.length - 4)}`;
}

// Check environment variables
console.log('🔐 Checking environment variables...');
console.log('\nSupabase Connection Info:');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${maskSensitiveData(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${maskSensitiveData(process.env.SUPABASE_SERVICE_ROLE_KEY)}`);

// Check for any potentially missing required variables
const missingVariables = [];
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVariables.push('NEXT_PUBLIC_SUPABASE_URL');
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingVariables.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingVariables.push('SUPABASE_SERVICE_ROLE_KEY');

if (missingVariables.length > 0) {
  console.log('\n❌ Missing required environment variables:');
  missingVariables.forEach(variable => console.log(`- ${variable}`));
} else {
  console.log('\n✅ All required Supabase environment variables are set');
}

// Attempt to create a Supabase client to check if the URL is valid
const { createClient } = require('@supabase/supabase-js');
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (url && anonKey) {
    console.log('\n🔄 Testing Supabase connection...');
    
    const supabase = createClient(url, anonKey);
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('❌ Connection error:', error.message);
      } else {
        console.log('✅ Successfully connected to Supabase');
        console.log(`🔑 Connected with ${data.session ? 'active session' : 'no session'}`);
      }
    });
  }
} catch (error) {
  console.error('\n❌ Error creating Supabase client:', error.message);
}

console.log('\n🔔 Note: If your environment values changed, you may need to restart your Next.js server');
console.log('   Run: npm run dev'); 