"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, AlertTriangle, Info, Star, TrendingUp, Users, Award } from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================
// PROFESSIONAL ALERT SYSTEM
// =============================================

interface ProfessionalAlertProps {
  variant: "success" | "warning" | "error" | "info"
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
  className?: string
}

export function ProfessionalAlert({
  variant,
  title,
  message,
  action,
  onClose,
  className
}: ProfessionalAlertProps) {
  const variants = {
    success: {
      icon: Check,
      classes: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800 dark:text-green-200",
      iconClasses: "text-green-600 dark:text-green-400"
    },
    warning: {
      icon: AlertTriangle,
      classes: "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 text-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-800 dark:text-yellow-200",
      iconClasses: "text-yellow-600 dark:text-yellow-400"
    },
    error: {
      icon: X,
      classes: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800 dark:text-red-200",
      iconClasses: "text-red-600 dark:text-red-400"
    },
    info: {
      icon: Info,
      classes: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800 dark:text-blue-200",
      iconClasses: "text-blue-600 dark:text-blue-400"
    }
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        "relative p-6 rounded-2xl border shadow-lg backdrop-blur-sm",
        config.classes,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 ${config.iconClasses}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-lg mb-2">{title}</h4>
          )}
          <p className="text-sm leading-relaxed">{message}</p>
          
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 text-sm font-semibold underline hover:no-underline transition-all"
            >
              {action.label}
            </button>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// =============================================
// PROFESSIONAL STATS CARD
// =============================================

interface ProfessionalStatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
    period: string
  }
  icon: React.ElementType
  trend?: number[]
  className?: string
}

