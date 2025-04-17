import { NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createApiClient();

    // Get session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in to use this endpoint.' }, { status: 401 });
    }

    // Test folhas_obras access
    const { data: folhasData, error: folhasError } = await supabase
      .from('folhas_obras')
      .select('id, numero_fo, nome_campanha')
      .limit(1);

    // Test items access
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('id, descricao, codigo')
      .limit(1);

    // Attempt to query existing permissions if possible
    let permissionQuery = null;
    try {
      // This might fail, so we'll catch the error
      // Using any cast to bypass type checking for the RPC function
      const { data } = await (supabase as any).rpc('get_my_permissions');
      permissionQuery = data;
    } catch (e) {
      permissionQuery = { error: "Can't query permissions function" };
    }

    // Test simple insert to folhas_obras
    let insertResult = null;
    let insertError = null;
    
    if (folhasError) {
      // Only attempt insert if we have an error, to check write permissions
      try {
        const testNumber = Math.floor(Math.random() * 9000) + 1000;
        const { data, error } = await supabase
          .from('folhas_obras')
          .insert({
            numero_fo: testNumber,
            nome_campanha: 'Test Campaign ' + Date.now(),
            notas: 'Testing access - this entry can be deleted'
          })
          .select()
          .single();
          
        insertResult = data;
        insertError = error;
        
        // If successful, clean up by deleting this test record
        if (data && !error) {
          await supabase.from('folhas_obras').delete().eq('id', data.id);
        }
      } catch (e: any) {
        insertError = e.message;
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      },
      folhasObras: {
        success: !folhasError,
        data: folhasData,
        error: folhasError ? folhasError.message : null
      },
      items: {
        success: !itemsError,
        data: itemsData,
        error: itemsError ? itemsError.message : null
      },
      insertTest: {
        success: !insertError,
        data: insertResult,
        error: insertError ? insertError.message : null
      },
      permissionQuery
    });
  } catch (error: any) {
    console.error('Table access check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check table access' },
      { status: 500 }
    );
  }
} 