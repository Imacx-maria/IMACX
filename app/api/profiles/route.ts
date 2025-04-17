import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Ensure environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase admin client specifically for this route
const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: { // Explicitly set the schema
    schema: 'public',
  }
});

export async function POST(request: Request) {
  console.log("[Profile API] Received request to create profile.");
  try {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase environment variables for profile API');
    }

    const body = await request.json();
    const { userId, firstName, lastName, roleId } = body;

    // Input validation
    if (!userId || !firstName || !lastName || !roleId) {
      console.error("[Profile API] Missing required fields:", body);
      return NextResponse.json({ error: 'Missing required fields for profile creation' }, { status: 400 });
    }

    console.log(`[Profile API] Attempting to insert profile for user: ${userId}`);

    // Insert into profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('public.profiles') // Explicitly specify schema
      .insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        role_id: roleId
      })
      .select('id') // Select to confirm insertion
      .single();

    if (profileError) {
      console.error(`[Profile API] Profile insertion error for user ${userId}:`, profileError);
      // Provide specific error back
      return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 });
    }

    if (!profileData) {
        console.error(`[Profile API] Profile insertion for user ${userId} did not return data.`);
        return NextResponse.json({ error: 'Profile creation failed (no data returned).' }, { status: 500 });
    }

    console.log(`[Profile API] Profile created successfully for user: ${userId}, Profile ID: ${profileData.id}`);
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profileId: profileData.id
    });

  } catch (error: any) {
    console.error('[Profile API] Unexpected error:', error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body format for profile API.' }, { status: 400 });
    }
    return NextResponse.json({ error: `Server error in profile API: ${error.message}` }, { status: 500 });
  }
}