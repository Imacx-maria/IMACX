import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Create a response object
  const res = NextResponse.next();
  
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({
      req: request,
      res
    });
    
    // Get the session
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session;
    
    console.log('[SERVER] MIDDLEWARE: Processing', request.nextUrl.pathname);
    console.log('[SERVER] MIDDLEWARE: User authenticated:', isAuthenticated ? 'Yes' : 'No');
  
    // For now, just let all requests pass through while we debug
    return res;
  } catch (error) {
    console.error('[SERVER] MIDDLEWARE ERROR:', error);
    // Continue even if there's an error in middleware
    return res;
  }
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};