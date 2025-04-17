'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

type RoleGuardProps = {
  children: ReactNode
  allowedRoles?: string[]
  fallback?: ReactNode
}

export default function RoleGuard({ 
  children,
  allowedRoles = [], // Roles that can access this component
  fallback = null // Optional fallback component instead of redirect
}: RoleGuardProps) {
  const { user, isLoading, hasAnyRole } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // Only perform check/redirect if auth state is resolved
    if (!isLoading) { 
      if (!user || (allowedRoles.length > 0 && !hasAnyRole(allowedRoles))) {
        console.log(`[RoleGuard] Redirecting: userExists=${!!user}, hasRequiredRole=${allowedRoles.length > 0 && !!user ? hasAnyRole(allowedRoles) : 'N/A'}`);
        // Redirect to login page instead of unauthorized
        router.push('/login'); 
        // No return needed here, the redirect handles navigation
      }
    }
    // Ensure router is stable or memoized if included in deps
  }, [isLoading, user, hasAnyRole, allowedRoles, router]); 
  
  // Render loading state or children
  if (isLoading || !user || (allowedRoles.length > 0 && !hasAnyRole(allowedRoles))) {
      // While loading or if unauthorized before redirect effect runs,
      // show the loading component or null
      return fallback || <p>Loading...</p>; // Or a proper spinner
  }
  
  return <>{children}</>
} 