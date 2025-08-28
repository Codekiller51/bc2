"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Star, TrendingUp, Award, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDuration } from "@/lib/utils/format"

// =============================================
// PROFESSIONAL CARD VARIANTS
// =============================================

interface ProfessionalCardProps {
  variant?: "default" | "glass" | "gradient" | "premium" | "interactive"
  size?: "sm" | "md" | "lg" | "xl"
  hover?: boolean
  glow?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function ProfessionalCard({
  variant = "default",
  size = "md",
  hover = true,
  glow = false,
  children,
  className,
  onClick,
  ...props
}: ProfessionalCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const variants = {
    default: "bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50",
    glass: "glass-effect border border-white/20 dark:border-gray-700/20",
    gradient: "bg-gradient-to-br from-white via-brand-50/30 to-teal-50/30 dark:from-gray-900 dark:via-brand-950/30 dark:to-teal-950/30 border border-brand-200/50 dark:border-brand-800/50",
    premium: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gradient shadow-2xl",
    interactive: "bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50 hover:border-brand-300 dark:hover:border-brand-700"
  }
  
  const sizes = {
    sm: "p-4 rounded-xl",
    md: "p-6 rounded-2xl",
    lg: "p-8 rounded-2xl",
    xl: "p-10 rounded-3xl"
  }

  const Component = onClick ? motion.button : motion.div

  return (
    <Component
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden shadow-lg transition-all duration-500",
        variants[variant],
        sizes[size],
        hover && "hover:shadow-2xl",
        glow && "hover:shadow-glow",
        onClick && "cursor-pointer focus-brand",
        className
      )}
      {...props}
    >
      {children}
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-0 hover:opacity-5 transition-opacity duration-500" />
    </Component>
  )
}

// =============================================
// CREATIVE SHOWCASE CARD
// =============================================

interface CreativeShowcaseCardProps {
  name: string
  title: string
  location: string
  rating: number
  reviews: number
  image: string
  skills: string[]
  featured?: boolean
  verified?: boolean
  href: string
  className?: string
}

export function CreativeShowcaseCard({
  name,
  title,
  location,
  rating,
  reviews,
  image,
  skills,
  featured = false,
  verified = false,
  href,
  className
}: CreativeShowcaseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <ProfessionalCard 
        variant="interactive" 
        size="lg" 
        className={cn("h-full", className)}
      >
        {/* Header with Image */}
        <div className="relative mb-6">
          <div className="relative h-48 w-full rounded-xl overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {featured && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  <Award className="w-3 h-3 mr-1 inline" />
                  Featured
                </div>
              )}
              {verified && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2">
                  <Shield className="w-4 h-4 text-brand-600" />
                </div>
              )}
            </div>
            
            {/* Quick Action */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a
                href={href}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                View Profile
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-h4 font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {name}
            </h3>
            <p className="text-brand-600 dark:text-brand-400 font-medium">
              {title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📍 {location}
            </p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({reviews} reviews)
            </span>
          </div>
          
          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </ProfessionalCard>
    </motion.div>
  )
}

// =============================================
// SERVICE CARD
// =============================================

interface ServiceCardProps {
  name: string
  description: string
  price: number
  duration: number
  category: string
  popular?: boolean
  features?: string[]
  onSelect?: () => void
  className?: string
}

export function ServiceCard({
  name,
  description,
  price,
  duration,
  category,
  popular = false,
  features = [],
  onSelect,
  className
}: ServiceCardProps) {
import { formatCurrency, formatDuration } from "@/lib/utils/format"


  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <ProfessionalCard 
        variant={popular ? "premium" : "default"}
        size="lg"
        onClick={onSelect}
        className={cn("h-full relative", className)}
      >
        {/* Popular Badge */}
        {popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
              🔥 Most Popular
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-h4 font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {name}
              </h3>
              <span className="inline-block px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium mt-2">
                {category}
              </span>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                {formatCurrency(price)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDuration(duration)}
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Features */}
        {features.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              What's Included:
            </h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Action Button */}
        <div className="mt-auto">
          <button
            onClick={onSelect}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Select Service
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </ProfessionalCard>
    </motion.div>
  )
}

// =============================================
// PORTFOLIO ITEM CARD
// =============================================

interface PortfolioItemCardProps {
  title: string
  description?: string
  image: string
  category: string
  projectUrl?: string
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export function PortfolioItemCard({
  title,
  description,
  image,
  category,
  projectUrl,
  onEdit,
  onDelete,
  className
}: PortfolioItemCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <ProfessionalCard variant="interactive" size="md" className={cn("h-full", className)}>
        {/* Image */}
        <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay with Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            {projectUrl && (
              <button
                onClick={() => window.open(projectUrl, '_blank')}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Live
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={onEdit}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white px-3 py-1 rounded-full text-xs font-medium">
              {category}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
        </div>
      </ProfessionalCard>
    </motion.div>
  )
}

// =============================================
// BOOKING CARD
// =============================================

interface BookingCardProps {
  id: string
  clientName: string
  creativeName: string
  serviceName: string
  date: string
  time: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  amount: number
  onStatusChange?: (id: string, status: string) => void
  onViewDetails?: (id: string) => void
  className?: string
}

export function BookingCard({
  id,
  clientName,
  creativeName,
  serviceName,
  date,
  time,
  status,
  amount,
  onStatusChange,
  onViewDetails,
  className
}: BookingCardProps) {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      icon: "⏳"
    },
    confirmed: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      icon: "✅"
    },
    in_progress: {
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      icon: "🚀"
    },
    completed: {
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      icon: "🎉"
    },
    cancelled: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      icon: "❌"
    }
  }

  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <ProfessionalCard variant="default" size="md" className={cn("", className)}>
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white">
              {serviceName}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div>Client: {clientName}</div>
              <div>Creative: {creativeName}</div>
            </div>
          </div>
          
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1",
            config.color
          )}>
            <span>{config.icon}</span>
            {status.replace('_', ' ')}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Date</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {new Date(date).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Time</div>
            <div className="font-medium text-gray-900 dark:text-white">{time}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
            {new Intl.NumberFormat("sw-TZ", {
              style: "currency",
              currency: "TZS",
              minimumFractionDigits: 0,
            }).format(amount)}
          </div>
          
          <div className="flex gap-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(id)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                View Details
              </button>
            )}
            
            {status === 'pending' && onStatusChange && (
              <button
                onClick={() => onStatusChange(id, 'confirmed')}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </ProfessionalCard>
    </motion.div>
  )
}