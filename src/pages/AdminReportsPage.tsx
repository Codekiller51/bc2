import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/enhanced-auth-provider'
import { InlineLoading } from '@/components/ui/global-loading'
import { EnhancedAdminReports } from '@/components/enhanced-admin-reports'

export default function AdminReportsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    if (user?.role === 'admin') {
      setLoading(false)
    }
  }, [user])

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

      {loading ? (
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading reports..." />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Reports</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EnhancedAdminReports />
        </motion.div>
      )}
    </div>
  )
}