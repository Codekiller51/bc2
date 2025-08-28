import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, Palette, Save, Eye, EyeOff, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { toast } from 'sonner'

export default function DashboardSettingsPage() {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    title: '',
    category: '',
    bio: '',
    hourly_rate: 0,
    skills: [],
    location: '',
    phone: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (user) {
      loadCreativeProfile()
    }
  }, [user])

  const loadCreativeProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
      
      if (creativeProfile) {
        setProfile(creativeProfile)
        setProfileData({
          title: creativeProfile.title || '',
          category: creativeProfile.category || '',
          bio: creativeProfile.bio || '',
          hourly_rate: creativeProfile.hourly_rate || 0,
          skills: creativeProfile.skills || [],
          location: creativeProfile.location || '',
          phone: creativeProfile.phone || ''
        })
      }
    } catch (error) {
      console.error('Failed to load creative profile:', error)
      setError('Failed to load profile data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      setSaving(true)
      await UnifiedDatabaseService.updateCreativeProfile(profile.id, {
        title: profileData.title,
        category: profileData.category,
        bio: profileData.bio,
        hourly_rate: profileData.hourly_rate,
        skills: profileData.skills,
        location: profileData.location,
        phone: profileData.phone
      })

      toast.success('Profile updated successfully!')
      await loadCreativeProfile()
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    try {
      setSaving(true)
      await UnifiedDatabaseService.updatePassword(passwordData.currentPassword, passwordData.newPassword)
      
      toast.success('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)
    } catch (error) {
      console.error('Failed to update password:', error)
      toast.error('Failed to update password. Please check your current password.')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading settings..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadCreativeProfile} className="btn-primary">
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
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your professional profile and account settings
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={profileData.title}
                      onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Graphic Designer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={profileData.category}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Videography">Videography</SelectItem>
                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                        <SelectItem value="Web Design">Web Design</SelectItem>
                        <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell clients about your experience and expertise..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (TZS)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      min="0"
                      value={profileData.hourly_rate}
                      onChange={(e) => setProfileData(prev => ({ ...prev, hourly_rate: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your city/region"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+255 123 456 789"
                  />
                </div>

                {/* Skills Management */}
                <div>
                  <Label>Skills & Expertise</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profileData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
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
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Password Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Password & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showPasswordForm ? (
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Keep your account secure by using a strong password
                    </p>
                    <Button
                      onClick={() => setShowPasswordForm(true)}
                      variant="outline"
                    >
                      Change Password
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="btn-primary"
                      >
                        {saving ? 'Updating...' : 'Update Password'}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowPasswordForm(false)
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          })
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Profile Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Approval Status</span>
                  <Badge className={
                    profile?.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                    profile?.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {profile?.approval_status || 'Unknown'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Visibility</span>
                  <Badge className={profile?.approval_status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {profile?.approval_status === 'approved' ? 'Public' : 'Hidden'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Availability</span>
                  <Badge className={profile?.availability_status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {profile?.availability_status || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {profile?.rating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile?.completed_projects || 0}
                  </div>
                  <div className="text-sm text-gray-500">Completed Projects</div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile?.reviews_count || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Reviews</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Help & Support */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get support with your creative profile and bookings
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="h-4 w-4 mr-2" />
                    Creative Guidelines
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}