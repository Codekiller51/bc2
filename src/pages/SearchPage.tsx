"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, MapPin, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreativeCard } from "@/components/creative-card"
import { EnhancedSearchFilters } from "@/components/enhanced-search-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UnifiedDatabaseService } from "@/lib/services/unified-database-service"
import { InlineLoading } from "@/components/ui/global-loading"
import type { CreativeProfile } from "@/lib/database/types"

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<CreativeProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  const [filters, setFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    minRating: 0,
    maxPrice: 500000,
    experienceLevel: [] as string[],
    availability: [] as string[],
    skills: [] as string[],
    responseTime: "",
    projectSize: ""
  })

  useEffect(() => {
    loadCreatives()
  }, [filters, sortBy])

  const loadCreatives = async () => {
    try {
      setLoading(true)
      const searchFilters: any = {}
      
      if (filters.categories.length > 0) {
        searchFilters.categories = filters.categories
      }
      
      if (filters.locations.length > 0) {
        searchFilters.locations = filters.locations
      }
      
      if (searchQuery) {
        searchFilters.search = searchQuery
      }

      if (filters.minRating > 0) {
        searchFilters.minRating = filters.minRating
      }

      if (filters.maxPrice < 500000) {
        searchFilters.maxPrice = filters.maxPrice
      }

      if (filters.experienceLevel.length > 0) {
        searchFilters.experienceLevel = filters.experienceLevel
      }

      if (filters.availability.length > 0) {
        searchFilters.availability = filters.availability
      }
      
      if (filters.skills.length > 0) {
        searchFilters.skills = filters.skills
      }

      let data = await UnifiedDatabaseService.getCreativeProfiles(searchFilters)
      
      // Apply sorting
      switch (sortBy) {
        case 'rating':
          data = data.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'price-low':
          data = data.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0))
          break
        case 'price-high':
          data = data.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0))
          break
        case 'reviews':
          data = data.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
          break
        case 'newest':
          data = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          break
      }
      
      setSearchResults(data)
    } catch (error) {
      console.error('Failed to load creatives:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadCreatives()
  }

  const getActiveFilterCount = () => {
    return filters.categories.length + 
           filters.locations.length + 
           filters.experienceLevel.length + 
           filters.availability.length + 
           filters.skills.length +
           (filters.minRating > 0 ? 1 : 0) +
           (filters.maxPrice < 500000 ? 1 : 0) +
           (filters.responseTime ? 1 : 0) +
           (filters.projectSize ? 1 : 0)
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      minRating: 0,
      maxPrice: 500000,
      experienceLevel: [],
      availability: [],
      skills: [],
      responseTime: "",
      projectSize: ""
    })
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-h1 mb-4">Find Creative Professionals</h1>
        <p className="text-body-lg text-muted-foreground mb-6">
          Discover verified creative talent across Tanzania based on your location and needs
        </p>
        
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, skill, or keyword" 
              className="form-input w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            className="btn-primary w-full md:w-auto"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.categories.map(category => (
              <Badge key={category} variant="secondary" className="cursor-pointer" onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  categories: prev.categories.filter(c => c !== category)
                }))
              }}>
                {category} ×
              </Badge>
            ))}
            {filters.locations.map(location => (
              <Badge key={location} variant="secondary" className="cursor-pointer" onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  locations: prev.locations.filter(l => l !== location)
                }))
              }}>
                📍 {location} ×
              </Badge>
            ))}
            {filters.minRating > 0 && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => {
                setFilters(prev => ({ ...prev, minRating: 0 }))
              }}>
                ⭐ {filters.minRating}+ Stars ×
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <EnhancedSearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearAllFilters}
            activeFilterCount={getActiveFilterCount()}
          />
        </div>
        
        {/* Results */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {loading ? 'Searching...' : `${searchResults.length} Creative${searchResults.length !== 1 ? 's' : ''} Found`}
              </h2>
              {searchQuery && (
                <p className="text-gray-600 dark:text-gray-400">
                  Results for "{searchQuery}"
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <InlineLoading size="lg" message="Searching for creative professionals..." />
            </div>
          ) : searchResults.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No creatives found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or browse all available creatives
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {searchResults.map((creative) => (
                <CreativeCard
                  key={creative.id}
                  name={creative.title || 'Creative Professional'}
                  title={creative.category}
                  location={creative.location || 'Tanzania'}
                  rating={creative.rating || 0}
                  reviews={creative.reviews_count || 0}
                  imageSrc={creative.avatar_url || "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"}
                  href={`/profile/${creative.id}`}
                  hourlyRate={creative.hourly_rate}
                  skills={creative.skills || []}
                  completedProjects={creative.completed_projects || 0}
                  verified={creative.approval_status === 'approved'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && searchResults.length > 0 && (
        <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <span className="sr-only">Previous page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">Next page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </nav>
        </div>
      )}
    </div>
  )
}