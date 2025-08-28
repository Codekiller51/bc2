import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, Play, MapPin, Filter, Search, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TestimonialCard } from '@/components/testimonial-card'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const data = await UnifiedDatabaseService.getTestimonials(20)
      
      // Add mock testimonials if no real data
      const mockTestimonials = [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Marketing Director",
          company: "TechStart Tanzania",
          location: "Dar es Salaam",
          image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
          content: "Brand Connect helped us find an amazing graphic designer who completely transformed our brand identity. The quality of work exceeded our expectations, and the process was seamless from start to finish.",
          rating: 5,
          category: "Graphic Design",
          videoUrl: "#",
          project: "Complete Brand Identity Redesign",
          result: "300% increase in brand recognition"
        },
        {
          id: 2,
          name: "David Mwalimu",
          role: "Event Coordinator",
          company: "Kilimanjaro Events",
          location: "Arusha",
          image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
          content: "The photographer we hired through Brand Connect captured our corporate event beautifully. Professional, punctual, and incredibly talented! The photos exceeded our expectations and really captured the essence of our event.",
          rating: 5,
          category: "Photography",
          videoUrl: "#",
          project: "Corporate Event Photography",
          result: "500+ high-quality event photos"
        },
        {
          id: 3,
          name: "Grace Kimaro",
          role: "Restaurant Owner",
          company: "Mama's Kitchen",
          location: "Mwanza",
          image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
          content: "Our social media presence has grown tremendously since working with the digital marketer we found on Brand Connect. They understood our local market perfectly and created content that resonates with our customers.",
          rating: 5,
          category: "Digital Marketing",
          videoUrl: "#",
          project: "Social Media Strategy & Management",
          result: "400% increase in social media engagement"
        },
        {
          id: 4,
          name: "Michael Juma",
          role: "CEO",
          company: "Safari Adventures",
          location: "Arusha",
          image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
          content: "The videographer created an incredible promotional video for our safari company. The cinematography was stunning and really showcased the beauty of Tanzania. Our bookings increased significantly after launching the video.",
          rating: 5,
          category: "Videography",
          videoUrl: "#",
          project: "Safari Promotional Video",
          result: "250% increase in online bookings"
        },
        {
          id: 5,
          name: "Amina Hassan",
          role: "Boutique Owner",
          company: "Zanzibar Fashion",
          location: "Stone Town",
          image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
          content: "The web designer we found on Brand Connect created a beautiful e-commerce website for our boutique. The design perfectly captures our brand aesthetic and the functionality is excellent. Our online sales have tripled!",
          rating: 5,
          category: "Web Design",
          videoUrl: "#",
          project: "E-commerce Website Development",
          result: "300% increase in online sales"
        },
        {
          id: 6,
          name: "John Kimaro",
          role: "NGO Director",
          company: "Education for All Tanzania",
          location: "Dodoma",
          image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
          content: "Brand Connect connected us with a talented content writer who helped us create compelling grant proposals and marketing materials. Their understanding of the local context was invaluable.",
          rating: 5,
          category: "Content Writing",
          videoUrl: "#",
          project: "Grant Proposal & Marketing Content",
          result: "Successfully secured 3 major grants"
        }
      ]

      setTestimonials([...data, ...mockTestimonials])
    } catch (error) {
      console.error('Failed to load testimonials:', error)
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'Graphic Design', 'Photography', 'Videography', 'Digital Marketing', 'Web Design', 'Content Writing']
  const ratings = ['all', '5', '4', '3']

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = !searchQuery || 
      testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || testimonial.category === selectedCategory
    const matchesRating = selectedRating === 'all' || testimonial.rating >= parseInt(selectedRating)
    
    return matchesSearch && matchesCategory && matchesRating
  })

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover how businesses across Tanzania are achieving success with our creative professionals
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratings.map(rating => (
                    <SelectItem key={rating} value={rating}>
                      {rating === 'all' ? 'All Ratings' : `${rating}+ Stars`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Happy Clients</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-2">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading success stories..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      )}

      {filteredTestimonials.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No testimonials found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or browse all testimonials
          </p>
        </div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16"
      >
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Create Your Success Story?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of satisfied clients who have found their perfect creative match on Brand Connect
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="btn-primary">
                Find Creative Professionals
              </Button>
              <Button variant="outline">
                Join as a Creative
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}