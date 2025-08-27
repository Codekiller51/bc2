import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import type { Booking, Message, Notification } from '@/lib/database/types'

interface RealTimeState<T> {
  data: T[]
  loading: boolean
  error: string | null
  connectionStatus: 'connecting' | 'connected' | 'disconnected'
}

export function useRealTimeBookings(userId?: string) {
  const [state, setState] = useState<RealTimeState<Booking>>({
    data: [],
    loading: true,
    error: null,
    connectionStatus: 'connecting'
  })

  const loadBookings = useCallback(async () => {
    if (!userId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const bookings = await UnifiedDatabaseService.getBookings({ userId })
      setState(prev => ({ ...prev, data: bookings, loading: false }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to load bookings' 
      }))
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    loadBookings()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`bookings:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `client_id=eq.${userId}`
      }, () => {
        loadBookings()
      })
      .subscribe((status) => {
        setState(prev => ({
          ...prev,
          connectionStatus: status === 'SUBSCRIBED' ? 'connected' : 'connecting'
        }))
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, loadBookings])

  const refresh = useCallback(() => {
    loadBookings()
  }, [loadBookings])

  return {
    ...state,
    refresh
  }
}

export function useRealTimeMessages(conversationId?: string) {
  const [state, setState] = useState<RealTimeState<Message>>({
    data: [],
    loading: true,
    error: null,
    connectionStatus: 'connecting'
  })

  const loadMessages = useCallback(async () => {
    if (!conversationId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const messages = await UnifiedDatabaseService.getMessages(conversationId)
      setState(prev => ({ ...prev, data: messages, loading: false }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to load messages' 
      }))
    }
  }, [conversationId])

  useEffect(() => {
    if (!conversationId) return

    loadMessages()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setState(prev => ({
          ...prev,
          data: [...prev.data, payload.new as Message]
        }))
      })
      .subscribe((status) => {
        setState(prev => ({
          ...prev,
          connectionStatus: status === 'SUBSCRIBED' ? 'connected' : 'connecting'
        }))
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [conversationId, loadMessages])

  const refresh = useCallback(() => {
    loadMessages()
  }, [loadMessages])

  return {
    ...state,
    refresh
  }
}

export function useRealTimeNotifications(userId?: string) {
  const [state, setState] = useState<RealTimeState<Notification>>({
    data: [],
    loading: true,
    error: null,
    connectionStatus: 'connecting'
  })

  const loadNotifications = useCallback(async () => {
    if (!userId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const notifications = await UnifiedDatabaseService.getNotifications(userId)
      setState(prev => ({ ...prev, data: notifications, loading: false }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to load notifications' 
      }))
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    loadNotifications()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setState(prev => ({
          ...prev,
          data: [payload.new as Notification, ...prev.data]
        }))
      })
      .subscribe((status) => {
        setState(prev => ({
          ...prev,
          connectionStatus: status === 'SUBSCRIBED' ? 'connected' : 'connecting'
        }))
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, loadNotifications])

  const refresh = useCallback(() => {
    loadNotifications()
  }, [loadNotifications])

  return {
    ...state,
    refresh
  }
}