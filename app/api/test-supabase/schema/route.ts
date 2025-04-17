import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Test accessing the tables we expect to exist
    const tableTests = [];
    const tablesToTest = ['folhas_obras', 'items', 'profiles', 'roles'];

    for (const tableName of tablesToTest) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        tableTests.push({
          table: tableName,
          exists: !error || !error.message.includes('does not exist'),
          accessible: !error || !error.message.includes('permission denied'),
          error: error
        });
      } catch (e) {
        tableTests.push({
          table: tableName,
          exists: false,
          accessible: false,
          error: e instanceof Error ? e.message : String(e)
        });
      }
    }

    // For folhas_obras, check specific columns
    let folhasObrasColumns = null;
    let folhasObrasColumnsError = null;
    
    try {
      // You can't query information_schema directly with limited permissions,
      // so try a SELECT with column names to test their existence
      const { error: columnCheckError } = await supabase
        .from('folhas_obras')
        .select('id, numero_fo, profile_id, nome_campanha, prioridade, data_in, data_saida, created_at, updated_at, notas')
        .limit(0);
        
      folhasObrasColumns = {
        id: true,
        numero_fo: true,
        profile_id: true,
        nome_campanha: true,
        prioridade: true,
        data_in: true,
        data_saida: true,
        created_at: true,
        updated_at: true,
        notas: true
      };
      folhasObrasColumnsError = columnCheckError;
    } catch (e) {
      folhasObrasColumnsError = e instanceof Error ? e.message : String(e);
    }

    return NextResponse.json({
      tableTests,
      folhasObrasColumns: {
        success: !folhasObrasColumnsError,
        data: folhasObrasColumns,
        error: folhasObrasColumnsError
      },
      environmentCheck: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    console.error('Test Supabase schema error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to inspect database schema',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 