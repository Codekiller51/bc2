import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface SessionState {
  isActive: boolean
  expiresAt: Date | null
  warningShown: boolean
  lastActivity: Date
}

const SESSION_WARNING_TIME = 5 * 60 * 1000 // 5 minutes before expiry
const SESSION_EXTEND_TIME = 30 * 60 * 1000 // 30 minutes extension

export function useGlobalSessionManagement() {
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    expiresAt: null,
    warningShown: false,
    lastActivity: new Date()
  })

  useEffect(() => {
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSessionState(prev => ({
          ...prev,
          isActive: true,
          expiresAt: new Date(session.expires_at! * 1000),
          warningShown: false
        }))
      } else {
        setSessionState(prev => ({
          ...prev,
          isActive: false,
          expiresAt: null,
          warningShown: false
        }))
      }
    })

    // Check session expiry every minute
    const interval = setInterval(checkSessionExpiry, 60000)

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    const updateActivity = () => {
      setSessionState(prev => ({
        ...prev,
        lastActivity: new Date()
      }))
    }

    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessionState(prev => ({
          ...prev,
          isActive: true,
          expiresAt: new Date(session.expires_at! * 1000),
          lastActivity: new Date()
        }))
      }
    } catch (error) {
      console.error('Error checking session:', error)
    }
  }

  const checkSessionExpiry = useCallback(() => {
    if (!sessionState.isActive || !sessionState.expiresAt) return

    const now = new Date()
    const timeUntilExpiry = sessionState.expiresAt.getTime() - now.getTime()

    // Show warning if session expires soon and warning hasn't been shown
    if (timeUntilExpiry <= SESSION_WARNING_TIME && !sessionState.warningShown) {
      setSessionState(prev => ({ ...prev, warningShown: true }))
      toast.warning('Your session will expire soon. Click to extend your session.')
    }

    // Auto-logout if session expired
    if (timeUntilExpiry <= 0) {
      handleSessionExpiry()
    }
  }, [sessionState])

  const handleSessionExpiry = async () => {
    try {
      await supabase.auth.signOut()
      toast.error('Your session has expired. Please sign in again.')
      window.location.href = '/login'
    } catch (error) {
      console.error('Error during session expiry:', error)
    }
  }

  const extendSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) throw error

      if (data.session) {
        setSessionState(prev => ({
          ...prev,
          expiresAt: new Date(data.session!.expires_at! * 1000),
          warningShown: false
        }))
        toast.success('Session extended successfully')
      }
    } catch (error) {
      console.error('Error extending session:', error)
      toast.error('Failed to extend session')
    }
  }, [])

  const getTimeUntilExpiry = useCallback(() => {
    if (!sessionState.expiresAt) return 0
    return Math.max(0, sessionState.expiresAt.getTime() - new Date().getTime())
  }, [sessionState.expiresAt])

  const getFormattedTimeUntilExpiry = useCallback(() => {
    const timeLeft = getTimeUntilExpiry()
    const minutes = Math.floor(timeLeft / 60000)
    const seconds = Math.floor((timeLeft % 60000) / 1000)
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }, [getTimeUntilExpiry])

  const isSessionExpiringSoon = useCallback(() => {
    return getTimeUntilExpiry() <= SESSION_WARNING_TIME
  }, [getTimeUntilExpiry])

  return {
    sessionState,
    extendSession,
    getTimeUntilExpiry,
    getFormattedTimeUntilExpiry,
    isSessionExpiringSoon
  }
}