"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth/auth-context"
import { LoginFormValues, loginSchema } from "@/lib/validations/auth"
import { Database } from "@/types/supabase"

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [authResult, setAuthResult] = useState<any>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const supabase = createClientComponentClient<Database>()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "maria.martins@imacx.pt",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)
    setAuthResult(null)
    
    try {
      console.log("[LOGIN] Step 1: Attempting login with:", data.email)
      
      // Use both methods to ensure session is properly created
      const success = await login(data.email, data.password)
      
      // Also try the direct Supabase auth to ensure session is created
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      
      console.log("[LOGIN] Step 2: Login result:", success, "Supabase auth result:", !!authData.session)
      
      if (success && authData.session) {
        console.log("[LOGIN] Step 3: Login successful, session established")
        setAuthResult({ success, message: "Login successful! Redirecting..." })
        
        // Get the session to verify it exists
        const { data: { session } } = await supabase.auth.getSession()
        console.log("[LOGIN] Step 4: Session check:", !!session)
        
        // Add a slight delay before redirecting to allow the session to be set
        setTimeout(async () => {
          setIsRedirecting(true)
          // Force a reload to ensure the session is picked up by the middleware
          console.log("[LOGIN] Step 5: REDIRECTING to dashboard with reload")
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        console.error("[LOGIN] Login failed:", authError)
        setError("Invalid email or password")
      }
    } catch (error) {
      console.error("[LOGIN] Login error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="text-sm font-medium text-destructive">{error}</div>
        )}
        {authResult?.success && (
          <div className="text-sm font-medium text-green-600">
            {authResult.message}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
          {isLoading ? "Logging in..." : isRedirecting ? "Redirecting..." : "Login"}
        </Button>
      </form>
    </Form>
  )
}