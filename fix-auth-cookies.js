require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a Supabase client with the anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

async function testAuthWithBackoff() {
  console.log('🔑 Testing authentication with backoff strategy...');
  
  const email = 'maria.martins@imacx.pt';
  const password = 'Imacx_123456789';
  const maxRetries = 3;
  
  // Implement exponential backoff
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`\n🔄 Attempt ${attempt + 1} of ${maxRetries}...`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error(`❌ Sign-in error: ${error.message}`);
        
        if (error.message === 'Request rate limit reached' && attempt < maxRetries - 1) {
          const waitTime = 1000 * Math.pow(2, attempt);
          console.log(`⏱️ Rate limited. Waiting ${waitTime/1000} seconds before retrying...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        } else {
          throw error;
        }
      }
      
      console.log('✅ Successfully signed in');
      console.log(`👤 User: ${data.user.email}`);
      
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      console.log(`🔒 Session valid: ${!!session}`);
      
      // Check if we can access a protected table
      const { data: folhasData, error: folhasError } = await supabase
        .from('folhas_obras')
        .select('id')
        .limit(1);
      
      if (folhasError) {
        console.error(`❌ Table access error: ${folhasError.message}`);
      } else {
        console.log('✅ Successfully accessed protected table');
      }
      
      // Sign out to clean up
      await supabase.auth.signOut();
      console.log('🔒 Signed out');
      
      return true;
    } catch (error) {
      console.error(`❌ Unexpected error: ${error.message}`);
      
      if (attempt < maxRetries - 1) {
        const waitTime = 1000 * Math.pow(2, attempt);
        console.log(`⏱️ Waiting ${waitTime/1000} seconds before retrying...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error('❌ All retry attempts failed');
      }
    }
  }
  
  return false;
}

console.log(`
┌─────────────────────────────────────────────────────┐
│ Supabase Authentication Rate Limit Troubleshooting  │
└─────────────────────────────────────────────────────┘

1. This script will attempt to sign in with automatic backoff
2. If it succeeds, authentication works but you need to add
   rate limit handling to your app
3. For your Next.js app, make these changes:

   a) Add debouncing to your login form
   b) Disable the login button after first click
   c) Add exponential backoff for retry attempts
   d) Fix cookies handling in API routes by making them async

`);

// Execute the test
testAuthWithBackoff()
  .then(success => {
    if (success) {
      console.log(`
┌─────────────────────────────────────────────────────┐
│                Fix for API Routes                   │
└─────────────────────────────────────────────────────┘

Your API routes have cookie handling errors:
[Error: Route used cookies().get(...) without awaiting]

Update your API route handlers to properly await cookies():

// INCORRECT:
export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Rest of handler
}

// CORRECT:
export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ 
    cookies: async () => cookieStore 
  });
  
  // Rest of handler
}
`);
    } else {
      console.log(`
┌─────────────────────────────────────────────────────┐
│              Authentication Failed                  │
└─────────────────────────────────────────────────────┘

Rate limiting or other authentication issues prevented login.
Wait 15-60 minutes before trying again, or check your credentials.
`);
    }
  }); 