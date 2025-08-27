import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle, Search, Star, Users, Sparkles, TrendingUp, Shield, Award, Globe, Zap } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreativeCard } from "@/components/creative-card"
import { CategoryCard } from "@/components/category-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { AnimatedCounter } from "@/components/animated-counter"
import { InteractiveMap } from "@/components/interactive-map"
import { FloatingCard } from "@/components/floating-card"
import { ParallaxText } from "@/components/parallax-text"
import { UnifiedDatabaseService } from "@/lib/services/unified-database-service"
import { InlineLoading } from "@/components/ui/global-loading"
import type { CreativeProfile } from "@/lib/database/types"

export default function HomePage() {
  const [featuredCreatives, setFeaturedCreatives] = useState<CreativeProfile[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalCreatives: 0,
    totalProjects: 0,
    totalClients: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      const [creativesData, statsData, testimonialsData] = await Promise.all([
        UnifiedDatabaseService.getFeaturedCreatives(6),
        UnifiedDatabaseService.getCreativeStats(),
        UnifiedDatabaseService.getTestimonials(6)
      ])
      
      setFeaturedCreatives(creativesData)
      setStats(statsData)
      setTestimonials(testimonialsData)
    } catch (error) {
      console.error('Failed to load home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All creative professionals are thoroughly vetted and verified for quality assurance"
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book creative services instantly with our streamlined booking system"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee with our quality assurance program"
    },
    {
      icon: Globe,
      title: "Tanzania-Wide",
      description: "Connect with creative talent across all regions of Tanzania"
    }
  ]

  const mockTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Tanzania",
      location: "Dar es Salaam",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "Brand Connect helped us find an amazing graphic designer who completely transformed our brand identity. The quality of work exceeded our expectations!",
      rating: 5,
      category: "Graphic Design",
      videoUrl: "#"
    },
    {
      id: 2,
      name: "David Mwalimu",
      role: "Event Coordinator",
      company: "Kilimanjaro Events",
      location: "Arusha",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "The photographer we hired through Brand Connect captured our corporate event beautifully. Professional, punctual, and incredibly talented!",
      rating: 5,
      category: "Photography",
      videoUrl: "#"
    },
    {
      id: 3,
      name: "Grace Kimaro",
      role: "Restaurant Owner",
      company: "Mama's Kitchen",
      location: "Mwanza",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "Our social media presence has grown tremendously since working with the digital marketer we found on Brand Connect. Highly recommended!",
      rating: 5,
      category: "Digital Marketing",
      videoUrl: "#"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="hero-section relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-brand relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:grid-cols-2 items-center">
            <motion.div 
              className="flex flex-col justify-center space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900/30 rounded-full text-brand-700 dark:text-brand-300 text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  Tanzania's Premier Creative Marketplace
                </motion.div>
                
                <h1 className="heading-primary">
                  Connect with Tanzania's
                  <span className="text-gradient block mt-2">
                    Top Creative Talent
                  </span>
                </h1>
                
                <p className="text-body-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Discover verified graphic designers, photographers, videographers, and digital marketers 
                  across Tanzania. Build your brand with trusted creative professionals.
                </p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="/register" className="flex-1 sm:flex-none">
                  <Button className="btn-primary btn-lg w-full sm:w-auto group">
                    <Users className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Join as a Client
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/register" className="flex-1 sm:flex-none">
                  <Button className="btn-outline btn-lg w-full sm:w-auto group">
                    <Award className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Join as a Creative
                  </Button>
                </Link>
              </motion.div>
              
              {/* Enhanced Search Widget */}
              <motion.div 
                className="card-premium"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
                    <Search className="w-5 h-5" />
                    <span className="font-semibold">Find Creative Talent</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select defaultValue="service">
                      <SelectTrigger className="professional-input">
                        <SelectValue placeholder="Service Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graphic-design">Graphic Design</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="videography">Videography</SelectItem>
                        <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                        <SelectItem value="web-design">Web Design</SelectItem>
                        <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="location">
                      <SelectTrigger className="professional-input">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dar-es-salaam">Dar es Salaam</SelectItem>
                        <SelectItem value="arusha">Arusha</SelectItem>
                        <SelectItem value="mwanza">Mwanza</SelectItem>
                        <SelectItem value="dodoma">Dodoma</SelectItem>
                        <SelectItem value="mbeya">Mbeya</SelectItem>
                        <SelectItem value="tanga">Tanga</SelectItem>
                      </SelectContent>
                    </Select>
                    <Link to="/search">
                      <Button className="professional-button w-full group">
                        <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Search Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Hero Visual */}
            <motion.div 
              className="flex items-center justify-center relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Main Hero Image */}
                <div className="relative h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] lg:h-[600px] lg:w-[600px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-teal-400/20 rounded-3xl animate-glow" />
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Creative professionals collaborating"
                    className="object-cover rounded-3xl w-full h-full shadow-2xl"
                  />
                  
                  {/* Floating Elements */}
                  <FloatingCard delay={0} className="absolute -top-4 -right-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-brand-200/50">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">500+ Active Creatives</span>
                      </div>
                    </div>
                  </FloatingCard>
                  
                  <FloatingCard delay={1} className="absolute -bottom-4 -left-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-teal-200/50">
                      <div className="flex items-center gap-3">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">4.9★ Average Rating</span>
                      </div>
                    </div>
                  </FloatingCard>
                  
                  <FloatingCard delay={2} className="absolute top-1/2 -right-8 transform -translate-y-1/2">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-purple-200/50">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium">Growing Fast</span>
                      </div>
                    </div>
                  </FloatingCard>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-300/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Enhanced Features Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-brand">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary mb-6">Why Choose Brand Connect?</h2>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing how businesses connect with creative talent across Tanzania, 
              providing a trusted platform that ensures quality, reliability, and success.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="professional-card p-8 text-center hover-lift group-hover:border-brand-300 dark:group-hover:border-brand-700">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-h5 mb-4 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="feature-section">
        <div className="container-brand">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary mb-6">Creative Services</h2>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover top creative professionals across Tanzania in these specialized categories
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                title: "Graphic Design",
                icon: "Palette",
                description: "Logo design, branding, print materials, and visual identity",
                href: "/search?category=graphic-design",
                count: "150+ Designers"
              },
              {
                title: "Photography",
                icon: "Camera", 
                description: "Events, portraits, product photography, and commercial shoots",
                href: "/search?category=photography",
                count: "200+ Photographers"
              },
              {
                title: "Videography",
                icon: "Video",
                description: "Event coverage, promotional videos, documentaries, and more",
                href: "/search?category=videography", 
                count: "80+ Videographers"
              },
              {
                title: "Digital Marketing",
                icon: "BarChart",
                description: "Social media, SEO, content marketing, and online advertising",
                href: "/search?category=digital-marketing",
                count: "120+ Marketers"
              },
              {
                title: "Web Design",
                icon: "Monitor",
                description: "Website design, development, and user experience optimization",
                href: "/search?category=web-design",
                count: "90+ Developers"
              },
              {
                title: "UI/UX Design",
                icon: "Smartphone",
                description: "User interface design, user experience, and app design",
                href: "/search?category=ui-ux-design",
                count: "60+ Designers"
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CategoryCard
                  title={category.title}
                  icon={category.icon}
                  description={category.description}
                  href={category.href}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-brand">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary mb-6">How It Works</h2>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with creative professionals in just three simple steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-brand-300 to-teal-300 transform -translate-y-1/2" />
            
            {[
              {
                step: "01",
                icon: Search,
                title: "Search & Discover",
                description: "Browse verified creative professionals based on your location, budget, and project requirements"
              },
              {
                step: "02", 
                icon: Users,
                title: "Connect & Review",
                description: "Review portfolios, ratings, and testimonials. Contact professionals directly through our platform"
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Collaborate & Succeed",
                description: "Hire and work with the best creative talent. Manage projects and payments securely"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="professional-card p-8 hover-lift relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl mb-6 shadow-xl">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  
                  <h3 className="text-h4 mb-4">{step.title}</h3>
                  <p className="text-body-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Creatives Section */}
      <section className="feature-section">
        <div className="container-brand">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary mb-6">Featured Creative Professionals</h2>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover top-rated creative professionals who are making a difference across Tanzania
            </p>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="professional-card p-6">
                  <div className="loading-skeleton h-48 w-full mb-4 rounded-xl" />
                  <div className="loading-skeleton h-6 w-3/4 mb-2" />
                  <div className="loading-skeleton h-4 w-1/2 mb-4" />
                  <div className="loading-skeleton h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCreatives.map((creative, index) => (
                <motion.div
                  key={creative.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CreativeCard
                    name={creative.title || 'Creative Professional'}
                    title={creative.category}
                    location={creative.location || 'Tanzania'}
                    rating={creative.rating || 0}
                    reviews={creative.reviews_count || 0}
                    imageSrc={creative.avatar_url || "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"}
                    href={`/profile/${creative.id}`}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/search">
              <Button className="btn-outline btn-lg group">
                View All Creative Professionals
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="section-padding bg-gradient-brand text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="container-brand relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-h2 mb-6 text-white">Trusted by Thousands</h2>
            <p className="text-body-lg text-brand-100 max-w-3xl mx-auto">
              Join the growing community of successful businesses and creative professionals
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Creative Professionals", value: stats.totalCreatives, suffix: "+" },
              { label: "Successful Projects", value: stats.totalProjects, suffix: "+" },
              { label: "Happy Clients", value: stats.totalClients, suffix: "+" },
              { label: "Average Rating", value: stats.averageRating, suffix: "★" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-brand-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-brand">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary mb-6">What Our Community Says</h2>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from clients and creative professionals who are building success together
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Interactive Map Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-secondary mb-6">Connecting Tanzania's Creative Talent</h2>
              <p className="text-body-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                From Dar es Salaam to Arusha, from Mwanza to Mbeya, we're building bridges 
                between businesses and creative professionals across all regions of Tanzania.
              </p>
              
              <div className="space-y-4">
                {[
                  "500+ verified creative professionals",
                  "Coverage across all major Tanzanian cities", 
                  "Local expertise with global standards",
                  "Supporting Tanzania's creative economy"
                ].map((point, index) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-brand-500 rounded-full" />
                    <span className="text-body text-gray-700 dark:text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-96"
            >
              <InteractiveMap />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Scrolling Text */}
      <section className="py-12 bg-brand-600 text-white overflow-hidden">
        <ParallaxText baseVelocity={-5}>
          Creative Excellence • Professional Quality • Trusted Platform • Tanzania's Best •
        </ParallaxText>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta-section relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 via-brand-700/90 to-brand-800/90" />
        <div className="container-brand relative z-10">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-h1 mb-6 text-white">Ready to Get Started?</h2>
            <p className="text-body-xl mb-10 text-brand-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses and creative professionals who are already 
              building success together on Brand Connect
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link to="/register">
                <Button className="bg-white text-brand-600 hover:bg-gray-100 btn-xl group shadow-2xl">
                  <Users className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Join as a Client
                </Button>
              </Link>
              <Link to="/register">
                <Button className="border-2 border-white bg-transparent text-white hover:bg-white/10 btn-xl group">
                  <Award className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Join as a Creative
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex items-center justify-center gap-8 text-brand-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm">Quality Guaranteed</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}