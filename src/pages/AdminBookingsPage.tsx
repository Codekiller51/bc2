import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Search, Filter, Eye, AlertTriangle, User, Clock, DollarSign } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatCurrency } from '@/lib/utils/format'
import { BookingDetailsModal } from '@/components/booking-details-modal'

export default function AdminBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') {
      loadBookings()
    }
  }, [user])

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const bookingData = await UnifiedDatabaseService.getBookings({
        status: filter !== 'all' ? filter : undefined
      })
      setBookings(bookingData)
    } catch (error) {
      console.error('Failed to load bookings:', error)
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await UnifiedDatabaseService.updateBookingStatus(bookingId, newStatus)
      toast.success('Booking status updated successfully!')
      loadBookings()
    } catch (error) {
      console.error('Failed to update booking status:', error)
      toast.error('Failed to update booking status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter
    const matchesSearch = !searchTerm || 
      booking.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.creative?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading bookings..." />
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
          <Button onClick={loadBookings} className="btn-primary">
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
            Booking Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage all platform bookings
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadBookings} variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Bookings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="professional-card">
          <CardHeader>
            <CardTitle>Platform Bookings ({filteredBookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={booking.client?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${booking.client?.name || 'User'}&backgroundColor=059669&textColor=ffffff`} 
                            alt={booking.client?.name} 
                          />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {booking.service?.name || 'Service'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.client?.name} → {booking.creative?.title}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 flex-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{booking.start_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(booking.total_amount || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                      
                      <Button
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowDetailsModal(true)
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          open={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedBooking(null)
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}