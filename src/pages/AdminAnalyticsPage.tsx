import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { RevenueChart } from '@/components/revenue-chart'
import { UserGrowthChart } from '@/components/user-growth-chart'
import { formatCurrency } from '@/lib/utils/format'

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    totalCreatives: 0,
    totalClients: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAnalytics()
    }
  }, [user, timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const analyticsData = await UnifiedDatabaseService.getDashboardStats()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setError('Failed to load analytics data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading analytics..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadAnalytics} className="btn-primary">
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
                Platform Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Insights and performance metrics for Brand Connect
              </p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </div>

      {/* Key Metrics */}
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
                    Platform Revenue
                  </p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(analytics.totalRevenue)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +{analytics.monthlyGrowth}% growth
                  </div>
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
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalClients + analytics.totalCreatives}
                  </p>
                  <p className="text-xs text-gray-500">
                    {analytics.totalClients} clients, {analytics.totalCreatives} creatives
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalBookings}
                  </p>
                  <p className="text-xs text-gray-500">
                    All time bookings
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                    Platform Rating
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {analytics.averageRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Average satisfaction
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <RevenueChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <UserGrowthChart />
        </motion.div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Graphic Design', percentage: 35 },
                  { name: 'Photography', percentage: 28 },
                  { name: 'Digital Marketing', percentage: 20 },
                  { name: 'Web Design', percentage: 17 }
                ].map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{category.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { city: 'Dar es Salaam', users: 45 },
                  { city: 'Arusha', users: 23 },
                  { city: 'Mwanza', users: 18 },
                  { city: 'Dodoma', users: 14 }
                ].map((region, index) => (
                  <div key={region.city} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {region.city}
                    </span>
                    <span className="text-sm font-medium">{region.users} users</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">System Status</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className="text-sm font-medium">245ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                  <span className="text-sm font-medium">127</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}