import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

// Define protected routes and their required roles
const protectedRoutes = [
  {
    path: '/dashboard',
    roles: ['Admin', 'User', 'Editor', 'Designer'], // All roles can access dashboard
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

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname
  
  // 1. Redirect root path to dashboard
  if (path === '/') {
    console.log('[MIDDLEWARE] Root path -> redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  // 2. Skip middleware for public paths and assets
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath))
  const isStaticAsset = 
    path.includes('.') || // Has file extension
    path.includes('/_next/') || 
    path.startsWith('/api/') ||
    path.includes('/public/')
  
  if (isPublicPath || isStaticAsset) {
    console.log('[MIDDLEWARE] Skipping:', path)
    return res
  }
  
  try {
    // 3. Get session for authenticated paths
    console.log('[MIDDLEWARE] Processing:', path)
    const supabase = createMiddlewareClient<Database>({ req, res })
    
    // Debug - Log cookies for troubleshooting
    const cookies = req.cookies.getAll()
    console.log('[MIDDLEWARE] Available cookies:', cookies.map(c => c.name).join(', '))
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    // Log detailed session info
    console.log('[MIDDLEWARE] Session check result:', session ? 'Found session' : 'No session')
    if (sessionError) {
      console.error('[MIDDLEWARE] Session error:', sessionError.message)
    }
    
    // 4. Handle unauthenticated users
    if (!session) {
      console.log('[MIDDLEWARE] No session, redirecting to login')
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // 5. Handle authenticated users - check role-based access
    console.log('[MIDDLEWARE] Authenticated user:', session.user.email)
    
    try {
      // OPTIMIZED: Fetch profile and role name in a single query
      const { data: profileWithRole, error: profileError } = await supabase
        .from('profiles')
        // Select the user_id from profiles and the name from the related roles table
        // Assumes a foreign key relationship named 'roles' exists on the 'profiles' table
        // pointing to the 'roles' table. Adjust 'roles(name)' if the relationship
        // or target column name is different.
        .select(`
          user_id, 
          roles ( name ) 
        `) 
        .eq('user_id', session.user.id)
        .single()
      
      if (profileError) {
        console.error('[MIDDLEWARE] Profile/Role fetch error:', profileError.message)
        // It might be better to show a generic error page or retry, 
        // but redirecting to login instead of unauthorized as requested.
        return NextResponse.redirect(new URL('/login', req.url))
      }
        
      // Ensure roles is not null/undefined and has a name property
      const userRole = profileWithRole?.roles?.name || 'Unknown' 
      
      if (userRole === 'Unknown') {
         console.log('[MIDDLEWARE] Could not determine user role for user:', session.user.id)
         return NextResponse.redirect(new URL('/login', req.url))
      }

      console.log('[MIDDLEWARE] User role:', userRole)
      
      // Check if user has access to the requested route
      const requestedRoute = protectedRoutes.find(route => path.startsWith(route.path))
      
      if (requestedRoute && !requestedRoute.roles.includes(userRole)) {
        console.log('[MIDDLEWARE] Unauthorized access attempt')
        return NextResponse.redirect(new URL('/login', req.url))
      }
      
      // Special handling for Designer role
      if (userRole === 'Designer') {
        const designerAllowedRoutes = ['/dashboard', '/designer-flow']
        if (!designerAllowedRoutes.some(route => path.startsWith(route))) {
          console.log('[MIDDLEWARE] Designer tried to access unauthorized route')
          return NextResponse.redirect(new URL('/login', req.url))
        }
      }
      
      console.log('[MIDDLEWARE] Access granted for path:', path)
      return res
    } catch (error) {
      console.error('[MIDDLEWARE] Error in role check:', error)
      return NextResponse.redirect(new URL('/login', req.url))
    }
  } catch (error) {
    console.error('[MIDDLEWARE] Critical error:', error)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

// Explicitly define matcher patterns to exclude files and public paths
export const config = {
  matcher: [
    /*
     * Match:
     * - all paths except _next, api, public paths, and static files
     */
    '/((?!_next/|api/|_vercel|favicon.ico|.*\\..*).*)',
  ],
}