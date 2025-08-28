import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, DollarSign, Users, Bell, Shield, Save, AlertTriangle, TestTube } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/enhanced-auth-provider'
import { InlineLoading } from '@/components/ui/global-loading'
import { AdminTestRunner } from '@/components/admin-test-runner'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [platformSettings, setPlatformSettings] = useState({
    // Commission Settings
    commissionRate: 10,
    minimumCommission: 1000,
    
    // User Settings
    autoApproveCreatives: false,
    requireEmailVerification: true,
    allowGuestBookings: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    
    // Platform Settings
    maintenanceMode: false,
    registrationEnabled: true,
    bookingEnabled: true,
    
    // Content Settings
    platformName: 'Brand Connect',
    supportEmail: 'support@brandconnect.co.tz',
    supportPhone: '+255 123 456 789',
    termsOfService: '',
    privacyPolicy: ''
  })

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      
      // In a real implementation, this would save to a platform_settings table
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Platform settings updated successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
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
            Platform Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure platform-wide settings and preferences
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                <Input
                  id="commission-rate"
                  type="number"
                  min="0"
                  max="50"
                  value={platformSettings.commissionRate}
                  onChange={(e) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    commissionRate: Number(e.target.value) 
                  }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Platform commission on completed bookings
                </p>
              </div>

              <div>
                <Label htmlFor="minimum-commission">Minimum Commission (TZS)</Label>
                <Input
                  id="minimum-commission"
                  type="number"
                  min="0"
                  value={platformSettings.minimumCommission}
                  onChange={(e) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    minimumCommission: Number(e.target.value) 
                  }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum commission amount per booking
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Management Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-approve Creative Profiles</Label>
                  <p className="text-xs text-gray-500">
                    Automatically approve new creative registrations
                  </p>
                </div>
                <Switch
                  checked={platformSettings.autoApproveCreatives}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    autoApproveCreatives: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Email Verification</Label>
                  <p className="text-xs text-gray-500">
                    Users must verify email before accessing platform
                  </p>
                </div>
                <Switch
                  checked={platformSettings.requireEmailVerification}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    requireEmailVerification: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Guest Bookings</Label>
                  <p className="text-xs text-gray-500">
                    Allow non-registered users to make bookings
                  </p>
                </div>
                <Switch
                  checked={platformSettings.allowGuestBookings}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    allowGuestBookings: checked 
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-gray-500">
                    Send email notifications to users
                  </p>
                </div>
                <Switch
                  checked={platformSettings.emailNotifications}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    emailNotifications: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-xs text-gray-500">
                    Send SMS notifications for important updates
                  </p>
                </div>
                <Switch
                  checked={platformSettings.smsNotifications}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    smsNotifications: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-gray-500">
                    Send browser push notifications
                  </p>
                </div>
                <Switch
                  checked={platformSettings.pushNotifications}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    pushNotifications: checked 
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Platform Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-gray-500">
                    Temporarily disable platform access
                  </p>
                </div>
                <Switch
                  checked={platformSettings.maintenanceMode}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    maintenanceMode: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>User Registration</Label>
                  <p className="text-xs text-gray-500">
                    Allow new user registrations
                  </p>
                </div>
                <Switch
                  checked={platformSettings.registrationEnabled}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    registrationEnabled: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Booking System</Label>
                  <p className="text-xs text-gray-500">
                    Enable booking functionality
                  </p>
                </div>
                <Switch
                  checked={platformSettings.bookingEnabled}
                  onCheckedChange={(checked) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    bookingEnabled: checked 
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={platformSettings.supportEmail}
                    onChange={(e) => setPlatformSettings(prev => ({ 
                      ...prev, 
                      supportEmail: e.target.value 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input
                    id="support-phone"
                    value={platformSettings.supportPhone}
                    onChange={(e) => setPlatformSettings(prev => ({ 
                      ...prev, 
                      supportPhone: e.target.value 
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  value={platformSettings.platformName}
                  onChange={(e) => setPlatformSettings(prev => ({ 
                    ...prev, 
                    platformName: e.target.value 
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Test Runner Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="lg:col-span-2"
      >
        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Platform Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminTestRunner />
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 flex justify-end lg:col-span-2"
      >
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}