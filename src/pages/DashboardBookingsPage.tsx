import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, MapPin, DollarSign, Filter, Search, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatCurrency } from '@/lib/utils/format'
import { EnhancedBookingList } from '@/components/enhanced-booking-list'

export default function DashboardBookingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadCreativeProfile()
    }
  }, [user])

  const loadCreativeProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
      setProfile(creativeProfile)
    } catch (error) {
      console.error('Failed to load creative profile:', error)
      setError('Failed to load profile data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading your bookings..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Bookings</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadCreativeProfile} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your client bookings
          </p>
        </motion.div>
      </div>

      {/* Enhanced Booking List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <EnhancedBookingList 
          userId={user?.id}
          filters={{
            creativeId: profile?.id
          }}
        />
      </motion.div>
    </div>
  )
}