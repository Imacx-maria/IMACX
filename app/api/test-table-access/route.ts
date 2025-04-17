import { NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createApiClient();

  try {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Test folhas_obras access
    const { data: folhasObras, error: folhasObrasError } = await supabase
      .from('folhas_obras')
      .select('*')
      .limit(1);

    // Test items access
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .limit(1);

    // Return results
    return NextResponse.json({
      authenticated: true,
      user: session.user,
      folhasObras: {
        success: !folhasObrasError,
        data: folhasObras,
        error: folhasObrasError ? folhasObrasError.message : null
      },
      items: {
        success: !itemsError,
        data: items,
        error: itemsError ? itemsError.message : null
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 