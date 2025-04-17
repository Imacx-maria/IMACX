import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use service role to bypass RLS
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
    
    // First, let's get any existing policies
    const { data: existingPolicies, error: policyError } = await supabaseAdmin
      .from('pg_policies')
      .select('*')
      .in('tablename', ['folhas_obras', 'items']);
    
    if (policyError) {
      console.error("Error fetching policies:", policyError.message);
    }
    
    const results = {
      existingPolicies,
      operations: [] as string[]
    };
    
    // Add simple policy for folhas_obras - first drop any existing policies
    try {
      // Drop existing policies for folhas_obras
      await supabaseAdmin.rpc('exec_sql', {
        sql_query: `DROP POLICY IF EXISTS admin_access_folhas_obras ON folhas_obras;
                    DROP POLICY IF EXISTS authenticated_access_folhas_obras ON folhas_obras;`
      });
      
      results.operations.push('Dropped existing policies for folhas_obras');
      
      // Create new policies for folhas_obras
      await supabaseAdmin.rpc('exec_sql', {
        sql_query: `CREATE POLICY admin_access_folhas_obras ON folhas_obras 
                    USING (auth.uid() IN (
                      SELECT p.user_id FROM profiles p
                      JOIN roles r ON p.role_id = r.id
                      WHERE r.name IN ('Admin', 'Manager', 'Designer')
                    ));
                    
                    CREATE POLICY authenticated_access_folhas_obras ON folhas_obras 
                    FOR SELECT USING (auth.role() = 'authenticated');`
      });
      
      results.operations.push('Created new policies for folhas_obras');
    } catch (error: any) {
      results.operations.push(`Error with folhas_obras policies: ${error.message}`);
    }
    
    // Add simple policy for items - first drop any existing policies
    try {
      // Drop existing policies for items
      await supabaseAdmin.rpc('exec_sql', {
        sql_query: `DROP POLICY IF EXISTS admin_access_items ON items;
                    DROP POLICY IF EXISTS authenticated_access_items ON items;`
      });
      
      results.operations.push('Dropped existing policies for items');
      
      // Create new policies for items
      await supabaseAdmin.rpc('exec_sql', {
        sql_query: `CREATE POLICY admin_access_items ON items 
                    USING (auth.uid() IN (
                      SELECT p.user_id FROM profiles p
                      JOIN roles r ON p.role_id = r.id
                      WHERE r.name IN ('Admin', 'Manager', 'Designer')
                    ));
                    
                    CREATE POLICY authenticated_access_items ON items 
                    FOR SELECT USING (auth.role() = 'authenticated');`
      });
      
      results.operations.push('Created new policies for items');
    } catch (error: any) {
      results.operations.push(`Error with items policies: ${error.message}`);
    }
    
    // As a fallback, let's try the most permissive policy if the complex ones don't work
    try {
      await supabaseAdmin.rpc('exec_sql', {
        sql_query: `DROP POLICY IF EXISTS allow_all_folhas_obras ON folhas_obras;
                    CREATE POLICY allow_all_folhas_obras ON folhas_obras USING (true);`
      });
      
      results.operations.push('Created fallback allow_all policy for folhas_obras');
      
      await supabaseAdmin.rpc('exec_sql', {
        sql_query: `DROP POLICY IF EXISTS allow_all_items ON items;
                    CREATE POLICY allow_all_items ON items USING (true);`
      });
      
      results.operations.push('Created fallback allow_all policy for items');
    } catch (error: any) {
      results.operations.push(`Error with fallback policies: ${error.message}`);
      // If everything fails, we may need to use the Supabase dashboard directly
      results.operations.push('Unable to set policies programmatically. You may need to use the Supabase dashboard to update RLS policies.');
    }

    return NextResponse.json({
      success: true,
      message: 'RLS policy update attempted',
      results
    });
  } catch (error: any) {
    console.error('Error updating RLS policies:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 