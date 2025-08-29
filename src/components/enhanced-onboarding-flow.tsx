"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Camera, 
  Briefcase, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Plus,
  X,
  Sparkles,
  Target,
  Users,
  Award
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/enhanced-auth-provider"
import { AvatarUploadService } from "@/lib/services/avatar-upload-service"
import { UnifiedDatabaseService } from "@/lib/services/unified-database-service"
import { toast } from "sonner"

interface OnboardingFlowProps {
  onComplete: () => void
  userType: 'client' | 'creative'
}

export function EnhancedOnboardingFlow({ onComplete, userType }: OnboardingFlowProps) {
  const { user, updateProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  const totalSteps = userType === 'creative' ? 5 : 4

  const [profileData, setProfileData] = useState({
    // Basic Info
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    avatar_url: user?.avatar_url || "",
    
    // Client specific
    company_name: "",
    industry: "",
    goals: [] as string[],
    
    // Creative specific
    title: "",
    category: "",
    bio: "",
    hourly_rate: 50000,
    skills: [] as string[],
    experience_level: "",
    
    // Portfolio
    portfolio_items: [] as Array<{
      title: string
      description: string
      category: string
      image_url?: string
    }>
  })

  const [newSkill, setNewSkill] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: "",
    description: "",
    category: ""
  })

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        full_name: user?.full_name || "",
        phone: user.phone || "",
        location: user.location || "",
        avatar_url: user.avatar_url || ""
      }))
      
      if (!user.avatar_url) {
        const defaultAvatar = AvatarUploadService.getAvatarUrl(user.id)
        setAvatarPreview(defaultAvatar)
      } else {
        setAvatarPreview(user.avatar_url)
      }
    }
  }, [user])

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
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addGoal = () => {
    if (newGoal.trim() && !profileData.goals.includes(newGoal.trim())) {
      setProfileData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }))
      setNewGoal("")
    }
  }

  const removeGoal = (goalToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal !== goalToRemove)
    }))
  }

  const addPortfolioItem = () => {
    if (newPortfolioItem.title.trim() && newPortfolioItem.description.trim()) {
      setProfileData(prev => ({
        ...prev,
        portfolio_items: [...prev.portfolio_items, { ...newPortfolioItem }]
      }))
      setNewPortfolioItem({ title: "", description: "", category: "" })
    }
  }

  const removePortfolioItem = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      portfolio_items: prev.portfolio_items.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    if (!user) return

    setLoading(true)
    try {
      let avatarUrl = profileData.avatar_url

      // Upload avatar if a new file was selected
      if (avatarFile) {
        const uploadResult = await AvatarUploadService.uploadAvatar(avatarFile, user.id)
        if (uploadResult.success && uploadResult.url) {
          avatarUrl = uploadResult.url
        }
      }

      // Update user profile
      await updateProfile({
        full_name: profileData.full_name,
        phone: profileData.phone,
        location: profileData.location,
        avatar_url: avatarUrl
      })

      if (userType === 'creative') {
        // Update creative profile
        const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
        if (creativeProfile) {
          await UnifiedDatabaseService.updateCreativeProfile(creativeProfile.id, {
            title: profileData.title,
            category: profileData.category,
            bio: profileData.bio,
            hourly_rate: profileData.hourly_rate,
            skills: profileData.skills,
            avatar_url: avatarUrl
          })

          // Add portfolio items
          for (const item of profileData.portfolio_items) {
            await UnifiedDatabaseService.createPortfolioItem({
              creative_id: creativeProfile.id,
              title: item.title,
              description: item.description,
              category: item.category
            })
          }
        }
      } else {
        // Update client profile
        await UnifiedDatabaseService.updateClientProfile(user.id, {
          full_name: profileData.full_name,
          phone: profileData.phone,
          location: profileData.location,
          company_name: profileData.company_name,
          industry: profileData.industry,
          avatar_url: avatarUrl
        })
      }

      toast.success('Welcome to Brand Connect! Your profile is now complete.')
      onComplete()
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      toast.error('Failed to complete setup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Welcome to Brand Connect"
      case 2: return "Basic Information"
      case 3: return userType === 'creative' ? "Professional Details" : "Company Information"
      case 4: return userType === 'creative' ? "Skills & Expertise" : "Your Goals"
      case 5: return "Portfolio & Showcase"
      default: return "Getting Started"
    }
  }

  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-hero py-12">
      <div className="container px-4 mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">BC</span>
              </div>
              <h1 className="text-3xl font-bold">Brand Connect</h1>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{getStepTitle()}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {currentStep === 1 ? "Let's get you set up on Tanzania's premier creative marketplace" :
               `Step ${currentStep} of ${totalSteps} - Let's complete your profile`}
            </p>
            
            {/* Progress */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>

          {/* Step Content */}
          <Card className="shadow-2xl border-0">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Welcome */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center space-y-8"
                  >
                    <div className="space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                        {userType === 'creative' ? (
                          <Award className="h-12 w-12 text-white" />
                        ) : (
                          <Users className="h-12 w-12 text-white" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          Welcome, {userType === 'creative' ? 'Creative Professional' : 'Valued Client'}!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                          {userType === 'creative' 
                            ? "You're about to join Tanzania's most trusted creative marketplace. Let's set up your professional profile to start attracting clients and building your creative business."
                            : "You're about to discover amazing creative talent across Tanzania. Let's set up your profile so you can easily connect with the perfect creative professionals for your projects."
                          }
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <div className="text-center p-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h4 className="font-semibold mb-2">Get Discovered</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {userType === 'creative' ? 'Showcase your work to potential clients' : 'Find the perfect creative match'}
                          </p>
                        </div>
                        
                        <div className="text-center p-4">
                          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h4 className="font-semibold mb-2">Build Trust</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {userType === 'creative' ? 'Get verified and build credibility' : 'Work with verified professionals'}
                          </p>
                        </div>
                        
                        <div className="text-center p-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h4 className="font-semibold mb-2">Grow Together</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {userType === 'creative' ? 'Build lasting client relationships' : 'Support local creative talent'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Basic Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Avatar Upload */}
                    <div className="text-center">
                      <div className="relative inline-block">
                        <Avatar className="h-32 w-32 mx-auto border-4 border-emerald-200 dark:border-emerald-800">
                          <AvatarImage src={avatarPreview} alt="Profile" />
                          <AvatarFallback className="text-3xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                            {profileData.full_name.charAt(0) || 'U'}
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
                          className="absolute bottom-2 right-2 bg-emerald-600 text-white p-3 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg"
                        >
                          <Camera className="h-4 w-4" />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        Add a professional photo to build trust with {userType === 'creative' ? 'clients' : 'creative professionals'}
                      </p>
                    </div>

                    {/* Basic Info Form */}
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={profileData.full_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+255 123 456 789"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Select
                          value={profileData.location}
                          onValueChange={(value) => setProfileData(prev => ({ ...prev, location: value }))}
                        >
                          <SelectTrigger className="mt-2">
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
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Professional/Company Details */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {userType === 'creative' ? (
                      <>
                        <div>
                          <Label htmlFor="title">Professional Title *</Label>
                          <Input
                            id="title"
                            value={profileData.title}
                            onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Senior Graphic Designer, Wedding Photographer"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Primary Category *</Label>
                          <Select
                            value={profileData.category}
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select your primary category" />
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

                        <div>
                          <Label htmlFor="experience_level">Experience Level</Label>
                          <Select
                            value={profileData.experience_level}
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, experience_level: value }))}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Entry Level (0-2 years)">Entry Level (0-2 years)</SelectItem>
                              <SelectItem value="Mid Level (3-5 years)">Mid Level (3-5 years)</SelectItem>
                              <SelectItem value="Senior Level (6-10 years)">Senior Level (6-10 years)</SelectItem>
                              <SelectItem value="Expert Level (10+ years)">Expert Level (10+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="hourly_rate">Starting Hourly Rate (TZS)</Label>
                          <Input
                            id="hourly_rate"
                            type="number"
                            min="0"
                            value={profileData.hourly_rate}
                            onChange={(e) => setProfileData(prev => ({ ...prev, hourly_rate: Number(e.target.value) }))}
                            className="mt-2"
                          />
                          <p className="text-sm text-gray-500 mt-1">You can adjust this later based on project complexity</p>
                        </div>

                        <div>
                          <Label htmlFor="bio">Professional Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell potential clients about your experience, approach, and what makes you unique..."
                            rows={4}
                            className="mt-2"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Label htmlFor="company_name">Company Name</Label>
                          <Input
                            id="company_name"
                            value={profileData.company_name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, company_name: e.target.value }))}
                            placeholder="Your company or organization name"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select
                            value={profileData.industry}
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, industry: value }))}
                          >
                            <SelectTrigger className="mt-2">
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
                              <SelectItem value="nonprofit">Non-Profit</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Skills/Goals */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {userType === 'creative' ? (
                      <>
                        <div>
                          <Label>Skills & Expertise</Label>
                          <p className="text-sm text-gray-500 mb-4">
                            Add your key skills to help clients find you
                          </p>
                          <div className="flex gap-2 mb-3">
                            <Input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add a skill (e.g. Logo Design, Portrait Photography)"
                              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            />
                            <Button onClick={addSkill} variant="outline">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profileData.skills.map((skill, index) => (
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

                        {/* Suggested Skills */}
                        <div>
                          <Label>Popular Skills in Your Category</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['Adobe Photoshop', 'Adobe Illustrator', 'Branding', 'Logo Design', 'Print Design'].map((skill) => (
                              <Button
                                key={skill}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (!profileData.skills.includes(skill)) {
                                    setProfileData(prev => ({
                                      ...prev,
                                      skills: [...prev.skills, skill]
                                    }))
                                  }
                                }}
                                disabled={profileData.skills.includes(skill)}
                              >
                                {skill}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Label>What are your creative goals?</Label>
                          <p className="text-sm text-gray-500 mb-4">
                            Help us understand what you're looking to achieve
                          </p>
                          <div className="flex gap-2 mb-3">
                            <Input
                              value={newGoal}
                              onChange={(e) => setNewGoal(e.target.value)}
                              placeholder="e.g. Rebrand my business, Create marketing materials"
                              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                            />
                            <Button onClick={addGoal} variant="outline">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profileData.goals.map((goal, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                                onClick={() => removeGoal(goal)}
                              >
                                {goal}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Suggested Goals */}
                        <div>
                          <Label>Common Creative Needs</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['Brand Identity', 'Website Design', 'Marketing Materials', 'Product Photography', 'Social Media Content'].map((goal) => (
                              <Button
                                key={goal}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (!profileData.goals.includes(goal)) {
                                    setProfileData(prev => ({
                                      ...prev,
                                      goals: [...prev.goals, goal]
                                    }))
                                  }
                                }}
                                disabled={profileData.goals.includes(goal)}
                              >
                                {goal}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 5: Portfolio (Creative only) */}
                {currentStep === 5 && userType === 'creative' && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label>Portfolio Items (Optional)</Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Add some of your best work to showcase your skills. You can add more later.
                      </p>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={newPortfolioItem.title}
                            onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Project title"
                          />
                          <Select
                            value={newPortfolioItem.category}
                            onValueChange={(value) => setNewPortfolioItem(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Logo Design">Logo Design</SelectItem>
                              <SelectItem value="Web Design">Web Design</SelectItem>
                              <SelectItem value="Photography">Photography</SelectItem>
                              <SelectItem value="Branding">Branding</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          value={newPortfolioItem.description}
                          onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the project, your role, and the results achieved..."
                          rows={3}
                        />
                        <Button onClick={addPortfolioItem} variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Portfolio Item
                        </Button>
                      </div>

                      {/* Portfolio Items List */}
                      {profileData.portfolio_items.length > 0 && (
                        <div className="mt-6 space-y-3">
                          {profileData.portfolio_items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.category}</p>
                                <p className="text-xs text-gray-400 mt-1">{item.description.substring(0, 100)}...</p>
                              </div>
                              <Button
                                onClick={() => removePortfolioItem(index)}
                                variant="ghost"
                                size="sm"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Final Step: Complete */}
                {((userType === 'creative' && currentStep === 5) || (userType === 'client' && currentStep === 4)) && (
                  <motion.div
                    key="final"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center space-y-8"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-4">You're All Set! 🎉</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        {userType === 'creative' 
                          ? "Your creative profile is ready! Our admin team will review your profile within 2-3 business days. Once approved, you'll start receiving booking requests from clients across Tanzania."
                          : "Your client profile is complete! You can now browse and book creative professionals across Tanzania. Start exploring amazing talent and bring your creative projects to life."
                        }
                      </p>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950 p-6 rounded-2xl">
                      <h4 className="font-semibold mb-3">What's Next?</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {userType === 'creative' ? (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Profile review (2-3 days)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Start receiving bookings</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Build your portfolio</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Grow your business</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Browse creative professionals</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Book your first project</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Collaborate seamlessly</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Leave reviews and build relationships</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleComplete}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                  >
                    {loading ? "Setting up..." : "Complete Setup"}
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}