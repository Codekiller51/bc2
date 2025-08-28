import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { toast } from 'sonner'
import type { User } from '@/lib/database/types'

interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  location: string
  userType: 'client' | 'creative'
  profession?: string
}

export function useEnhancedAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state
  useEffect(() => {
    getInitialSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUserProfile()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const getInitialSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await loadUserProfile()
      }
    } catch (error) {
      console.error('Error getting initial session:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async () => {
    try {
      const userData = await UnifiedDatabaseService.getCurrentUser()
      setUser(userData)
      setError(null)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setError('Failed to load user profile')
    }
  }

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error

      const userName = data.user?.user_metadata?.full_name || 'User'
      toast.success(`Welcome back, ${userName}!`)

      return { success: true, user: data.user }
    } catch (error: any) {
      let errorMessage = 'Login failed'
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address'
      } else {
        errorMessage = error.message
      }

      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            phone: data.phone,
            location: data.location,
            user_type: data.userType,
            role: data.userType,
            category: data.userType === 'creative' ? 'General' : undefined,
            ...(data.userType === 'creative' && { profession: data.profession })
          }
        }
      })

      if (error) throw error

      if (data.userType === 'creative') {
        toast.success('Account created successfully! Your profile will be reviewed by our admin team.')
      } else {
        toast.success('Account created successfully!')
      }
      
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      setUser(null)
      toast.success('Signed out successfully')
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.message || 'Logout failed'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      toast.success('Password reset email sent')
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send reset email'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in')

      if (user.role === 'creative') {
        await UnifiedDatabaseService.updateCreativeProfile(user.id, updates as any)
      } else {
        await UnifiedDatabaseService.updateClientProfile(user.id, updates as any)
      }

      await loadUserProfile()
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [user])

  // Utility functions
  const hasRole = useCallback((role: 'client' | 'creative' | 'admin') => {
    return user?.role === role
  }, [user])

  const isApproved = useCallback(() => {
    return user?.approved === true
  }, [user])

  const isAuthenticated = useCallback(() => {
    return user !== null
  }, [user])

  const isAdmin = useCallback(() => {
    return user?.role === 'admin'
  }, [user])

  const isProfileComplete = useCallback(() => {
    if (!user) return false
    
    // Check if essential profile information is present
    const hasBasicInfo = user.name && user.location
    
    // For creative users, also check if they have professional details
    if (user.role === 'creative') {
      // For creatives, we need approval status to be approved as well
      return hasBasicInfo && user.approved
    }
    
    // For clients, basic info is sufficient
    return hasBasicInfo
  }, [user])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    hasRole,
    isApproved,
    isAuthenticated,
    isAdmin,
    isProfileComplete
  }
}