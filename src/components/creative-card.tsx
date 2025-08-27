import { Link } from "react-router-dom"
import { MapPin, Star, Award, Verified, Eye, Heart } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CreativeCardProps {
  name: string
  title: string
  location: string
  rating: number
  reviews: number
  imageSrc: string
  href: string
  featured?: boolean
  verified?: boolean
  hourlyRate?: number
  skills?: string[]
  completedProjects?: number
}

export function CreativeCard({ 
  name, 
  title, 
  location, 
  rating, 
  reviews, 
  imageSrc, 
  href,
  featured = false,
  verified = true,
  hourlyRate,
  skills = [],
  completedProjects = 0
}: CreativeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="creative-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white dark:bg-gray-900">
        {/* Image Container with Overlay */}
        <div className="relative h-64 w-full overflow-hidden">
          <img 
            src={imageSrc || "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"} 
            alt={name} 
            className="creative-card-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
          
          {/* Verified Badge */}
          {verified && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2">
                <Verified className="w-4 h-4 text-brand-600" />
              </div>
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-3">
              <Button size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Header with Avatar */}
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12 border-2 border-brand-200 dark:border-brand-800">
              <AvatarImage src={imageSrc} alt={name} />
              <AvatarFallback className="bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-semibold">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-h5 font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {name}
              </h3>
              <p className="text-body-sm text-brand-600 dark:text-brand-400 font-medium">
                {title}
              </p>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2 text-brand-500" />
            <span className="text-body-sm">{location}</span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < Math.floor(rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-body-sm font-semibold text-gray-900 dark:text-white">
                {rating.toFixed(1)}
              </span>
              <span className="text-body-sm text-gray-500 dark:text-gray-400">
                ({reviews} reviews)
              </span>
            </div>
          </div>
          
          {/* Skills Preview */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs bg-brand-50 dark:bg-brand-950 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{skills.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          {/* Stats Row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="text-lg font-bold text-brand-600 dark:text-brand-400">
                {completedProjects}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
            </div>
            
            {hourlyRate && (
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("sw-TZ", {
                    style: "currency",
                    currency: "TZS",
                    minimumFractionDigits: 0,
                  }).format(hourlyRate)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">per hour</div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {rating >= 4.5 ? "★★★" : rating >= 4 ? "★★" : "★"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Quality</div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Link to={href} className="w-full">
            <Button className="professional-button w-full group">
              View Profile
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}