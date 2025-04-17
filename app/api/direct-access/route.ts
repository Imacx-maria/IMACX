import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check RLS status
    const { data: rlsStatus, error: rlsError } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: `
        SELECT tablename, relrowsecurity as rls_enabled
        FROM pg_tables
        JOIN pg_class ON pg_tables.tablename = pg_class.relname
        WHERE tablename IN ('folhas_obras', 'items')
          AND schemaname = 'public'
      `
    });

    // Check table column info to ensure schema is correct
    const { data: folhasObrasInfo, error: folhasObrasInfoError } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'folhas_obras'
          AND table_schema = 'public'
      `
    });

    const { data: itemsInfo, error: itemsInfoError } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'items'
          AND table_schema = 'public'
      `
    });

    // Direct access with admin privileges
    const { data: folhasObrasData, error: folhasObrasError } = await supabaseAdmin
      .from('folhas_obras')
      .select('*')
      .limit(2);

    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('items')
      .select('*')
      .limit(2);

    // Try running a plain insert with admin privileges to test write access
    const testId = Date.now();
    const { data: insertResult, error: insertError } = await supabaseAdmin
      .from('folhas_obras')
      .insert({
        numero_fo: testId,
        nome_campanha: 'Test Campaign (Admin Access)',
        notas: 'Testing direct admin access'
      })
      .select();

    // If insert was successful, clean up
    let deleteResult = null;
    let deleteError = null;
    if (insertResult && insertResult.length > 0) {
      const { data: delResult, error: delError } = await supabaseAdmin
        .from('folhas_obras')
        .delete()
        .eq('id', insertResult[0].id);
      
      deleteResult = delResult;
      deleteError = delError;
    }

    // Check database role and permissions
    const { data: roleInfo, error: roleError } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: `
        SELECT current_user, current_database(), 
               has_table_privilege('authenticated', 'folhas_obras', 'SELECT') as can_select,
               has_table_privilege('authenticated', 'folhas_obras', 'INSERT') as can_insert
      `
    });

    // Build response
    return NextResponse.json({
      success: true,
      rlsStatus: {
        data: rlsStatus,
        error: rlsError ? rlsError.message : null
      },
      tableInfo: {
        folhasObras: {
          data: folhasObrasInfo,
          error: folhasObrasInfoError ? folhasObrasInfoError.message : null
        },
        items: {
          data: itemsInfo,
          error: itemsInfoError ? itemsInfoError.message : null
        }
      },
      tableAccess: {
        folhasObras: {
          success: !folhasObrasError,
          count: folhasObrasData ? folhasObrasData.length : 0,
          error: folhasObrasError ? folhasObrasError.message : null,
          sample: folhasObrasData ? folhasObrasData.slice(0, 1) : null
        },
        items: {
          success: !itemsError,
          count: itemsData ? itemsData.length : 0,
          error: itemsError ? itemsError.message : null,
          sample: itemsData ? itemsData.slice(0, 1) : null
        }
      },
      writeTest: {
        insert: {
          success: !insertError,
          data: insertResult,
          error: insertError ? insertError.message : null
        },
        delete: {
          success: !deleteError,
          data: deleteResult,
          error: deleteError ? deleteError.message : null
        }
      },
      roleInfo: {
        data: roleInfo,
        error: roleError ? roleError.message : null
      }
    });
  } catch (error: any) {
    console.error('Error in direct access test:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 