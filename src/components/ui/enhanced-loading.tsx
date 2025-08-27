"use client"

import { motion } from "framer-motion"
import { Loader2, Sparkles } from "lucide-react"

interface EnhancedLoadingProps {
  variant?: "default" | "brand" | "minimal" | "dots" | "pulse"
  size?: "sm" | "md" | "lg" | "xl"
  message?: string
  progress?: number
  className?: string
}

export function EnhancedLoading({ 
  variant = "default", 
  size = "md", 
  message,
  progress,
  className = "" 
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8", 
    xl: "w-12 h-12"
  }

  const containerSizes = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12"
  }

  if (variant === "brand") {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand Logo Spinner */}
          <div className="relative">
            <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            
            {/* Rotating Ring */}
            <motion.div
              className={`absolute inset-0 border-4 border-transparent border-t-brand-500 rounded-xl`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Pulse Effect */}
            <motion.div
              className={`absolute inset-0 bg-brand-500/20 rounded-xl`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
        
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center"
          >
            {message}
          </motion.p>
        )}
        
        {progress !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 w-full max-w-xs"
          >
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              {Math.round(progress)}% complete
            </p>
          </motion.div>
        )}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={`flex items-center justify-center ${containerSizes[size]} ${className}`}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-brand-500 rounded-full"
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
        {message && (
          <p className="ml-4 text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        )}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-brand-500 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {message && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            {message}
          </p>
        )}
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <Loader2 className={`${sizeClasses[size]} text-brand-600 animate-spin`} />
        {message && (
          <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Loader2 className={`${sizeClasses[size]} text-brand-600 animate-spin`} />
        
        {/* Sparkle Effects */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-500" />
        </motion.div>
      </motion.div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

// Page Loading Component
export function EnhancedPageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-2xl">BC</span>
          </div>
          <div>
            <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-brand-800 bg-clip-text text-transparent dark:from-white dark:to-brand-200">
              Brand Connect
            </span>
            <div className="text-sm text-gray-500 dark:text-gray-400">Creative Marketplace</div>
          </div>
        </motion.div>

        <EnhancedLoading variant="brand" size="lg" message={message} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-brand-500 rounded-full"
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
        </motion.div>
      </div>
    </div>
  )
}

// Skeleton Loading Components
export function EnhancedSkeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`loading-skeleton ${className}`}
      {...props}
    />
  )
}

export function CreativeCardSkeleton() {
  return (
    <div className="professional-card p-6 space-y-4">
      <EnhancedSkeleton className="h-48 w-full rounded-xl" />
      <div className="flex items-center gap-3">
        <EnhancedSkeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <EnhancedSkeleton className="h-5 w-3/4" />
          <EnhancedSkeleton className="h-4 w-1/2" />
        </div>
      </div>
      <EnhancedSkeleton className="h-4 w-full" />
      <div className="flex gap-2">
        <EnhancedSkeleton className="h-6 w-16 rounded-full" />
        <EnhancedSkeleton className="h-6 w-20 rounded-full" />
      </div>
      <EnhancedSkeleton className="h-12 w-full rounded-xl" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <EnhancedSkeleton className="h-8 w-64" />
        <EnhancedSkeleton className="h-4 w-96" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="professional-card p-6 space-y-3">
            <EnhancedSkeleton className="h-6 w-6 rounded-lg" />
            <EnhancedSkeleton className="h-8 w-16" />
            <EnhancedSkeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="professional-card p-6 space-y-4">
          <EnhancedSkeleton className="h-6 w-32" />
          <EnhancedSkeleton className="h-64 w-full rounded-xl" />
        </div>
        
        <div className="professional-card p-6 space-y-4">
          <EnhancedSkeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <EnhancedSkeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <EnhancedSkeleton className="h-4 w-3/4" />
                  <EnhancedSkeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}