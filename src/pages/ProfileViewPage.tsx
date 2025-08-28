import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Eye, 
  MessageSquare,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useParams, Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatCurrency } from '@/lib/utils/format'
import { ReviewDisplay } from '@/components/review-system'

export default function ProfileViewPage() {
  const { slug } = useParams()
  const [creative, setCreative] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      loadCreativeProfile()
    }
  }, [slug])

  const loadCreativeProfile = async () => {
    if (!slug) return

    try {
      setLoading(true)
      setError(null)
      
      const creativeData = await UnifiedDatabaseService.getCreativeProfileById(slug)
      if (!creativeData) {
        throw new Error('Creative professional not found')
      }
      
      setCreative(creativeData)
      
      // Load reviews
      const reviewsData = await UnifiedDatabaseService.getReviews(slug)
      setReviews(reviewsData)
    } catch (error) {
      console.error('Failed to load creative profile:', error)
      setError('Failed to load creative profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading profile..." />
        </div>
      </div>
    )
  }

  if (error || !creative) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The creative professional you\'re looking for doesn\'t exist.'}
          </p>
          <Link to="/search">
            <Button className="btn-primary">
              Browse Creatives
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={creative.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${creative.title}&backgroundColor=059669&textColor=ffffff`} 
              alt={creative.title} 
            />
            <AvatarFallback className="text-2xl">
              {creative.title.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {creative.title}
              </h1>
              {creative.approval_status === 'approved' && (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
            </div>
            
            <Badge className="bg-emerald-100 text-emerald-800 mb-3">
              {creative.category}
            </Badge>
            
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{creative.location}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{creative.rating?.toFixed(1)} ({creative.reviews_count} reviews)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>{creative.completed_projects} projects</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to={`/booking?creative=${creative.id}`}>
              <Button className="btn-primary">
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </Link>
            
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {creative.bio || 'No bio available.'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills */}
          {creative.skills && creative.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {creative.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Portfolio */}
          {creative.portfolio_items && creative.portfolio_items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {creative.portfolio_items.map((item, index) => (
                      <div key={item.id} className="group">
                        <div className="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Eye className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          
                          {item.project_url && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                onClick={() => window.open(item.project_url, '_blank')}
                                size="sm"
                                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Project
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          <h4 className="font-semibold">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.description}
                            </p>
                          )}
                          {item.category && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ReviewDisplay reviews={reviews} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Services */}
          {creative.services && creative.services.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {creative.services.map((service, index) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{service.name}</h4>
                        <span className="text-emerald-600 font-bold">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                      
                      {service.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {service.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{service.duration} min</span>
                        </div>
                        
                        <Link to={`/booking?creative=${creative.id}&service=${service.id}`}>
                          <Button size="sm" className="btn-primary">
                            Book
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {creative.rating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {creative.completed_projects || 0}
                  </div>
                  <div className="text-sm text-gray-500">Completed Projects</div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {creative.reviews_count || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Reviews</div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <Badge className={
                    creative.availability_status === 'available' ? 'bg-green-100 text-green-800' :
                    creative.availability_status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {creative.availability_status === 'available' ? 'Available' :
                     creative.availability_status === 'busy' ? 'Busy' :
                     'Unavailable'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={`/booking?creative=${creative.id}`}>
                  <Button className="w-full btn-primary">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Service
                  </Button>
                </Link>
                
                <Button className="w-full btn-outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                
                {creative.portfolio_url && (
                  <Button 
                    onClick={() => window.open(creative.portfolio_url, '_blank')}
                    className="w-full btn-outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Portfolio
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}