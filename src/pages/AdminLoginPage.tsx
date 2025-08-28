"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, Shield, Crown } from "lucide-react"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
  
      if (error) {
        throw error
      }

      // Check if user is admin
      const userRole = data.user?.user_metadata?.role
      if (userRole !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Access denied. Admin credentials required.')
      }

      const userName = data.user?.user_metadata?.full_name || 'Admin'
      toast.success(`Welcome to Admin Dashboard, ${userName}!`)
      
      // Navigate to admin dashboard
      navigate('/admin')
      
    } catch (error: any) {
      setError(null)
      
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid admin credentials. Please check your email and password.')
        toast.error('Invalid admin credentials')
      } else if (error.message.includes('Access denied')) {
        setError('Access denied. Admin credentials required.')
        toast.error('Access denied. Admin credentials required.')
      } else {
        setError(error.message || "Failed to login")
        toast.error(error.message || "Failed to login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 mobile-padding">
      <Card className="card-brand mx-auto max-w-md w-full border-purple-200 dark:border-purple-800">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-h2">Admin Login</CardTitle>
          <CardDescription>
            Administrator access to Brand Connect platform
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

            {/* Admin Setup Instructions */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>First time admin?</strong> Please refer to the{' '}
                <Link to="/docs/admin-setup" className="text-brand-600 hover:underline">
                  Admin Setup Guide
                </Link>{' '}
                for instructions on creating your admin account.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="email" className="form-label">Admin Email</Label>
              <Input
                id="email" 
                type="email" 
                placeholder="admin@brandconnect.co.tz"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="form-label">Password</Label>
              <div className="relative">
                <Input
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter admin password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In as Admin"}
            </Button>
            <p className="mt-4 text-center text-body-sm text-muted-foreground">
              Need help?{" "}
              <Link
                to="/contact"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
              >
                Contact Support
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}