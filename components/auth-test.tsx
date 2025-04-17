"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthResult {
  data?: any;
  error?: any;
  profile?: any;
}

export function AuthTest() {
  const [email, setEmail] = useState('maria.martins@imacx.pt')
  const [password, setPassword] = useState('')
  const [authResult, setAuthResult] = useState<AuthResult | null>(null)
  
  async function testAuth() {
    try {
      console.log("Testing authentication with:", email, password)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      console.log("Auth test result:", data, error)
      setAuthResult({ data, error })
      
      if (data.session) {
        // Try getting profile info
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user?.id)
          .single()
          
        console.log("Profile data:", profileData, profileError)
        
        if (profileData) {
          setAuthResult(prev => ({ 
            ...prev as AuthResult, 
            profile: profileData 
          }))
        }
      }
    } catch (e) {
      console.error("Auth test error:", e)
      setAuthResult({ error: e })
    }
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
        <CardDescription>Test your authentication setup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
          />
        </div>
        <Button onClick={testAuth} className="w-full">Test Authentication</Button>
        
        {authResult && (
          <div className="mt-4 p-4 bg-slate-100 rounded-md overflow-auto">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(authResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 