export function ProfessionalStatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  className
}: ProfessionalStatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn("professional-card p-6 relative overflow-hidden", className)}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-teal-50/50 dark:from-brand-950/50 dark:to-teal-950/50 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl shadow-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {change && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold",
              change.type === "increase" 
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            )}>
              <TrendingUp className={cn(
                "w-3 h-3",
                change.type === "decrease" && "rotate-180"
              )} />
              {Math.abs(change.value)}%
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </div>
          {change && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              vs {change.period}
            </div>
          )}
        </div>
        
        {/* Mini Trend Chart */}
        {trend && (
          <div className="mt-4 h-8 flex items-end gap-1">
            {trend.map((value, index) => (
              <motion.div
                key={index}
                className="bg-brand-200 dark:bg-brand-800 rounded-sm flex-1"
                initial={{ height: 0 }}
                animate={{ height: `${(value / Math.max(...trend)) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// =============================================
// PROFESSIONAL FEATURE CARD
// =============================================

interface ProfessionalFeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  features?: string[]
  href?: string
  onClick?: () => void
  premium?: boolean
  className?: string
}

export function ProfessionalFeatureCard({
  icon: Icon,
  title,
  description,
  features = [],
  href,
  onClick,
  premium = false,
  className
}: ProfessionalFeatureCardProps) {
  const Component = href ? "a" : "div"
  const isInteractive = href || onClick

  return (
    <motion.div
      whileHover={isInteractive ? { y: -8 } : {}}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Component
        href={href}
        onClick={onClick}
        className={cn(
          "block relative",
          isInteractive && "cursor-pointer focus-brand",
          className
        )}
      >
        <div className={cn(
          "professional-card p-8 h-full relative overflow-hidden",
          premium && "border-2 border-gradient"
        )}>
          {/* Premium Badge */}
          {premium && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                <Award className="w-3 h-3 mr-1 inline" />
                Premium
              </div>
            </div>
          )}
          
          {/* Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-h4 font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {title}
            </h3>
            
            <p className="text-body-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
            
            {features.length > 0 && (
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-mesh-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
        </div>
      </Component>
    </motion.div>
  )
}

// =============================================
// PROFESSIONAL TESTIMONIAL CARD
// =============================================

interface ProfessionalTestimonialCardProps {
  name: string
  role: string
  company: string
  avatar: string
  content: string
  rating: number
  className?: string
}

export function ProfessionalTestimonialCard({
  name,
  role,
  company,
  avatar,
  content,
  rating,
  className
}: ProfessionalTestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className={cn(
        "professional-card p-8 h-full relative overflow-hidden",
        className
      )}>
        {/* Quote Background */}
        <div className="absolute top-4 right-4 text-6xl text-brand-100 dark:text-brand-900/20 font-serif">
          "
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          ))}
        </div>
        
        {/* Content */}
        <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 relative z-10">
          {content}
        </blockquote>
        
        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-200 dark:border-brand-800">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {role} at {company}
            </div>
          </div>
        </div>
        
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-50/30 to-teal-50/30 dark:via-brand-950/30 dark:to-teal-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  )
}

// =============================================
// PROFESSIONAL METRIC DISPLAY
// =============================================

interface ProfessionalMetricProps {
  label: string
  value: string | number
  icon: React.ElementType
  trend?: {
    value: number
    direction: "up" | "down"
    period: string
  }
  color?: "brand" | "success" | "warning" | "error" | "info"
  className?: string
}

export function ProfessionalMetric({
  label,
  value,
  icon: Icon,
  trend,
  color = "brand",
  className
}: ProfessionalMetricProps) {
  const colorClasses = {
    brand: "from-brand-500 to-brand-600",
    success: "from-green-500 to-emerald-600",
    warning: "from-yellow-500 to-orange-600",
    error: "from-red-500 to-pink-600",
    info: "from-blue-500 to-indigo-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn("text-center", className)}
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-3xl shadow-xl mb-4`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label}
      </div>
      
      {trend && (
        <div className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
          trend.direction === "up" 
            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
        )}>
          <TrendingUp className={cn(
            "w-3 h-3",
            trend.direction === "down" && "rotate-180"
          )} />
          {trend.value}% {trend.period}
        </div>
      )}
    </motion.div>
  )
}

// =============================================
// PROFESSIONAL PROGRESS INDICATOR
// =============================================

interface ProfessionalProgressProps {
  steps: Array<{
    title: string
    description?: string
    completed: boolean
    current?: boolean
  }>
  className?: string
}

export function ProfessionalProgress({ steps, className }: ProfessionalProgressProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="flex items-start gap-4"
        >
          {/* Step Indicator */}
          <div className="relative">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg transition-all duration-300",
              step.completed 
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                : step.current
                ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white animate-pulse"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            )}>
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "absolute top-10 left-1/2 w-0.5 h-8 transform -translate-x-1/2 transition-colors duration-300",
                step.completed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
              )} />
            )}
          </div>
          
          {/* Step Content */}
          <div className="flex-1 pt-2">
            <h4 className={cn(
              "font-semibold transition-colors duration-300",
              step.completed 
                ? "text-green-700 dark:text-green-400"
                : step.current
                ? "text-brand-700 dark:text-brand-400"
                : "text-gray-600 dark:text-gray-400"
            )}>
              {step.title}
            </h4>
            {step.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {step.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// =============================================
// PROFESSIONAL EMPTY STATE
// =============================================

interface ProfessionalEmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  illustration?: string
  className?: string
}

export function ProfessionalEmptyState({
  icon: Icon,
  title,
  description,
  action,
  illustration,
  className
}: ProfessionalEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("text-center py-16", className)}
    >
      {illustration ? (
        <div className="mb-8">
          <img
            src={illustration}
            alt={title}
            className="w-64 h-64 mx-auto object-contain opacity-80"
          />
        </div>
      ) : (
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-lg">
            <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      )}
      
      <h3 className="text-h3 font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      <p className="text-body text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed mb-8">
        {description}
      </p>
      
      {action && (
        <motion.button
          onClick={action.onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="professional-button"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}

// =============================================
// PROFESSIONAL NOTIFICATION TOAST
// =============================================

interface ProfessionalToastProps {
  type: "success" | "warning" | "error" | "info"
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
  duration?: number
}

export function ProfessionalToast({
  type,
  title,
  message,
  action,
  onClose,
  duration = 5000
}: ProfessionalToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const variants = {
    success: {
      icon: Check,
      classes: "bg-white dark:bg-gray-800 border-l-4 border-green-500 shadow-xl",
      iconClasses: "text-green-600 bg-green-100 dark:bg-green-900/20"
    },
    warning: {
      icon: AlertTriangle,
      classes: "bg-white dark:bg-gray-800 border-l-4 border-yellow-500 shadow-xl",
      iconClasses: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    },
    error: {
      icon: X,
      classes: "bg-white dark:bg-gray-800 border-l-4 border-red-500 shadow-xl",
      iconClasses: "text-red-600 bg-red-100 dark:bg-red-900/20"
    },
    info: {
      icon: Info,
      classes: "bg-white dark:bg-gray-800 border-l-4 border-blue-500 shadow-xl",
      iconClasses: "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
    }
  }

  const config = variants[type]
  const IconComponent = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={cn(
            "p-6 rounded-2xl backdrop-blur-sm",
            config.classes
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-2 rounded-xl",
              config.iconClasses
            )}>
              <IconComponent className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {title}
                </h4>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
              
              {action && (
                <button
                  onClick={action.onClick}
                  className="mt-3 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                >
                  {action.label}
                </button>
              )}
            </div>
            
            {onClose && (
              <button
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(() => onClose(), 300)
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}