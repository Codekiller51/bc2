import { useState, useEffect, useCallback } from 'react'
import { RealTimeService } from '@/lib/services/real-time-service'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import type { Notification } from '@/lib/database/types'

export function useRealTimeNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

  // Load initial notifications
  const loadNotifications = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const data = await UnifiedDatabaseService.getNotifications(userId)
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read_at).length)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    loadNotifications()

    // Subscribe to real-time updates
    const subscription = RealTimeService.subscribeToNotifications(
      userId,
      (newNotification) => {
        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)
      },
      (error) => {
        console.error('Real-time notification error:', error)
        setConnectionStatus('disconnected')
      }
    )

    setConnectionStatus('connected')

    return () => {
      subscription.unsubscribe()
      setConnectionStatus('disconnected')
    }
  }, [userId, loadNotifications])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await UnifiedDatabaseService.markNotificationAsRead(notificationId)
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read_at)
      
      await Promise.all(
        unreadNotifications.map(n => 
          UnifiedDatabaseService.markNotificationAsRead(n.id)
        )
      )
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      )
      
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }, [notifications])

  const refresh = useCallback(() => {
    loadNotifications()
  }, [loadNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    refresh
  }
}