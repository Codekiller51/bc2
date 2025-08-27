import { useEffect, useState } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type Notification = {
  id: string
  type: 'booking' | 'message' | 'system'
  message: string
  read: boolean
  created_at: string
  sender?: {
    full_name: string
    avatar_url: string
  }
  booking?: {
    id: string
    title: string
    status: string
  }
}

export function NotificationSystem() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchNotifications()
      // Subscribe to real-time notifications
      const subscription = UnifiedDatabaseService.subscribeToNotifications(user.id, () => {
        fetchNotifications()
        toast.success('You have a new notification')
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user?.id])

  const fetchNotifications = async () => {
    if (!user?.id) return

    try {
      const data = await UnifiedDatabaseService.getNotifications(user.id)
      setNotifications(data)
      setUnreadCount(data.filter((n: Notification) => !n.read_at).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await UnifiedDatabaseService.markNotificationAsRead(id)

      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to update notification')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return '📅'
      case 'message':
        return '💬'
      default:
        return '🔔'
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg ${!notification.read_at ? 'bg-muted' : ''}`}
                >
                  <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    {notification.data?.booking_id && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Booking ID: {notification.data.booking_id}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read_at && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}