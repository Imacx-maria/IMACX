import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: async () => cookieStore 
    });

    // Get session
    const { data: { session } } = await supabase.auth.getSession();

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
      sessionExpiry: session?.expires_at || null
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { error: 'Failed to check authentication' },
      { status: 500 }
    );
  }
} 