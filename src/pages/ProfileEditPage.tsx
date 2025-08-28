import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Upload, X, Plus, AlertTriangle, Camera } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { AvatarUploadService } from '@/lib/services/avatar-upload-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { toast } from 'sonner'

export default function ProfileEditPage() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    avatar_url: '',
    
    // Client specific
    company_name: '',
    industry: '',
    
    // Creative specific
    title: '',
    category: '',
    bio: '',
    hourly_rate: 0,
    skills: [] as string[]
  })

  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (user) {
      loadProfileData()
    }
  }, [user])

  const loadProfileData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Set basic user data
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        avatar_url: user.avatar_url || '',
        company_name: user.company_name || '',
        industry: user.industry || ''
      }))

      setAvatarPreview(user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=059669&textColor=ffffff`)

      // Load creative profile if user is creative
      if (user.role === 'creative') {
        const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
        if (creativeProfile) {
          setProfile(creativeProfile)
          setFormData(prev => ({
            ...prev,
            title: creativeProfile.title || '',
            category: creativeProfile.category || '',
            bio: creativeProfile.bio || '',
            hourly_rate: creativeProfile.hourly_rate || 0,
            skills: creativeProfile.skills || []
          }))
        }
      }
    } catch (error) {
      console.error('Failed to load profile data:', error)
      setError('Failed to load profile data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validation = AvatarUploadService.validateFile(file)
      if (!validation.isValid) {
        toast.error(validation.error)
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      let avatarUrl = formData.avatar_url

      // Upload new avatar if selected
      if (avatarFile) {
        const uploadResult = await AvatarUploadService.uploadAvatar(avatarFile, user.id)
        if (uploadResult.success && uploadResult.url) {
          avatarUrl = uploadResult.url
        }
      }

      // Update user profile
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        avatar_url: avatarUrl,
        company_name: formData.company_name,
        industry: formData.industry
      })

      // Update creative profile if user is creative
      if (user.role === 'creative' && profile) {
        await UnifiedDatabaseService.updateCreativeProfile(profile.id, {
          title: formData.title,
          category: formData.category,
          bio: formData.bio,
          hourly_rate: formData.hourly_rate,
          skills: formData.skills,
          avatar_url: avatarUrl,
          location: formData.location,
          phone: formData.phone,
          email: user.email
        })
      } else if (user.role === 'client') {
        await UnifiedDatabaseService.updateClientProfile(user.id, {
          full_name: formData.name,
          phone: formData.phone,
          location: formData.location,
          company_name: formData.company_name,
          industry: formData.industry,
          avatar_url: avatarUrl
        })
      }

      toast.success('Profile updated successfully!')
      navigate('/profile')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading profile editor..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadProfileData} className="btn-primary">
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
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your profile information and settings
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block mb-6">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={avatarPreview} alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {formData.name.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-emerald-600 text-white p-3 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the camera icon to upload a new photo
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+255 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                      <SelectItem value="Arusha">Arusha</SelectItem>
                      <SelectItem value="Mwanza">Mwanza</SelectItem>
                      <SelectItem value="Dodoma">Dodoma</SelectItem>
                      <SelectItem value="Mbeya">Mbeya</SelectItem>
                      <SelectItem value="Tanga">Tanga</SelectItem>
                      <SelectItem value="Morogoro">Morogoro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Role-specific Information */}
          {user.role === 'creative' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Graphic Designer"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell clients about your experience and expertise..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (TZS)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      min="0"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: Number(e.target.value) }))}
                      placeholder="50000"
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
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {user.role === 'client' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Save Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-end gap-4"
          >
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
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
          </motion.div>
        </div>
      </div>
    </div>
  )
}