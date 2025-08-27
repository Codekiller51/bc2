import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle, Search, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreativeCard } from "@/components/creative-card"
import { CategoryCard } from "@/components/category-card"
import { UnifiedDatabaseService } from "../../lib/services/unified-database-service"
import { InlineLoading } from "@/components/ui/global-loading"
import type { CreativeProfile } from "@/lib/database/types"

export default function HomePage() {
  const [featuredCreatives, setFeaturedCreatives] = useState<CreativeProfile[]>([])
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
      const [creativesData, statsData] = await Promise.all([
        UnifiedDatabaseService.getFeaturedCreatives(3),
        UnifiedDatabaseService.getCreativeStats()
      ])
      
      setFeaturedCreatives(creativesData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load home data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-brand">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-display text-balance">
                  Connect with Tanzania&apos;s Top Creative Talent
                </h1>
                <p className="max-w-[600px] text-body-lg text-muted-foreground">
                  Find verified graphic designers, photographers, videographers, and digital marketers in your region.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/register">
                  <Button className="btn-primary btn-lg w-full sm:w-auto">
                  Join as a Client
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-outline btn-lg w-full sm:w-auto">
                  Join as a Creative
                  </Button>
                </Link>
              </div>
              <div className="mt-6 card-brand">
                <div className="flex flex-col gap-2">
                  <div className="text-body font-medium">Find Creative Talent</div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select defaultValue="service">
                      <SelectTrigger>
                        <SelectValue placeholder="Service Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graphic-design">Graphic Design</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="videography">Videography</SelectItem>
                        <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="location">
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dar-es-salaam">Dar es Salaam</SelectItem>
                        <SelectItem value="arusha">Arusha</SelectItem>
                        <SelectItem value="mwanza">Mwanza</SelectItem>
                        <SelectItem value="dodoma">Dodoma</SelectItem>
                        <SelectItem value="mbeya">Mbeya</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="btn-primary">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                <img
                  src="/logos/logo-transparent.png"
                  alt="Brand Connect"
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-h1 text-balance">Creative Services</h2>
              <p className="max-w-[900px] text-body-lg text-muted-foreground">
                Discover top creative professionals across Tanzania in these categories
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            <CategoryCard
              title="Graphic Design"
              icon="Palette"
              description="Logo design, branding, print materials, and more"
              href="/search?category=graphic-design"
            />
            <CategoryCard
              title="Photography"
              icon="Camera"
              description="Events, portraits, product photography, and more"
              href="/search?category=photography"
            />
            <CategoryCard
              title="Videography"
              icon="Video"
              description="Event coverage, promotional videos, and more"
              href="/search?category=videography"
            />
            <CategoryCard
              title="Digital Marketing"
              icon="BarChart"
              description="Social media, SEO, content marketing, and more"
              href="/search?category=digital-marketing"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="feature-section">
        <div className="container-brand">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-h1 text-balance">How It Works</h2>
              <p className="max-w-[900px] text-body-lg text-muted-foreground">
                Connect with creative professionals in just a few simple steps
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="card-feature flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                <Search className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-h3">Search</h3>
              <p className="text-body-sm text-muted-foreground">
                Find creative professionals based on your location and service needs
              </p>
            </div>
            <div className="card-feature flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                <Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-h3">Connect</h3>
              <p className="text-body-sm text-muted-foreground">
                Review portfolios, ratings, and contact verified professionals
              </p>
            </div>
            <div className="card-feature flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                <CheckCircle className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-h3">Collaborate</h3>
              <p className="text-body-sm text-muted-foreground">
                Hire and work with the best creative talent in your region
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creatives */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-h1 text-balance">Featured Creatives</h2>
              <p className="max-w-[900px] text-body-lg text-muted-foreground">
                Discover top-rated creative professionals across Tanzania
              </p>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="col-span-full flex justify-center py-12">
                <InlineLoading size="lg" message="Loading featured creatives..." />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {featuredCreatives.map((creative) => (
                <CreativeCard
                  key={creative.id}
                  name={creative.title || 'Creative Professional'}
                  title={creative.category}
                  location={creative.location || 'Tanzania'}
                  rating={creative.rating || 0}
                  reviews={creative.reviews_count || 0}
                  imageSrc={creative.avatar_url || "/placeholder.svg?height=400&width=400"}
                  href={`/profile/${creative.id}`}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Link
              to="/search"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              View all creatives
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="feature-section">
        <div className="container-brand">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-h1 text-balance">What Our Users Say</h2>
              <p className="max-w-[900px] text-body-lg text-muted-foreground">
                Hear from clients and creative professionals who use Brand Connect
              </p>
            </div>
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-h1 font-bold text-brand-600 dark:text-brand-400">
                  {stats.totalCreatives}+
                </div>
                <p className="text-body-sm text-muted-foreground">Creative Professionals</p>
              </div>
              <div className="text-center">
                <div className="text-h1 font-bold text-brand-600 dark:text-brand-400">
                  {stats.totalProjects}+
                </div>
                <p className="text-body-sm text-muted-foreground">Successful Projects</p>
              </div>
              <div className="text-center">
                <div className="text-h1 font-bold text-brand-600 dark:text-brand-400">
                  {stats.totalClients}+
                </div>
                <p className="text-body-sm text-muted-foreground">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="text-h1 font-bold text-brand-600 dark:text-brand-400">
                  {stats.averageRating}
                </div>
                <p className="text-body-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container-brand">
          <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h2 className="text-h1 text-balance">Ready to Connect?</h2>
              <p className="max-w-[900px] text-body-lg">
                Join Brand Connect today and discover the best creative talent across Tanzania
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/register">
                <Button className="bg-white text-brand-600 hover:bg-gray-100 btn-lg">
                Join as a Client
                </Button>
              </Link>
              <Link to="/register">
                <Button className="border border-white bg-transparent text-white hover:bg-white/10 btn-lg">
                Join as a Creative
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}