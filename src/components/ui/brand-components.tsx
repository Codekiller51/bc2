"use client"

import React from "react"
import { motion } from "framer-motion"
import { DivideIcon as LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================
// ENHANCED BUTTON SYSTEM
// =============================================

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  fullWidth?: boolean
  children: React.ReactNode
}

export function BrandButton({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: BrandButtonProps) {
  const baseClasses = "btn-base relative overflow-hidden"
  
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline", 
    ghost: "btn-ghost",
    destructive: "btn-destructive"
  }
  
  const sizeClasses = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg"
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <div className="loading-spinner w-4 h-4 border-current" />
      )}
      
      {!loading && Icon && iconPosition === "left" && (
        <Icon className="w-4 h-4" />
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="w-4 h-4" />
      )}
      
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-300 rounded-lg" />
      </span>
    </motion.button>
  )
}

// =============================================
// ENHANCED CARD SYSTEM
// =============================================

interface BrandCardProps {
  variant?: "standard" | "feature" | "interactive" | "creative" | "glass"
  padding?: "sm" | "md" | "lg"
  hover?: boolean
  children: React.ReactNode
  className?: string
}

export function BrandCard({
  variant = "standard",
  padding = "md",
  hover = true,
  children,
  className,
  ...props
}: BrandCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const variantClasses = {
    standard: "card-brand",
    feature: "card-feature",
    interactive: "card-interactive",
    creative: "card-creative",
    glass: "glass-effect dark:glass-effect-dark"
  }
  
  const paddingClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  }

  return (
    <motion.div
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        hover && "hover:shadow-lg hover:shadow-brand-500/10",
        className
      )}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// STATUS BADGE SYSTEM
// =============================================

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "pending" | "approved" | "rejected"
  size?: "sm" | "md" | "lg"
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export function StatusBadge({
  status,
  size = "md",
  icon: Icon,
  children,
  className
}: StatusBadgeProps) {
  const statusClasses = {
    success: "badge-success",
    warning: "badge-warning", 
    error: "badge-error",
    info: "badge-info",
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-error"
  }
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-semibold",
      statusClasses[status],
      sizeClasses[size],
      className
    )}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  )
}

// =============================================
// LOADING COMPONENTS
// =============================================

interface BrandLoadingProps {
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function BrandLoading({
  variant = "spinner",
  size = "md",
  text,
  className
}: BrandLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("loading-spinner border-brand-600", sizeClasses[size])} />
        {text && <span className="text-body-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-brand-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
        {text && <span className="text-body-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("bg-brand-600 rounded-full animate-pulse-brand", sizeClasses[size])} />
        {text && <span className="text-body-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  // Skeleton variant
  return (
    <div className={cn("space-y-3", className)}>
      <div className="loading-skeleton h-4 w-3/4" />
      <div className="loading-skeleton h-4 w-1/2" />
      <div className="loading-skeleton h-4 w-2/3" />
    </div>
  )
}

// =============================================
// SECTION CONTAINERS
// =============================================

interface SectionContainerProps {
  variant?: "default" | "hero" | "feature" | "cta"
  children: React.ReactNode
  className?: string
}

export function SectionContainer({
  variant = "default",
  children,
  className
}: SectionContainerProps) {
  const variantClasses = {
    default: "section-padding",
    hero: "hero-section hero-background",
    feature: "feature-section",
    cta: "cta-section brand-gradient text-white"
  }

  return (
    <section className={cn(variantClasses[variant], className)}>
      <div className="container-brand">
        {children}
      </div>
    </section>
  )
}

// =============================================
// FORM COMPONENTS
// =============================================

interface BrandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  icon?: LucideIcon
  iconPosition?: "left" | "right"
}

export function BrandInput({
  label,
  error,
  helper,
  icon: Icon,
  iconPosition = "left",
  className,
  ...props
}: BrandInputProps) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === "left" && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        )}
        
        <input
          className={cn(
            "form-input",
            Icon && iconPosition === "left" && "pl-10",
            Icon && iconPosition === "right" && "pr-10",
            error && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
            className
          )}
          {...props}
        />
        
        {Icon && iconPosition === "right" && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        )}
      </div>
      
      {error && (
        <p className="text-caption text-error-600 mt-1">{error}</p>
      )}
      
      {helper && !error && (
        <p className="text-caption text-muted-foreground mt-1">{helper}</p>
      )}
    </div>
  )
}

// =============================================
// NOTIFICATION COMPONENTS
// =============================================

interface NotificationProps {
  type: "success" | "warning" | "error" | "info"
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
  className?: string
}

