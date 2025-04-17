import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Define protected routes and their required roles
// Updated to match the actual roles in the database: 'Admin', 'User', 'Editor'
const protectedRoutes = [
  {
    path: '/',
    roles: ['Admin', 'User', 'Editor'], // All roles can access dashboard
  },
  {
    path: '/analytics',
    roles: ['Admin', 'Editor'], // Admin and Editor can access analytics
  },
  {
    path: '/stock-management',
    roles: ['Admin', 'Editor'], // Admin and Editor can access stock management
  },
  {
    path: '/quoting-system',
    roles: ['Admin', 'Editor'], // Admin and Editor can access quoting system
  },
  {
    path: '/production-management',
    roles: ['Admin'], // Only Admin can access production management
  },
  {
    path: '/employees',
    roles: ['Admin', 'Editor'], // Admin and Editor can access employees
  },
  {
    path: '/price-structure',
    roles: ['Admin', 'User', 'Editor'], // All roles can access price structure
  },
  {
    path: '/users',
    roles: ['Admin'], // Only Admin can access user management
  },
  {
    path: '/settings',
    roles: ['Admin', 'User', 'Editor'], // All roles can access settings
  },
  {
    path: '/designer-flow',
    roles: ['Admin', 'Designer'], // Admin and Designer can access designer flow
  },
]

// Skip role check for these testing routes
const testRoutes = [
  '/auth-test',
  '/simple-auth-test',
  '/db-structure',
]

// Paths that should be accessible to unauthenticated users
const publicPaths = [
  '/login',
  '/register',
  '/reset-password',
  '/components', // Components is a public path
]

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