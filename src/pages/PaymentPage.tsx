import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Shield, CheckCircle, AlertTriangle, Lock } from 'lucide-react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatCurrency } from '@/lib/utils/format'
import { toast } from 'sonner'

export default function PaymentPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    mobileNumber: '',
    bankAccount: ''
  })

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

  const handlePayment = async () => {
    if (!booking) return

    try {
      setProcessing(true)
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        // Update booking status to confirmed
        await UnifiedDatabaseService.updateBookingStatus(booking.id, 'confirmed')
        
        toast.success('Payment successful! Your booking has been confirmed.')
        navigate(`/booking/${booking.id}`)
      } else {
        throw new Error('Payment failed. Please try again or use a different payment method.')
      }
    } catch (error) {
      console.error('Payment failed:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading payment details..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Payment</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
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
            The booking you're trying to pay for doesn't exist or you don't have permission to access it.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
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
            Secure Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your booking payment securely
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Credit/Debit Card</div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'mobile' 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-lg mb-2">📱</div>
                    <div className="text-sm font-medium">Mobile Money</div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'bank' 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-lg mb-2">🏦</div>
                    <div className="text-sm font-medium">Bank Transfer</div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'mobile' && (
                  <div>
                    <Label htmlFor="mobileNumber">Mobile Money Number</Label>
                    <Input
                      id="mobileNumber"
                      value={paymentData.mobileNumber}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                      placeholder="+255 123 456 789"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Supports M-Pesa, Tigo Pesa, and Airtel Money
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div>
                    <Label htmlFor="bankAccount">Bank Account Number</Label>
                    <Input
                      id="bankAccount"
                      value={paymentData.bankAccount}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, bankAccount: e.target.value }))}
                      placeholder="Account number"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Bank transfer details will be provided after confirmation
                    </p>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Your payment information is encrypted and secure. We never store your payment details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{booking.service?.name || 'Creative Service'}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  with {booking.creative?.title || 'Creative Professional'}
                </p>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>{formatCurrency(booking.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span>{formatCurrency(booking.total_amount * 0.05)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>{formatCurrency(booking.total_amount * 0.03)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-emerald-600">
                  {formatCurrency(booking.total_amount * 1.08)}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Details</h4>
                <div className="space-y-1 text-sm">
                  <div>Date: {new Date(booking.booking_date).toLocaleDateString()}</div>
                  <div>Time: {booking.start_time} - {booking.end_time}</div>
                  <div>Duration: {booking.service?.duration || 60} minutes</div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full btn-primary"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Pay {formatCurrency(booking.total_amount * 1.08)}
                  </>
                )}
              </Button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}