import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/client'; // Correct the import path based on where getServiceRoleClient is defined

export async function POST(request: Request) {
  // Ensure we have an admin client
  const supabaseAdmin = getServiceRoleClient();
  if (!supabaseAdmin) {
    console.error('Delete User API: Service role client not available.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    // Get the user ID to delete from the request body
    const { authUserId } = await request.json();

    if (!authUserId || typeof authUserId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid authUserId' }, { status: 400 });
    }

    console.log(`Attempting to delete user with auth ID: ${authUserId}`);

    // First delete the profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', authUserId);

    if (profileError) {
      console.error(`Error deleting profile for user ${authUserId}:`, profileError);
      return NextResponse.json({ error: 'Failed to delete user profile', details: profileError.message }, { status: 400 });
    }

    // Then delete the auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);

    if (authError) {
      console.error(`Error deleting auth user ${authUserId}:`, authError);
      return NextResponse.json({ error: 'Failed to delete auth user', details: authError.message }, { status: 400 });
    }

    console.log(`Successfully deleted user and profile for auth ID: ${authUserId}`);
    return NextResponse.json({ message: 'User and profile deleted successfully' });

  } catch (error: any) {
    console.error('API Route Error [Delete User]:', error);
    // Handle JSON parsing errors or other unexpected errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 