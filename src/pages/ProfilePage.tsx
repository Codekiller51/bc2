import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Edit, Camera, MapPin, Phone, Mail, Calendar, Award, Star, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatCurrency } from '@/lib/utils/format'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedProjects: 0,
    totalEarnings: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadProfileData()
    }
  }, [user])

  const loadProfileData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      if (user.role === 'creative') {
        const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
        setProfile(creativeProfile)

        if (creativeProfile) {
          const bookings = await UnifiedDatabaseService.getBookings({ userId: user.id })
          const completedBookings = bookings.filter(b => b.status === 'completed')
          const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0)

          setStats({
            totalBookings: bookings.length,
            completedProjects: completedBookings.length,
            totalEarnings,
            averageRating: creativeProfile.rating || 0
          })
        }
      } else {
        // For clients, get basic stats
        const bookings = await UnifiedDatabaseService.getBookings({ userId: user.id })
        const completedBookings = bookings.filter(b => b.status === 'completed')
        const totalSpent = completedBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0)

        setStats({
          totalBookings: bookings.length,
          completedProjects: completedBookings.length,
          totalEarnings: totalSpent,
          averageRating: 0
        })
      }
    } catch (error) {
      console.error('Failed to load profile data:', error)
      setError('Failed to load profile data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading your profile..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadProfileData} className="btn-primary">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your profile information and view your activity
              </p>
            </div>
            <Link to="/profile/edit">
              <Button className="btn-primary">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="professional-card">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-6">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage 
                    src={user.avatar_url || profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=059669&textColor=ffffff`} 
                    alt={user.name} 
                  />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2">
                  <div className="w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {user.name}
              </h2>
              
              <div className="space-y-2 mb-6">
                {user.role === 'creative' && profile && (
                  <p className="text-brand-600 dark:text-brand-400 font-medium">
                    {profile.title}
                  </p>
                )}
                
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location || 'Tanzania'}</span>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-6">
                <Badge className={
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'creative' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {user.role === 'admin' ? 'Administrator' :
                   user.role === 'creative' ? 'Creative Professional' :
                   'Client'}
                </Badge>
              </div>

              {user.role === 'creative' && profile && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{stats.averageRating.toFixed(1)} Rating</span>
                  </div>
                  
                  <Badge className={
                    profile.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                    profile.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {profile.approval_status === 'approved' ? 'Approved' :
                     profile.approval_status === 'pending' ? 'Pending Approval' :
                     'Needs Review'}
                  </Badge>
                </div>
              )}

              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="professional-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stats.totalBookings}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Bookings
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {stats.completedProjects}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Completed
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    {formatCurrency(stats.totalEarnings)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {user.role === 'creative' ? 'Earnings' : 'Spent'}
                  </div>
                </CardContent>
              </Card>

              {user.role === 'creative' && (
                <Card className="professional-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Rating
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.role === 'creative' && profile && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Professional Title
                      </label>
                      <p className="text-gray-900 dark:text-white">{profile.title}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Category
                      </label>
                      <p className="text-gray-900 dark:text-white">{profile.category}</p>
                    </div>

                    {profile.bio && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Bio
                        </label>
                        <p className="text-gray-900 dark:text-white">{profile.bio}</p>
                      </div>
                    )}

                    {profile.hourly_rate && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Hourly Rate
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {formatCurrency(profile.hourly_rate)} per hour
                        </p>
                      </div>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {user.role === 'client' && (
                  <>
                    {user.company_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Company
                        </label>
                        <p className="text-gray-900 dark:text-white">{user.company_name}</p>
                      </div>
                    )}

                    {user.industry && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Industry
                        </label>
                        <p className="text-gray-900 dark:text-white">{user.industry}</p>
                      </div>
                    )}
                  </>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {user.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/profile/edit">
                    <Button className="w-full btn-outline group">
                      <Edit className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Edit Profile
                    </Button>
                  </Link>
                  
                  <Link to={user.role === 'admin' ? '/admin' : user.role === 'creative' ? '/dashboard/creative' : '/dashboard/overview'}>
                    <Button className="w-full btn-outline group">
                      <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <Link to="/chat">
                    <Button className="w-full btn-outline group">
                      <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Messages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}