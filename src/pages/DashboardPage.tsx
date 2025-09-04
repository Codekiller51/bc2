'use client'

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/components/enhanced-auth-provider'
import { InlineLoading } from '@/components/ui/global-loading'

export default function DashboardPage() {
  const { user, loading, isProfileComplete } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (loading) return
    
    if (!user) {
      navigate('/login')
      return
    }
    
    // Check if profile is complete, but skip for admin users
    if (user.role !== 'admin' && !isProfileComplete()) {
      navigate('/profile/complete')
      return
    }
    
    // Redirect based on user role
    if (user.role === 'admin') {
      navigate('/admin', { replace: true })
    } else if (user.role === 'creative') {
      navigate('/dashboard/creative', { replace: true })
    } else {
      navigate('/dashboard/overview', { replace: true })
    }
  }, [user, loading, isProfileComplete, navigate])
  
  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading dashboard..." />
        </div>
      </div>
    )
  }
  
  return null
}