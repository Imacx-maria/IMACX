"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SimpleAuthService, SimpleUser } from "./simple-auth"

interface SimpleAuthContextType {
  user: SimpleUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAdmin: () => boolean
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined)

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        const currentUser = await SimpleAuthService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const user = await SimpleAuthService.login({ email, password })
      
      if (user) {
        setUser(user)
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

  const logout = async () => {
    try {
      setIsLoading(true)
      await SimpleAuthService.logout()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isAdmin = () => {
    if (!user) return false
    return user.isAdmin === true
  }

  return (
    <SimpleAuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </SimpleAuthContext.Provider>
  )
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext)
  
  if (context === undefined) {
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider")
  }
  
  return context
} 