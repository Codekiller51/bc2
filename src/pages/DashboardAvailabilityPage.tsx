import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { AvailabilitySettings } from '@/components/availability-settings'

export default function DashboardAvailabilityPage() {
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
          <InlineLoading size="lg" message="Loading availability settings..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Availability</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadCreativeProfile} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to load your creative profile. Please complete your profile setup.
          </p>
          <Button onClick={() => window.location.href = '/profile/complete'} className="btn-primary">
            Complete Profile
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
            Availability Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set your working hours and manage your schedule
          </p>
        </motion.div>
      </div>

      {/* Availability Settings Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <AvailabilitySettings creativeId={profile.id} />
      </motion.div>
    </div>
  )
}