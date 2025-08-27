import { Link } from "react-router-dom"
import { BarChart, Camera, Palette, Video, Monitor, Smartphone, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CategoryCardProps {
  title: string
  icon: string
  description: string
  href: string
  count?: string
  trending?: boolean
}

export function CategoryCard({ title, icon, description, href, count, trending = false }: CategoryCardProps) {
  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" }
    
    switch (iconName) {
      case "Palette":
        return <Palette {...iconProps} />
      case "Camera":
        return <Camera {...iconProps} />
      case "Video":
        return <Video {...iconProps} />
      case "BarChart":
        return <BarChart {...iconProps} />
      case "Monitor":
        return <Monitor {...iconProps} />
      case "Smartphone":
        return <Smartphone {...iconProps} />
      default:
        return <Palette {...iconProps} />
    }
  }

  const getGradient = (iconName: string) => {
    switch (iconName) {
      case "Palette":
        return "from-purple-500 to-pink-500"
      case "Camera":
        return "from-blue-500 to-cyan-500"
      case "Video":
        return "from-red-500 to-orange-500"
      case "BarChart":
        return "from-green-500 to-emerald-500"
      case "Monitor":
        return "from-indigo-500 to-purple-500"
      case "Smartphone":
        return "from-teal-500 to-green-500"
      default:
        return "from-brand-500 to-brand-600"
    }
  }

  return (
    <Link to={href} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="professional-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:border-brand-300 dark:group-hover:border-brand-700">
          <CardContent className="p-8 text-center space-y-6 relative">
            {/* Trending Badge */}
            {trending && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse">
                  🔥 Trending
                </Badge>
              </div>
            )}
            
            {/* Icon Container */}
            <div className="relative">
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${getGradient(icon)} rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                {getIcon(icon)}
              </div>
              
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(icon)} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-h4 font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {title}
              </h3>
              <p className="text-body-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
            
            {/* Count Badge */}
            {count && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950 rounded-full">
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  {count}
                </span>
              </div>
            )}
            
            {/* Hover Arrow */}
            <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium">
                <span className="text-sm">Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-dot-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}