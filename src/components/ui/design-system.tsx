"use client"

import React from "react"
import { motion } from "framer-motion"
import { 
  Palette, 
  Type, 
  Layout, 
  Smartphone, 
  Monitor,
  Accessibility,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * Brand Connect Design System Showcase
 * This component demonstrates all the design system elements
 */
export function DesignSystemShowcase() {
  return (
    <div className="container-brand space-y-12 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-display mb-4">Brand Connect Design System</h1>
        <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
          A comprehensive design system built for Tanzania's creative marketplace, 
          emphasizing trust, accessibility, and seamless user experience.
        </p>
      </div>

      {/* Color Palette */}
      <section>
        <h2 className="text-h2 mb-6">Color Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Primary Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Primary Brand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Brand 500", class: "bg-brand-500", hex: "#10b981" },
                { name: "Brand 600", class: "bg-brand-600", hex: "#059669" },
                { name: "Brand 700", class: "bg-brand-700", hex: "#047857" },
              ].map((color) => (
                <div key={color.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${color.class}`} />
                  <div>
                    <p className="text-body-sm font-medium">{color.name}</p>
                    <p className="text-caption text-muted-foreground">{color.hex}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Status Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Success", class: "bg-success-500", hex: "#22c55e" },
                { name: "Warning", class: "bg-warning-500", hex: "#f59e0b" },
                { name: "Error", class: "bg-error-500", hex: "#ef4444" },
                { name: "Info", class: "bg-info-500", hex: "#3b82f6" },
              ].map((color) => (
                <div key={color.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${color.class}`} />
                  <div>
                    <p className="text-body-sm font-medium">{color.name}</p>
                    <p className="text-caption text-muted-foreground">{color.hex}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Neutral Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Neutral Scale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Gray 100", class: "bg-gray-100", hex: "#f3f4f6" },
                { name: "Gray 500", class: "bg-gray-500", hex: "#6b7280" },
                { name: "Gray 900", class: "bg-gray-900", hex: "#111827" },
              ].map((color) => (
                <div key={color.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${color.class} border`} />
                  <div>
                    <p className="text-body-sm font-medium">{color.name}</p>
                    <p className="text-caption text-muted-foreground">{color.hex}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Gradients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Brand Gradients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="w-full h-12 rounded-lg bg-gradient-brand" />
              <p className="text-caption text-muted-foreground">Primary Gradient</p>
              <div className="w-full h-12 rounded-lg bg-gradient-brand-light" />
              <p className="text-caption text-muted-foreground">Light Gradient</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-h2 mb-6">Typography Scale</h2>
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-display">Display Text - Hero Headlines</div>
            <div className="text-h1">Heading 1 - Page Titles</div>
            <div className="text-h2">Heading 2 - Section Headers</div>
            <div className="text-h3">Heading 3 - Subsection Headers</div>
            <div className="text-h4">Heading 4 - Card Titles</div>
            <div className="text-body-lg">Body Large - Important body text</div>
            <div className="text-body">Body - Default body text for paragraphs and content</div>
            <div className="text-body-sm">Body Small - Secondary text and descriptions</div>
            <div className="text-caption">Caption - Labels, metadata, and fine print</div>
          </CardContent>
        </Card>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-h2 mb-6">Button System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Button Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button className="btn-primary">Primary</Button>
                <Button className="btn-secondary">Secondary</Button>
                <Button className="btn-outline">Outline</Button>
                <Button className="btn-ghost">Ghost</Button>
                <Button className="btn-destructive">Destructive</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Button Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button className="btn-primary btn-sm">Small</Button>
                <Button className="btn-primary btn-md">Medium</Button>
                <Button className="btn-primary btn-lg">Large</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Form Elements */}
      <section>
        <h2 className="text-h2 mb-6">Form Elements</h2>
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Text Input</label>
                <Input className="form-input" placeholder="Enter your name" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Select Dropdown</label>
                <Select>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Choose an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Textarea</label>
              <Textarea className="form-textarea" placeholder="Enter your message..." />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Status Badges */}
      <section>
        <h2 className="text-h2 mb-6">Status System</h2>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-wrap gap-4">
              <Badge className="badge-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                Success
              </Badge>
              <Badge className="badge-warning">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Warning
              </Badge>
              <Badge className="badge-error">
                <X className="w-3 h-3 mr-1" />
                Error
              </Badge>
              <Badge className="badge-info">
                <Info className="w-3 h-3 mr-1" />
                Info
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-h2 mb-6">Card Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-brand">
            <CardHeader>
              <CardTitle className="text-h4">Standard Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-muted-foreground">
                Basic card component with standard styling and hover effects.
              </p>
            </CardContent>
          </Card>

          <Card className="card-feature">
            <CardHeader>
              <CardTitle className="text-h4">Feature Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm">
                Enhanced card with brand gradient background for highlighting key features.
              </p>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-h4">Interactive Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-muted-foreground">
                Interactive card with hover animations and enhanced shadow effects.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Loading States */}
      <section>
        <h2 className="text-h2 mb-6">Loading States</h2>
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="loading-spinner w-6 h-6 border-brand-600" />
              <span className="text-body">Loading spinner</span>
            </div>
            
            <div className="space-y-3">
              <div className="loading-skeleton h-4 w-3/4" />
              <div className="loading-skeleton h-4 w-1/2" />
              <div className="loading-skeleton h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Responsive Design */}
      <section>
        <h2 className="text-h2 mb-6">Responsive Breakpoints</h2>
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-brand-50 dark:bg-brand-950 rounded-lg text-center">
                <Monitor className="w-8 h-8 mx-auto mb-2 text-brand-600" />
                <p className="text-body-sm font-medium">Desktop</p>
                <p className="text-caption text-muted-foreground">1024px+</p>
              </div>
              <div className="p-4 bg-teal-50 dark:bg-teal-950 rounded-lg text-center">
                <Layout className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                <p className="text-body-sm font-medium">Tablet</p>
                <p className="text-caption text-muted-foreground">768px+</p>
              </div>
              <div className="p-4 bg-info-50 dark:bg-info-950 rounded-lg text-center">
                <Smartphone className="w-8 h-8 mx-auto mb-2 text-info-600" />
                <p className="text-body-sm font-medium">Mobile</p>
                <p className="text-caption text-muted-foreground">640px+</p>
              </div>
              <div className="p-4 bg-warning-50 dark:bg-warning-950 rounded-lg text-center">
                <Accessibility className="w-8 h-8 mx-auto mb-2 text-warning-600" />
                <p className="text-body-sm font-medium">Touch</p>
                <p className="text-caption text-muted-foreground">44px min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Micro-interactions */}
      <section>
        <h2 className="text-h2 mb-6">Micro-interactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Hover Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="btn-primary interactive-scale">Scale on Hover</Button>
              <Button className="btn-outline interactive-glow">Glow Effect</Button>
              <div className="card-interactive p-4 rounded-lg border">
                <p className="text-body-sm">Hover this card to see lift effect</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Animation Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                className="p-4 bg-brand-100 dark:bg-brand-900 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-body-sm">Interactive motion component</p>
              </motion.div>
              
              <div className="flex items-center gap-2">
                <div className="status-dot-success animate-pulse" />
                <span className="text-body-sm">Pulsing status indicator</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

/**
 * Component Library for Brand Connect
 * Reusable components following the design system
 */

// Enhanced Button Component
export function BrandButton({ 
  variant = "primary", 
  size = "md", 
  children, 
  className = "",
  ...props 
}: {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  const baseClasses = "btn-base"
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

  return (
    <Button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}

// Enhanced Card Component
export function BrandCard({ 
  variant = "standard",
  children,
  className = "",
  ...props
}: {
  variant?: "standard" | "feature" | "interactive" | "creative"
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  const variantClasses = {
    standard: "card-brand",
    feature: "card-feature",
    interactive: "card-interactive", 
    creative: "card-creative"
  }

  return (
    <Card className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Card>
  )
}

// Status Badge Component
export function StatusBadge({ 
  status, 
  children,
  className = ""
}: {
  status: "success" | "warning" | "error" | "info"
  children: React.ReactNode
  className?: string
}) {
  const statusClasses = {
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error", 
    info: "badge-info"
  }

  return (
    <Badge className={`${statusClasses[status]} ${className}`}>
      {children}
    </Badge>
  )
}

// Loading Component
export function BrandLoading({ 
  size = "md",
  text,
  className = ""
}: {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`loading-spinner ${sizeClasses[size]} border-brand-600`} />
      {text && <span className="text-body-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

// Section Container
export function SectionContainer({ 
  variant = "default",
  children,
  className = ""
}: {
  variant?: "default" | "hero" | "feature" | "cta"
  children: React.ReactNode
  className?: string
}) {
  const variantClasses = {
    default: "section-padding",
    hero: "hero-section",
    feature: "feature-section", 
    cta: "cta-section"
  }

  return (
    <section className={`${variantClasses[variant]} ${className}`}>
      <div className="container-brand">
        {children}
      </div>
    </section>
  )
}