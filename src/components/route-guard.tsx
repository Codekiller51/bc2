"use client"

import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/components/enhanced-auth-provider'
import { InlineLoading } from '@/components/ui/global-loading'
import { AlertTriangle, Shield, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: 'client' | 'creative' | 'admin'
  requireApproval?: boolean
  requireProfileComplete?: boolean
  redirectTo?: string
}

export function RouteGuard({ 
  children, 
  requiredRole, 
  requireApproval = false,
  requireProfileComplete = false,
  redirectTo 
}: RouteGuardProps) {
  const { user, loading, isProfileComplete } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return

    // Not authenticated
    if (!user) {
      const loginPath = requiredRole === 'admin' ? '/admin/login' : '/login'
      const redirectPath = `${loginPath}?redirect=${encodeURIComponent(location.pathname)}`
      navigate(redirectPath, { replace: true })
      return
    }

    // Role check
    if (requiredRole && user.role !== requiredRole) {
      if (requiredRole === 'admin') {
        navigate('/admin/login', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
      return
    }

    // Approval check for creatives
    if (requireApproval && user.role === 'creative' && !user.approved) {
      navigate('/profile/complete', { replace: true })
      return
    }

    // Profile completeness check
    if (requireProfileComplete && !isProfileComplete()) {
      navigate('/profile/complete', { replace: true })
      return
    }

    // Custom redirect
    if (redirectTo) {
      navigate(redirectTo, { replace: true })
      return
    }
  }, [user, loading, mounted, requiredRole, requireApproval, requireProfileComplete, redirectTo, navigate, location.pathname, isProfileComplete])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <InlineLoading size="lg" message="Loading..." />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please sign in to access this page
            </p>
            <Button 
              onClick={() => navigate(requiredRole === 'admin' ? '/admin/login' : '/login')}
              className="btn-primary"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Role check failed
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {requiredRole === 'admin' 
                ? 'Administrator privileges required to access this page'
                : `${requiredRole} role required to access this page`
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
              >
                Go Back
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Approval check failed
  if (requireApproval && user.role === 'creative' && !user.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Approval Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your creative profile is pending approval. Please complete your profile while waiting.
            </p>
            <Button 
              onClick={() => navigate('/profile/complete')}
              className="btn-primary"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Profile completeness check failed
  if (requireProfileComplete && !isProfileComplete()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please complete your profile setup to continue using the platform.
            </p>
            <Button 
              onClick={() => navigate('/profile/complete')}
              className="btn-primary"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}