import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Get profiles table structure
    const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*').limit(1);
    
    // Get roles table structure
    const { data: rolesData, error: rolesError } = await supabase.from('roles').select('*').limit(1);
    
    return NextResponse.json({
      profiles: {
        data: profilesData,
        error: profilesError,
        columns: profilesData && profilesData.length > 0 ? Object.keys(profilesData[0] || {}) : []
      },
      roles: {
        data: rolesData,
        error: rolesError,
        columns: rolesData && rolesData.length > 0 ? Object.keys(rolesData[0] || {}) : []
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 