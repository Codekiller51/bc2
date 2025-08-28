"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
    period?: string
  }
  icon?: React.ElementType
  description?: string
  className?: string
  variant?: "default" | "success" | "warning" | "error"
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
  variant = "default"
}: StatsCardProps) {
  const variantStyles = {
    default: "border-gray-200 dark:border-gray-700",
    success: "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/50",
    warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/50",
    error: "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50"
  }

  const iconStyles = {
    default: "text-gray-600 dark:text-gray-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400"
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(variantStyles[variant], className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <Icon className={cn("h-4 w-4", iconStyles[variant])} />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          
          {change && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {change.type === "increase" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={change.type === "increase" ? "text-green-600" : "text-red-600"}>
                {Math.abs(change.value)}%
              </span>
              {change.period && <span>from {change.period}</span>}
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}