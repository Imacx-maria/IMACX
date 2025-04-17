import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    // Mask keys for security (show just first/last few chars)
    const maskKey = (key: string) => {
      if (key.length < 8) return "too_short";
      return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
    };

    // Create admin client
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // List all tables in public schema directly
    const { data: tablesData, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    // Try to get FO records with direct SQL
    const options = { head: true, count: 'exact' as const };
    
    // Just try to count records in the tables for a lighter operation
    const { count: foCount, error: foError } = await supabaseAdmin
      .from('folhas_obras')
      .select('*', options);
      
    const { count: itemsCount, error: itemsError } = await supabaseAdmin
      .from('items')
      .select('*', options);

    // Try another approach - check what tables this role can see
    const { data: userRole, error: roleError } = await supabaseAdmin.auth.getUser();
    
    // Get the tables that are actually working in the application
    const { data: workingApiCheck, error: workingApiError } = await fetch('/api/designer-flow/list-work-orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).catch(err => ({ error: err.message }));

    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl,
        supabaseServiceKeyMasked: maskKey(supabaseServiceKey),
        hasValidServiceKey: supabaseServiceKey.length > 30
      },
      tables: {
        listSuccess: !tablesError,
        data: tablesData,
        error: tablesError ? tablesError.message : null
      },
      folhasObras: {
        success: !foError,
        count: foCount,
        error: foError ? foError.message : null
      },
      items: {
        success: !itemsError,
        count: itemsCount,
        error: itemsError ? itemsError.message : null
      },
      authCheck: {
        success: !roleError,
        data: userRole,
        error: roleError ? roleError.message : null
      },
      workingApiCheck: {
        success: !workingApiError,
        data: workingApiCheck,
        error: workingApiError || null
      },
    });
  } catch (error: any) {
    console.error('Error checking environment:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 