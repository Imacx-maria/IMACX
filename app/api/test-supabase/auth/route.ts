import { NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase/server';

// This endpoint should be accessed when logged in
export async function GET() {
  try {
    const supabase = createApiClient();

    // Check authentication status
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    // If not authenticated, return error
    if (!session) {
      return NextResponse.json({
        error: 'Authentication required',
        authError,
        isAuthenticated: false
      }, { status: 401 });
    }

    // Try to query the folhas_obras table
    const { data: folhasData, error: folhasError } = await supabase
      .from('folhas_obras')
      .select('*')
      .limit(5);
      
    // Try to query the items table
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .limit(5);

    return NextResponse.json({
      isAuthenticated: true,
      user: session.user,
      folhasTable: {
        success: !folhasError,
        count: folhasData?.length || 0,
        error: folhasError
      },
      itemsTable: {
        success: !itemsError,
        count: itemsData?.length || 0,
        error: itemsError
      }
    });
  } catch (error) {
    console.error('Authenticated test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to access database with authentication',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 