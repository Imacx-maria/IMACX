import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Test direct connection using the supabase client
    const { data: folhasCount, error: folhasCountError } = await supabase
      .from('folhas_obras')
      .select('count()', { count: 'exact', head: true });
    
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

    // Try to query folhas_obras with a join to items
    const { data: joinData, error: joinError } = await supabase
      .from('folhas_obras')
      .select(`
        id,
        numero_fo,
        profile_id,
        data_in,
        data_saida,
        notas,
        items (
          id,
          descricao,
          paginacao
        )
      `)
      .limit(3);

    // Return a detailed response with all test results
    return NextResponse.json({
      folhasCount: {
        success: !folhasCountError,
        data: folhasCount,
        error: folhasCountError
      },
      folhasTable: {
        success: !folhasError,
        count: folhasData?.length || 0,
        data: folhasData,
        error: folhasError
      },
      itemsTable: {
        success: !itemsError,
        count: itemsData?.length || 0,
        data: itemsData,
        error: itemsError
      },
      join: {
        success: !joinError,
        data: joinData,
        error: joinError
      },
      environmentCheck: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    console.error('Test Supabase connection error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to database',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 