import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Calendar, Users, DollarSign, BarChart3, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatCurrency } from '@/lib/utils/format'

export default function AdminReportsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportType, setReportType] = useState('financial')
  const [dateRange, setDateRange] = useState(undefined)
  const [reportData, setReportData] = useState(null)

  const generateReport = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock report generation for now
      const mockReportData = {
        financial: {
          totalRevenue: 2500000,
          totalBookings: 156,
          averageBookingValue: 160256,
          commission: 250000
        },
        user: {
          totalUsers: 234,
          newUsers: 45,
          activeUsers: 189,
          retentionRate: 78
        },
        activity: {
          totalMessages: 1234,
          averageResponseTime: '2.5 hours',
          completionRate: 92,
          satisfactionScore: 4.7
        }
      }
      
      setReportData(mockReportData[reportType])
    } catch (error) {
      console.error('Failed to generate report:', error)
      setError('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    // Mock download functionality
    const reportContent = JSON.stringify(reportData, null, 2)
    const blob = new Blob([reportContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brand-connect-${reportType}-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate detailed reports for platform performance and insights
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="user">User Activity Report</SelectItem>
                    <SelectItem value="activity">Platform Activity Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>

              <Button
                onClick={generateReport}
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              {reportData && (
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Results */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Report Results</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <InlineLoading size="lg" message="Generating report..." />
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Generating Report</h3>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                  </div>
                ) : reportData ? (
                  <div className="space-y-6">
                    {reportType === 'financial' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(reportData.totalRevenue)}
                          </div>
                          <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {reportData.totalBookings}
                          </div>
                          <div className="text-sm text-gray-600">Total Bookings</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(reportData.averageBookingValue)}
                          </div>
                          <div className="text-sm text-gray-600">Avg Booking Value</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {formatCurrency(reportData.commission)}
                          </div>
                          <div className="text-sm text-gray-600">Platform Commission</div>
                        </div>
                      </div>
                    )}

                    {reportType === 'user' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {reportData.totalUsers}
                          </div>
                          <div className="text-sm text-gray-600">Total Users</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {reportData.newUsers}
                          </div>
                          <div className="text-sm text-gray-600">New Users</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {reportData.activeUsers}
                          </div>
                          <div className="text-sm text-gray-600">Active Users</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {reportData.retentionRate}%
                          </div>
                          <div className="text-sm text-gray-600">Retention Rate</div>
                        </div>
                      </div>
                    )}

                    {reportType === 'activity' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {reportData.totalMessages}
                          </div>
                          <div className="text-sm text-gray-600">Total Messages</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {reportData.averageResponseTime}
                          </div>
                          <div className="text-sm text-gray-600">Avg Response Time</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {reportData.completionRate}%
                          </div>
                          <div className="text-sm text-gray-600">Completion Rate</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {reportData.satisfactionScore}★
                          </div>
                          <div className="text-sm text-gray-600">Satisfaction Score</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Generate Your First Report
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select a report type and date range to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}