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

    // Test auth status
    const { data: { session } } = await supabase.auth.getSession();
    
    // Try to query the tables
    const { data: folhasData, error: folhasError } = await supabase
      .from('folhas_obras')
      .select('*')
      .limit(5);
      
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .limit(5);

    return NextResponse.json({
      authenticated: !!session,
      folhasData,
      folhasError,
      itemsData,
      itemsError
    });
  } catch (error) {
    console.error('Test DB route error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }
} 