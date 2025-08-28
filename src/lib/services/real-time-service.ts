import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Booking, Message, Notification } from '@/lib/database/types'

export interface RealTimeSubscription {
  unsubscribe: () => void
}

export class RealTimeService {
  private static subscriptions = new Map<string, any>()

  // =============================================
  // BOOKING REAL-TIME UPDATES
  // =============================================

  static subscribeToBookingUpdates(
    userId: string,
    onUpdate: (booking: Booking) => void,
    onError?: (error: Error) => void
  ): RealTimeSubscription {
    const channelName = `bookings:${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `client_id=eq.${userId}`
      }, (payload) => {
        try {
          if (payload.eventType === 'UPDATE') {
            onUpdate(payload.new as Booking)
            
            // Show notification for status changes
            if (payload.old?.status !== payload.new?.status) {
              const statusMessages = {
                confirmed: 'Your booking has been confirmed!',
                in_progress: 'Your booking is now in progress',
                completed: 'Your booking has been completed',
                cancelled: 'Your booking has been cancelled'
              }
              
              const message = statusMessages[payload.new.status as keyof typeof statusMessages]
              if (message) {
                toast.success(message)
              }
            }
          }
        } catch (error) {
          console.error('Error processing booking update:', error)
          onError?.(error as Error)
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `creative_id=eq.${userId}`
      }, (payload) => {
        try {
          if (payload.eventType === 'INSERT') {
            onUpdate(payload.new as Booking)
            toast.success('New booking request received!')
          } else if (payload.eventType === 'UPDATE') {
            onUpdate(payload.new as Booking)
          }
        } catch (error) {
          console.error('Error processing creative booking update:', error)
          onError?.(error as Error)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to booking updates for user ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to booking updates')
          onError?.(new Error('Failed to subscribe to booking updates'))
        }
      })

    this.subscriptions.set(channelName, channel)

    return {
      unsubscribe: () => {
        channel.unsubscribe()
        this.subscriptions.delete(channelName)
      }
    }
  }

  // =============================================
  // MESSAGE REAL-TIME UPDATES
  // =============================================

  static subscribeToMessages(
    conversationId: string,
    onNewMessage: (message: Message) => void,
    onError?: (error: Error) => void
  ): RealTimeSubscription {
    const channelName = `messages:${conversationId}`
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        try {
          const newMessage = payload.new as Message
          onNewMessage(newMessage)
          
          // Play notification sound (optional)
          this.playNotificationSound()
        } catch (error) {
          console.error('Error processing new message:', error)
          onError?.(error as Error)
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        try {
          // Handle message read status updates
          if (payload.old?.read_at !== payload.new?.read_at) {
            // Message was marked as read
            console.log('Message marked as read:', payload.new.id)
          }
        } catch (error) {
          console.error('Error processing message update:', error)
          onError?.(error as Error)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to messages for conversation ${conversationId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to messages')
          onError?.(new Error('Failed to subscribe to messages'))
        }
      })

    this.subscriptions.set(channelName, channel)

    return {
      unsubscribe: () => {
        channel.unsubscribe()
        this.subscriptions.delete(channelName)
      }
    }
  }

  // =============================================
  // TYPING INDICATORS
  // =============================================

  static subscribeToTypingIndicators(
    conversationId: string,
    currentUserId: string,
    onTypingChange: (userId: string, isTyping: boolean) => void
  ): RealTimeSubscription {
    const channelName = `typing:${conversationId}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, isTyping } = payload.payload
        
        // Don't show typing indicator for current user
        if (userId !== currentUserId) {
          onTypingChange(userId, isTyping)
        }
      })
      .subscribe()

    this.subscriptions.set(channelName, channel)

    return {
      unsubscribe: () => {
        channel.unsubscribe()
        this.subscriptions.delete(channelName)
      }
    }
  }

  static sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
    const channel = supabase.channel(`typing:${conversationId}`)
    
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, isTyping }
    })
  }

  // =============================================
  // NOTIFICATION REAL-TIME UPDATES
  // =============================================

  static subscribeToNotifications(
    userId: string,
    onNewNotification: (notification: Notification) => void,
    onError?: (error: Error) => void
  ): RealTimeSubscription {
    const channelName = `notifications:${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        try {
          const notification = payload.new as Notification
          onNewNotification(notification)
          
          // Show toast notification
          toast.info(notification.title, {
            description: notification.message
          })
          
          // Play notification sound
          this.playNotificationSound()
        } catch (error) {
          console.error('Error processing notification:', error)
          onError?.(error as Error)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to notifications for user ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to notifications')
          onError?.(new Error('Failed to subscribe to notifications'))
        }
      })

    this.subscriptions.set(channelName, channel)

    return {
      unsubscribe: () => {
        channel.unsubscribe()
        this.subscriptions.delete(channelName)
      }
    }
  }

  // =============================================
  // PRESENCE SYSTEM
  // =============================================

  static subscribeToUserPresence(
    userId: string,
    onPresenceChange: (presences: Record<string, any>) => void
  ): RealTimeSubscription {
    const channelName = `presence:${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        onPresenceChange(newState)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track user presence
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          })
        }
      })

    this.subscriptions.set(channelName, channel)

    return {
      unsubscribe: () => {
        channel.unsubscribe()
        this.subscriptions.delete(channelName)
      }
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  private static playNotificationSound() {
    try {
      // Create a subtle notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (error) {
      // Silently fail if audio context is not available
      console.log('Audio notification not available')
    }
  }

  static unsubscribeAll() {
    this.subscriptions.forEach((channel) => {
      channel.unsubscribe()
    })
    this.subscriptions.clear()
  }

  static getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    // Check if any subscriptions are active
    if (this.subscriptions.size === 0) {
      return 'disconnected'
    }

    // In a real implementation, you'd check the actual connection status
    // For now, we'll assume connected if we have subscriptions
    return 'connected'
  }

  // =============================================
  // ADMIN REAL-TIME MONITORING
  // =============================================

  static subscribeToAllActivity(
    onActivity: (activity: any) => void,
    onError?: (error: Error) => void
  ): RealTimeSubscription {
    const channelName = 'admin:activity'
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload) => {
        onActivity({
          type: 'booking',
          event: payload.eventType,
          data: payload.new,
          timestamp: new Date().toISOString()
        })
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'creative_profiles'
      }, (payload) => {
        onActivity({
          type: 'creative_registration',
          event: 'INSERT',
          data: payload.new,
          timestamp: new Date().toISOString()
        })
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'client_profiles'
      }, (payload) => {
        onActivity({
          type: 'client_registration',
          event: 'INSERT',
          data: payload.new,
          timestamp: new Date().toISOString()
        })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to admin activity monitoring')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to admin activity')
          onError?.(new Error('Failed to subscribe to admin activity'))
        }
      })

    this.subscriptions.set(channelName, channel)

    return {
      unsubscribe: () => {
        channel.unsubscribe()
        this.subscriptions.delete(channelName)
      }
    }
  }
}

export default RealTimeService