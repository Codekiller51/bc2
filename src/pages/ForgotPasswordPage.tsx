"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
  
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
  
      if (error) {
        throw error
      }

      setSuccess(true)
      toast.success('Password reset email sent successfully!')
      
    } catch (error: any) {
      if (error.message.includes('User not found')) {
        setError('No account found with this email address.')
      } else if (error.message.includes('Email rate limit exceeded')) {
        setError('Too many requests. Please wait before trying again.')
      } else {
        setError(error.message || "Failed to send reset email")
      }
      toast.error(error.message || "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 mobile-padding">
        <Card className="card-brand mx-auto max-w-md w-full">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-h2">Check Your Email</CardTitle>
            <CardDescription>
              We've sent password reset instructions to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setSuccess(false)
                setEmail("")
              }}
              variant="outline"
              className="w-full"
            >
              Try Different Email
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 mobile-padding">
      <Card className="card-brand mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-h2">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a reset link
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="form-label">Email Address</Label>
              <Input
                id="email" 
                type="email" 
                placeholder="Enter your email address"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
            <p className="mt-4 text-center text-body-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}