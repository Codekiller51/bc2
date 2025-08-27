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
    const iconProps = { className: "h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" }
    
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
        return "from-emerald-500 to-emerald-600"
    }
  }

  return (
    <Link to={href} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl group-hover:border-emerald-300 dark:group-hover:border-emerald-700 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center space-y-4 relative">
            {/* Trending Badge */}
            {trending && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse text-xs font-bold">
                  🔥 Trending
                </Badge>
              </div>
            )}
            
            {/* Icon Container */}
            <div className="relative">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${getGradient(icon)} rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                {getIcon(icon)}
              </div>
              
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(icon)} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
            
            {/* Count Badge */}
            {count && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {count}
                </span>
              </div>
            )}
            
            {/* Hover Arrow */}
            <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="text-sm">Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(16, 185, 129, 0.1) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(5, 150, 105, 0.1) 2px, transparent 0)',
                backgroundSize: '50px 50px'
              }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}