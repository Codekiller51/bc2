import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, DollarSign, MessageSquare, Phone, Mail, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useParams, Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatCurrency } from '@/lib/utils/format'
import { toast } from 'sonner'

export default function BookingDetailsPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadBookingDetails()
    }
  }, [id])

  const loadBookingDetails = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      
      const bookings = await UnifiedDatabaseService.getBookings({ userId: user?.id })
      const bookingData = bookings.find(b => b.id === id)
      
      if (!bookingData) {
        throw new Error('Booking not found or you do not have permission to view it')
      }
      
      setBooking(bookingData)
    } catch (error) {
      console.error('Failed to load booking details:', error)
      setError('Failed to load booking details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking) return

    try {
      setUpdating(true)
      await UnifiedDatabaseService.updateBookingStatus(booking.id, newStatus)
      setBooking(prev => ({ ...prev, status: newStatus }))
      toast.success('Booking status updated successfully!')
    } catch (error) {
      console.error('Failed to update booking status:', error)
      toast.error('Failed to update booking status')
    } finally {
      setUpdating(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading booking details..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Booking</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadBookingDetails} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Booking Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The booking you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link to="/dashboard">
            <Button className="btn-primary">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const otherUser = booking.client_id === user?.id ? booking.creative : booking.client
  const isCreative = user?.role === 'creative'

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
                Booking Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Booking ID: {booking.id}
              </p>
            </div>
            
            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
              {getStatusIcon(booking.status)}
              {booking.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Details */}
              <div>
                <h3 className="font-semibold mb-3">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Service</label>
                    <p className="text-gray-900 dark:text-white">{booking.service?.name || 'Service'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                    <p className="text-gray-900 dark:text-white">{booking.service?.category || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Schedule Details */}
              <div>
                <h3 className="font-semibold mb-3">Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</label>
                      <p className="text-gray-900 dark:text-white">
                        {booking.start_time} - {booking.end_time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Details */}
              <div>
                <h3 className="font-semibold mb-3">Payment</h3>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</label>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(booking.total_amount)}
                    </p>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Project Notes</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">{booking.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact & Actions */}
        <div className="space-y-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>
                  {isCreative ? 'Client' : 'Creative Professional'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarImage 
                      src={otherUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser?.full_name || otherUser?.title}&backgroundColor=059669&textColor=ffffff`} 
                      alt={otherUser?.full_name || otherUser?.title} 
                    />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {otherUser?.full_name || otherUser?.title || 'User'}
                  </h3>
                  
                  {isCreative && otherUser?.company_name && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {otherUser.company_name}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{otherUser?.email || 'Not provided'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{otherUser?.phone || 'Not provided'}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Link to="/chat">
                    <Button className="w-full btn-primary">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                  
                  {otherUser?.phone && (
                    <Button 
                      onClick={() => window.open(`tel:${otherUser.phone}`)}
                      className="w-full btn-outline"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Management */}
          {isCreative && booking.status === 'pending' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Manage Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This booking is pending your confirmation
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate('confirmed')}
                      disabled={updating}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    
                    <Button
                      onClick={() => handleStatusUpdate('cancelled')}
                      disabled={updating}
                      variant="outline"
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Booking Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Booking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Booking Created</p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {booking.status !== 'pending' && (
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-500' :
                        booking.status === 'cancelled' ? 'bg-red-500' :
                        'bg-purple-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">
                          Status: {booking.status.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {booking.status === 'confirmed' && new Date(booking.booking_date) > new Date() && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                      <div>
                        <p className="text-sm font-medium">Upcoming Session</p>
                        <p className="text-xs text-gray-500">
                          {new Date(`${booking.booking_date}T${booking.start_time}`).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}