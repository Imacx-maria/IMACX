import { createClient } from '@supabase/supabase-js'; // Use standard client
import { NextResponse } from 'next/server';
// Remove unused imports: createServerComponentClient, cookies

// Ensure environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug environment variables (safely)
console.log('API Route Environment Check:', {
  hasUrl: !!supabaseUrl,
  hasServiceKey: !!supabaseServiceRoleKey,
  serviceKeyLength: supabaseServiceRoleKey?.length || 0
});

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables');
}

// Create a Supabase client with service role
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, role_id } = body;

    console.log('Received request data:', {
      email,
      first_name,
      last_name,
      role_id,
      password: '********'
    });

    // Input validation
    if (!email || !password || !first_name || !last_name || !role_id) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!first_name) missingFields.push('first_name');
      if (!last_name) missingFields.push('last_name');
      if (!role_id) missingFields.push('role_id');

      return NextResponse.json({
        error: 'Missing required fields',
        details: `Missing: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // First create the user in auth
    console.log('Creating user in auth...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        role_id
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({
        error: authError.message
      }, { status: 400 });
    }

    if (!authData?.user) {
      console.error('No user data returned from auth');
      return NextResponse.json({
        error: 'Failed to create user'
      }, { status: 500 });
    }

    // Verify profile creation (Trigger might be async, so check is still useful)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    // If profile doesn't exist or there was an error, create it manually
    if (profileError || !profile) {
      console.log('Profile not created by trigger, creating manually...');
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          first_name,
          last_name,
          role_id,
        });

      if (insertError) {
        console.error('Error creating profile manually:', insertError);
        // Delete the auth user since profile creation failed
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return NextResponse.json({
          error: 'Failed to create user profile',
          details: insertError.message
        }, { status: 500 });
      }
    }

    // Verify final profile creation
    const { data: finalProfile, error: finalProfileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (finalProfileError || !finalProfile) {
      console.error('Final profile verification failed:', finalProfileError);
      // Clean up: delete auth user if profile creation failed
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({
        error: 'Failed to verify user profile creation',
        details: finalProfileError?.message || 'Profile not found'
      }, { status: 500 });
    }

    console.log('User and profile created successfully');
    return NextResponse.json({
      message: 'User created successfully',
      userId: authData.user.id,
      profile: finalProfile
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      error: 'Server error',
      details: error.message
    }, { status: 500 });
  }
}