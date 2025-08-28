"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      // Get the code from URL parameters
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        throw new Error(errorDescription || error)
      }

      if (!code) {
        throw new Error('No authorization code found')
      }

      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        throw exchangeError
      }

      if (data.user) {
        setStatus('success')
        setMessage('Authentication successful! Redirecting...')
        
        // Determine redirect path based on user type
        const userType = data.user.user_metadata?.user_type || 'client'
        const redirectPath = userType === 'admin' ? '/admin' : 
                           userType === 'creative' ? '/dashboard/creative' : 
                           '/dashboard'
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate(redirectPath, { replace: true })
        }, 2000)
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error: any) {
      console.error('Auth callback error:', error)
      setStatus('error')
      setMessage(error.message || 'Authentication failed')
    }
  }

  const handleRetry = () => {
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12">
      <Card className="card-brand mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
                <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-h2">
            {status === 'loading' && 'Processing Authentication'}
            {status === 'success' && 'Authentication Successful'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {status === 'loading' && 'Please wait while we complete your authentication...'}
            {status === 'success' && message}
            {status === 'error' && message}
          </p>
          
          {status === 'loading' && (
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        {status === 'error' && (
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="btn-primary w-full">
              Try Again
            </Button>
            <Link to="/contact" className="w-full">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}