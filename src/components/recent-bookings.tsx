"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, DollarSign, Eye, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UnifiedDatabaseService } from "@/lib/services/unified-database-service"
import { useAuth } from "@/components/enhanced-auth-provider"
import type { Booking } from "@/lib/database/types"
import { formatCurrency } from "@/lib/utils/format"

export function RecentBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadRecentBookings()
    }
  }, [user])

  const loadRecentBookings = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const data = await UnifiedDatabaseService.getBookings({ userId: user.id })
      setBookings(data.slice(0, 5)) // Get latest 5 bookings
    } catch (error) {
      console.error("Failed to load recent bookings:", error)
      setError("Failed to load recent bookings")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
              </div>
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={loadRecentBookings} size="sm" variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {(() => {
            const otherUser = booking.client_id === user?.id ? booking.creative : booking.client
            return (
              <>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={otherUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser?.full_name || 'User'}&backgroundColor=059669&textColor=ffffff`} 
                alt={otherUser?.full_name || "User"} 
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{otherUser?.full_name || "Unknown User"}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>{booking.start_time}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">
                    {formatCurrency(booking.total_amount || 0)}
                </span>
              </div>
              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            </div>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
              </>
            )
          })()}
        </motion.div>
      ))}

      {bookings.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No recent bookings</p>
        </div>
      )}
    </div>
  )
}
