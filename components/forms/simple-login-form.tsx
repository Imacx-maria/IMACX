"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSimpleAuth } from "@/lib/auth/simple-auth-context"

export function SimpleLoginForm() {
  const { login } = useSimpleAuth()
  const router = useRouter()
  const [email, setEmail] = useState("maria.martins@imacx.pt")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting login with:", email, password)
      const success = await login(email, password)
      
      setResult({ success })
      
      if (success) {
        router.push("/")
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
        />
      </div>
      
      {error && (
        <div className="bg-red-50 p-3 text-red-600 rounded">{error}</div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      
      {result && (
        <div className="mt-4 p-4 bg-slate-100 rounded-md">
          <h3 className="font-medium mb-2">Result:</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </form>
  )
} 