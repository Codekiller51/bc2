"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, X, Star, MapPin, DollarSign, Clock, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface SearchFilters {
  categories: string[]
  locations: string[]
  minRating: number
  maxPrice: number
  experienceLevel: string[]
  availability: string[]
  skills: string[]
  responseTime: string
  projectSize: string
}

interface EnhancedSearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClearFilters: () => void
  activeFilterCount: number
}

export function EnhancedSearchFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFilterCount
}: EnhancedSearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    'Graphic Design',
    'Photography', 
    'Videography',
    'Digital Marketing',
    'Web Design',
    'UI/UX Design',
    'Content Writing',
    'Social Media Management',
    'Branding',
    'Animation'
  ]

  const locations = [
    'Dar es Salaam',
    'Arusha',
    'Mwanza',
    'Dodoma',
    'Mbeya',
    'Tanga',
    'Morogoro',
    'Tabora',
    'Kigoma',
    'Mtwara'
  ]

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (3-5 years)',
    'Senior Level (6-10 years)',
    'Expert Level (10+ years)'
  ]

  const availabilityOptions = [
    'Available Now',
    'Available This Week',
    'Available This Month',
    'Available Next Month'
  ]

  const popularSkills = [
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe Premiere Pro',
    'Adobe After Effects',
    'Figma',
    'Sketch',
    'WordPress',
    'React',
    'Photography',
    'Video Editing',
    'SEO',
    'Social Media',
    'Copywriting',
    'Brand Strategy'
  ]

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    updateFilter(key, newArray)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Award className="h-4 w-4" />
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleArrayFilter('categories', category)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Locations */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Locations
        </h3>
        <div className="space-y-2">
          {locations.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={filters.locations.includes(location)}
                onCheckedChange={() => toggleArrayFilter('locations', location)}
              />
              <Label htmlFor={`location-${location}`} className="text-sm font-normal">
                {location}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4" />
          Minimum Rating
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.minRating === rating}
                onCheckedChange={(checked) => updateFilter('minRating', checked ? rating : 0)}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm font-normal flex items-center gap-1">
                {rating}+ 
                <div className="flex">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Hourly Rate (TZS)
        </h3>
        <div className="space-y-4">
          <Slider
            value={[filters.maxPrice]}
            onValueChange={(value) => updateFilter('maxPrice', value[0])}
            max={500000}
            min={10000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>TZS 10,000</span>
            <span className="font-medium">Up to TZS {filters.maxPrice.toLocaleString()}</span>
            <span>TZS 500,000+</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Experience Level */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Experience Level
        </h3>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`experience-${level}`}
                checked={filters.experienceLevel.includes(level)}
                onCheckedChange={() => toggleArrayFilter('experienceLevel', level)}
              />
              <Label htmlFor={`experience-${level}`} className="text-sm font-normal">
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`availability-${option}`}
                checked={filters.availability.includes(option)}
                onCheckedChange={() => toggleArrayFilter('availability', option)}
              />
              <Label htmlFor={`availability-${option}`} className="text-sm font-normal">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Skills */}
      <div>
        <h3 className="font-semibold mb-3">Skills</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {popularSkills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={`skill-${skill}`}
                checked={filters.skills.includes(skill)}
                onCheckedChange={() => toggleArrayFilter('skills', skill)}
              />
              <Label htmlFor={`skill-${skill}`} className="text-sm font-normal">
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Response Time */}
      <div>
        <h3 className="font-semibold mb-3">Response Time</h3>
        <Select value={filters.responseTime} onValueChange={(value) => updateFilter('responseTime', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Any response time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any response time</SelectItem>
            <SelectItem value="1hour">Within 1 hour</SelectItem>
            <SelectItem value="6hours">Within 6 hours</SelectItem>
            <SelectItem value="24hours">Within 24 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Project Size */}
      <div>
        <h3 className="font-semibold mb-3">Project Size</h3>
        <Select value={filters.projectSize} onValueChange={(value) => updateFilter('projectSize', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Any project size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any project size</SelectItem>
            <SelectItem value="small">Small - Less than TZS 100,000</SelectItem>
            <SelectItem value="medium">Medium - TZS 100,000 to 500,000</SelectItem>
            <SelectItem value="large">Large - More than TZS 500,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto h-full pb-20">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}