export function BrandNotification({
  type,
  title,
  message,
  action,
  onClose,
  className
}: NotificationProps) {
  const typeConfig = {
    success: {
      classes: "status-success",
      icon: "✓"
    },
    warning: {
      classes: "status-warning", 
      icon: "⚠"
    },
    error: {
      classes: "status-error",
      icon: "✕"
    },
    info: {
      classes: "status-info",
      icon: "ℹ"
    }
  }

  const config = typeConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        "p-4 rounded-lg border flex items-start gap-3",
        config.classes,
        className
      )}
    >
      <span className="text-lg">{config.icon}</span>
      
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
        )}
        <p className="text-sm">{message}</p>
        
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-medium underline mt-2 hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </motion.div>
  )
}

// =============================================
// AVATAR COMPONENT
// =============================================

interface BrandAvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: "sm" | "md" | "lg" | "xl"
  status?: "online" | "offline" | "away"
  className?: string
}

export function BrandAvatar({
  src,
  alt,
  name = "User",
  size = "md",
  status,
  className
}: BrandAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg", 
    xl: "w-16 h-16 text-xl"
  }
  
  const statusColors = {
    online: "bg-success-500",
    offline: "bg-gray-400",
    away: "bg-warning-500"
  }

  const initials = name
    .split(" ")
    .map(n => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900 flex items-center justify-center font-medium text-brand-700 dark:text-brand-300",
        sizeClasses[size]
      )}>
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      
      {status && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
          statusColors[status]
        )} />
      )}
    </div>
  )
}

// =============================================
// FEATURE CARD COMPONENT
// =============================================

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  href?: string
  onClick?: () => void
  className?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  className
}: FeatureCardProps) {
  const Component = href ? "a" : "div"
  const isInteractive = href || onClick

  return (
    <motion.div
      whileHover={isInteractive ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Component
        href={href}
        onClick={onClick}
        className={cn(
          "card-feature block p-6 text-center space-y-4",
          isInteractive && "cursor-pointer focus-brand",
          className
        )}
      >
        <div className="flex justify-center">
          <div className="p-3 bg-brand-600 text-white rounded-xl">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <div>
          <h3 className="text-h4 mb-2">{title}</h3>
          <p className="text-body-sm text-muted-foreground">{description}</p>
        </div>
      </Component>
    </motion.div>
  )
}

// =============================================
// STATS CARD COMPONENT
// =============================================

interface StatsCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  icon?: LucideIcon
  className?: string
}

export function StatsCard({
  label,
  value,
  change,
  icon: Icon,
  className
}: StatsCardProps) {
  return (
    <BrandCard variant="standard" className={cn("text-center", className)}>
      <div className="space-y-3">
        {Icon && (
          <div className="flex justify-center">
            <Icon className="w-8 h-8 text-brand-600" />
          </div>
        )}
        
        <div>
          <div className="text-h2 font-bold text-brand-600">{value}</div>
          <p className="text-body-sm text-muted-foreground">{label}</p>
        </div>
        
        {change && (
          <div className={cn(
            "text-caption font-medium",
            change.type === "increase" ? "text-success-600" : "text-error-600"
          )}>
            {change.type === "increase" ? "↗" : "↘"} {Math.abs(change.value)}%
          </div>
        )}
      </div>
    </BrandCard>
  )
}

// =============================================
// EMPTY STATE COMPONENT
// =============================================

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      
      <h3 className="text-h3 mb-2">{title}</h3>
      <p className="text-body text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <BrandButton onClick={action.onClick}>
          {action.label}
        </BrandButton>
      )}
    </div>
  )
}

// =============================================
// PROGRESS INDICATOR
// =============================================

interface ProgressIndicatorProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressIndicator({
  value,
  max = 100,
  size = "md",
  showLabel = false,
  label,
  className
}: ProgressIndicatorProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  }

  return (
    <div className={cn("space-y-2", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          <span className="text-body-sm font-medium">{label}</span>
          {showLabel && (
            <span className="text-caption text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <motion.div
          className="h-full bg-brand-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// =============================================
// TOOLTIP COMPONENT
// =============================================

interface BrandTooltipProps {
  content: string
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function BrandTooltip({
  content,
  children,
  position = "top",
  className
}: BrandTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "absolute z-50 px-2 py-1 text-caption text-white bg-gray-900 rounded whitespace-nowrap",
            positionClasses[position],
            className
          )}
        >
          {content}
        </motion.div>
      )}
    </div>
  )
}