"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService, User } from "./auth-service"
import { supabase } from "@/lib/supabase/client"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<boolean>
  logout: () => Promise<void>
  hasRole: (roleName: string) => boolean
  hasAnyRole: (roleNames: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount, but only once
    const checkAuth = async () => {
      try {
        console.log("[AuthContext] Initial auth check starting...");
        const startTime = performance.now();
        const currentUser = await AuthService.getCurrentUser()
        const endTime = performance.now();
        console.log(`[AuthContext] Initial auth check completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        setUser(currentUser)
        setAuthChecked(true)
      } catch (error) {
        console.error("[AuthContext] Error checking authentication:", error)
        setAuthChecked(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authChecked) {
      checkAuth()
    }
    
    // Set up Supabase auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[AuthContext] Auth state changed: ${event}`);
        
        if (event === 'SIGNED_IN' && session) {
          console.log("[AuthContext] User signed in, updating user data");
          setIsLoading(true)
          try {
            const startTime = performance.now();
            const user = await AuthService.getCurrentUser()
            const endTime = performance.now();
            console.log(`[AuthContext] Auth state user fetch completed in ${(endTime - startTime).toFixed(2)}ms`);
            
            setUser(user)
          } catch (error) {
            console.error("[AuthContext] Error fetching user data after sign in:", error)
          } finally {
            setIsLoading(false)
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("[AuthContext] User signed out, clearing user data");
          setUser(null)
        }
      }
    )
    
    return () => {
      // Clean up subscription when component unmounts
      subscription.unsubscribe()
    }
  }, [authChecked])

  const login = async (email: string, password: string) => {
    try {
      console.log("AUTH CONTEXT: Starting login process");
      setIsLoading(true)
      const user = await AuthService.login({ email, password })
      
      if (user) {
        console.log("AUTH CONTEXT: User returned from service, setting in context");
        setUser(user)
        
        // Make sure the user is set in the context before continuing
        console.log("AUTH CONTEXT: Login successful, user data:", user);
        
        // Verify the session is established
        const { data: { session } } = await supabase.auth.getSession()
        console.log("AUTH CONTEXT: Session established:", !!session);
        
        return true
      }
      
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    try {
      setIsLoading(true)
      const user = await AuthService.register(data)
      
      if (user) {
        setUser(user)
        return true
      }
      
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    // Re-enabled original logic with logging
    console.log("[AuthContext] logout function initiated.");
    try {
      console.log("[AuthContext] Setting isLoading to true.");
      setIsLoading(true)
      console.log("[AuthContext] Calling AuthService.logout()...");
      await AuthService.logout()
      console.log("[AuthContext] AuthService.logout() completed.");
      console.log("[AuthContext] Setting user state to null...");
      setUser(null)
      console.log("[AuthContext] User state set to null.");
      console.log("[AuthContext] Pushing to /login route...");
      router.push("/login")
      console.log("[AuthContext] Navigation to /login initiated.");
    } catch (error) {
      console.error("[AuthContext] Error during logout:", error)
    } finally {
      console.log("[AuthContext] Setting isLoading to false.");
      setIsLoading(false)
    }
  }
  
  const hasRole = (roleName: string) => {
    if (!user || !user.profile) return false
    return user.profile.role.name.toLowerCase() === roleName.toLowerCase()
  }

  const hasAnyRole = (roleNames: string[]) => {
    if (!user || !user.profile) return false
    return roleNames.some(role => 
      user.profile?.role.name.toLowerCase() === role.toLowerCase()
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
}