import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { BookingCalendar } from '@/components/booking-calendar'
import { ServiceSelector } from '@/components/service-selector'
import { formatCurrency } from '@/lib/utils/format'
import { toast } from 'sonner'

export default function BookingPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const creativeId = searchParams.get('creative')
  
  const [creative, setCreative] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (creativeId) {
      loadCreativeData()
    } else {
      setError('No creative professional selected')
      setLoading(false)
    }
  }, [creativeId])

  const loadCreativeData = async () => {
    if (!creativeId) return

    try {
      setLoading(true)
      setError(null)
      
      const creativeData = await UnifiedDatabaseService.getCreativeProfileById(creativeId)
      if (!creativeData) {
        throw new Error('Creative professional not found')
      }
      
      setCreative(creativeData)
      setServices(creativeData.services || [])
    } catch (error) {
      console.error('Failed to load creative data:', error)
      setError('Failed to load creative professional data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleSelect = (date: string, timeSlot: string, timezone: string) => {
    setSelectedDate(date)
    setSelectedTimeSlot(timeSlot)
  }

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please log in to make a booking')
      navigate('/login')
      return
    }

    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      toast.error('Please select a service, date, and time slot')
      return
    }

    try {
      setBooking(true)
      
      const [startTime, endTime] = selectedTimeSlot.split(' - ')
      
      const bookingData = {
        creative_id: creativeId!,
        service_id: selectedService.id,
        booking_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        total_amount: selectedService.price,
        notes: notes.trim() || undefined
      }

      const newBooking = await UnifiedDatabaseService.createBooking(bookingData)
      
      toast.success('Booking created successfully!')
      navigate(`/booking/${newBooking.id}`)
    } catch (error) {
      console.error('Failed to create booking:', error)
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading booking information..." />
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
          <Button onClick={() => navigate('/search')} className="btn-primary">
            Browse Creatives
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
            Book a Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule your creative project with {creative?.title}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creative Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage 
                    src={creative?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${creative?.title}&backgroundColor=059669&textColor=ffffff`} 
                    alt={creative?.title} 
                  />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {creative?.title}
                </h3>
                
                <Badge className="bg-emerald-100 text-emerald-800 mb-4">
                  {creative?.category}
                </Badge>
                
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <User className="h-4 w-4" />
                  <span>{creative?.location}</span>
                </div>
                
                <div className="flex items-center justify-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(creative?.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium ml-2">
                    {creative?.rating?.toFixed(1)} ({creative?.reviews_count} reviews)
                  </span>
                </div>
              </div>

              {creative?.bio && (
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {creative.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ServiceSelector
              services={services}
              onServiceSelect={setSelectedService}
              selectedService={selectedService}
            />
          </motion.div>

          {/* Calendar */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <BookingCalendar
                creativeId={creativeId!}
                onScheduleSelect={handleScheduleSelect}
              />
            </motion.div>
          )}

          {/* Additional Notes */}
          {selectedDate && selectedTimeSlot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Project Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe your project requirements, expectations, or any special instructions..."
                      rows={4}
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{selectedTimeSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{selectedService?.duration} minutes</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span className="text-emerald-600">{formatCurrency(selectedService?.price || 0)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={booking}
                    className="w-full btn-primary"
                  >
                    {booking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}