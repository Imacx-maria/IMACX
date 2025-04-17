import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/forms/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-4 text-center text-sm">
            <div className="flex items-center justify-between">
              <Link href="/reset-password" className="text-sm text-primary underline-offset-4 hover:underline">
                Forgot password?
              </Link>
              <Link href="/register" className="text-sm text-primary underline-offset-4 hover:underline">
                Register
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}