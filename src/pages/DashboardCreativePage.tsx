import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Users,
  Clock,
  MessageSquare,
  Award,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatCurrency } from '@/lib/utils/format'
import { RecentBookings } from '@/components/recent-bookings'

export default function DashboardCreativePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedProjects: 0,
    totalEarnings: 0,
    averageRating: 0,
    pendingBookings: 0,
    profileViews: 0,
    responseRate: 0
  })
  const [profile, setProfile] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadCreativeDashboardData()
    }
  }, [user])

  const loadCreativeDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Get creative profile
      const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
      setProfile(creativeProfile)

      if (creativeProfile) {
        // Get bookings for this creative
        const bookings = await UnifiedDatabaseService.getBookings({ 
          userId: user.id 
        })

        // Calculate stats
        const completedBookings = bookings.filter(b => b.status === 'completed')
        const pendingBookings = bookings.filter(b => b.status === 'pending')
        const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0)

        setStats({
          totalBookings: bookings.length,
          completedProjects: completedBookings.length,
          totalEarnings,
          averageRating: creativeProfile.rating || 0,
          pendingBookings: pendingBookings.length,
          profileViews: Math.floor(Math.random() * 500) + 100, // Mock data
          responseRate: Math.floor(Math.random() * 30) + 85 // Mock data
        })

        // Mock recent activity
        setRecentActivity([
          { type: 'booking', message: 'New booking request from Sarah Johnson', time: '2 hours ago' },
          { type: 'review', message: 'Received 5-star review from David Mwalimu', time: '1 day ago' },
          { type: 'message', message: 'New message from Grace Kimaro', time: '2 days ago' }
        ])
      }
    } catch (error) {
      console.error('Failed to load creative dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getProfileCompleteness = () => {
    if (!profile) return 0
    
    let completeness = 0
    const checks = [
      profile.title,
      profile.bio,
      profile.skills && profile.skills.length > 0,
      profile.hourly_rate && profile.hourly_rate > 0,
      profile.portfolio_items && profile.portfolio_items.length > 0,
      profile.avatar_url
    ]
    
    completeness = (checks.filter(Boolean).length / checks.length) * 100
    return Math.round(completeness)
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading your creative dashboard..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadCreativeDashboardData} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const profileCompleteness = getProfileCompleteness()

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
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your creative business on Brand Connect
          </p>
        </motion.div>
      </div>

      {/* Profile Status Alert */}
      {profile?.approval_status === 'pending' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Profile Under Review
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Your profile is being reviewed by our admin team. You'll be notified once approved.
                  </p>
                </div>
                <Link to="/profile/edit">
                  <Button variant="outline" className="border-yellow-600 text-yellow-600">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Profile Completeness */}
      {profileCompleteness < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Complete Your Profile
                </h3>
                <span className="text-sm text-gray-500">{profileCompleteness}% Complete</span>
              </div>
              <Progress value={profileCompleteness} className="mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                A complete profile helps you attract more clients and build trust.
              </p>
              <Link to="/profile/edit">
                <Button className="btn-primary">
                  Complete Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalBookings}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Earnings
                  </p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(stats.totalEarnings)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Average Rating
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.averageRating.toFixed(1)}
                    </p>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
                  <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Profile Views
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.profileViews}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mb-8"
      >
        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/dashboard/bookings">
                <Button className="w-full btn-primary group">
                  <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  View Bookings
                  {stats.pendingBookings > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {stats.pendingBookings}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link to="/dashboard/messages">
                <Button className="w-full btn-outline group">
                  <MessageSquare className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Messages
                </Button>
              </Link>
              <Link to="/dashboard/portfolio">
                <Button className="w-full btn-outline group">
                  <Award className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Portfolio
                </Button>
              </Link>
              <Link to="/dashboard/availability">
                <Button className="w-full btn-outline group">
                  <Clock className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Availability
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentBookings />
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Rate</span>
                  <span className="font-semibold">{stats.responseRate}%</span>
                </div>
                <Progress value={stats.responseRate} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profile Completeness</span>
                  <span className="font-semibold">{profileCompleteness}%</span>
                </div>
                <Progress value={profileCompleteness} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{stats.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'booking' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        activity.type === 'review' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        'bg-green-100 dark:bg-green-900/20'
                      }`}>
                        {activity.type === 'booking' && <Calendar className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'review' && <Star className="h-4 w-4 text-yellow-600" />}
                        {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips for Success */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">Respond to messages within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Keep your portfolio updated</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Set clear availability hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}