"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/validations/auth"

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // This is a placeholder for actual password reset logic
      // In a real application, you would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-md bg-primary/10 p-4">
        <p className="text-center text-sm text-primary">
          If your email exists in our system, you will receive a password reset link shortly.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        {error && (
          <div className="text-sm font-medium text-destructive">{error}</div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending link..." : "Send reset link"}
        </Button>
      </form>
    </Form>
  )
}