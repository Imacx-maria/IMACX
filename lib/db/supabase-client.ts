"use client"

import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anon Key is missing. Please check your environment variables."
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to get the current user from Supabase
export async function getSupabaseUser() {
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error("Error getting user:", error.message)
    return null
  }
  
  return data.user
}

// Helper function to get user profile with role information
export async function getUserProfileWithRole(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      id,
      user_id,
      first_name,
      last_name,
      avatar_url,
      role_id,
      roles:role_id (
        id,
        name,
        description
      )
    `)
    .eq('user_id', userId)
    .single()
  
  if (profileError) {
    console.error("Error getting user profile:", profileError.message)
    return null
  }
  
  return profile
}

// Helper function to sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error("Error signing in:", error.message)
    return { user: null, error: error.message }
  }
  
  return { user: data.user, error: null }
}

// Helper function to sign up with email and password
export async function signUpWithEmail(email: string, password: string, metadata: any = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  
  if (error) {
    console.error("Error signing up:", error.message)
    return { user: null, error: error.message }
  }
  
  return { user: data.user, error: null }
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error("Error signing out:", error.message)
    return { error: error.message }
  }
  
  return { error: null }
}

// Helper function to reset password
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) {
    console.error("Error resetting password:", error.message)
    return { error: error.message }
  }
  
  return { error: null }
}

// Helper function to get all roles
export async function getAllRoles() {
  const { data: roles, error } = await supabase
    .from('roles')
    .select('*')
    .order('id', { ascending: true })
  
  if (error) {
    console.error("Error getting roles:", error.message)
    return []
  }
  
  return roles
}

// Helper function to check if user has a specific role
export async function hasRole(userId: string, roleName: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      roles:role_id (
        name
      )
    `)
    .eq('user_id', userId)
    .single()
  
  if (error || !data) {
    console.error("Error checking role:", error?.message)
    return false
  }
  
  return data.roles?.name === roleName
}

// Helper function to check if user has one of the specified roles
export async function hasAnyRole(userId: string, roleNames: string[]) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      roles:role_id (
        name
      )
    `)
    .eq('user_id', userId)
    .single()
  
  if (error || !data) {
    console.error("Error checking roles:", error?.message)
    return false
  }
  
  return roleNames.includes(data.roles?.name)
}