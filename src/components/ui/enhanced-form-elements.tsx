"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Check, X, Search, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================
// ENHANCED INPUT COMPONENT
// =============================================

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  success?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  variant?: "default" | "filled" | "underlined"
  loading?: boolean
}

export function EnhancedInput({
  label,
  error,
  helper,
  success,
  icon,
  iconPosition = "left",
  variant = "default",
  loading = false,
  className,
  type,
  ...props
}: EnhancedInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const isPassword = type === "password"

  const variantClasses = {
    default: "form-input",
    filled: "form-input bg-gray-50 dark:bg-gray-900 border-transparent focus:border-brand-500",
    underlined: "border-0 border-b-2 border-gray-200 dark:border-gray-700 rounded-none px-0 focus:border-brand-500 bg-transparent"
  }

  const hasError = !!error
  const hasSuccess = !!success && !hasError

  return (
    <div className="form-group">
      {label && (
        <motion.label
          className={cn(
            "form-label transition-colors",
            hasError && "text-error-600",
            hasSuccess && "text-success-600",
            isFocused && !hasError && !hasSuccess && "text-brand-600"
          )}
          animate={{ color: isFocused ? "#059669" : undefined }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <motion.input
          className={cn(
            variantClasses[variant],
            icon && iconPosition === "left" && "pl-10",
            (icon && iconPosition === "right") || isPassword && "pr-10",
            hasError && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
            hasSuccess && "border-success-500 focus:border-success-500 focus:ring-success-500/20",
            loading && "opacity-50 cursor-wait",
            className
          )}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={loading}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <div className="loading-spinner w-4 h-4 border-brand-600" />
          )}
          
          {hasSuccess && !loading && (
            <Check className="w-4 h-4 text-success-500" />
          )}
          
          {hasError && !loading && (
            <X className="w-4 h-4 text-error-500" />
          )}
          
          {isPassword && !loading && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
          {icon && iconPosition === "right" && !isPassword && !loading && !hasError && !hasSuccess && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-caption text-error-600 mt-1"
          >
            {error}
          </motion.p>
        )}
        
        {success && !error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-caption text-success-600 mt-1"
          >
            {success}
          </motion.p>
        )}
        
        {helper && !error && !success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-caption text-muted-foreground mt-1"
          >
            {helper}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// =============================================
// ENHANCED TEXTAREA COMPONENT
// =============================================

interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  maxLength?: number
  showCount?: boolean
  autoResize?: boolean
}

export function EnhancedTextarea({
  label,
  error,
  helper,
  maxLength,
  showCount = false,
  autoResize = false,
  className,
  value,
  onChange,
  ...props
}: EnhancedTextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const currentLength = typeof value === "string" ? value.length : 0
  const hasError = !!error

  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, autoResize])

  return (
    <div className="form-group">
      {label && (
        <motion.label
          className={cn(
            "form-label transition-colors",
            hasError && "text-error-600",
            isFocused && !hasError && "text-brand-600"
          )}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        <motion.textarea
          ref={textareaRef}
          className={cn(
            "form-textarea resize-none",
            hasError && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
            autoResize && "overflow-hidden",
            className
          )}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {(showCount || maxLength) && (
          <div className="absolute bottom-2 right-2 text-caption text-muted-foreground">
            {currentLength}{maxLength && `/${maxLength}`}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-caption text-error-600 mt-1"
          >
            {error}
          </motion.p>
        )}
        
        {helper && !error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-caption text-muted-foreground mt-1"
          >
            {helper}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// =============================================
// SEARCH INPUT COMPONENT
// =============================================

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onSearch?: (query: string) => void
  loading?: boolean
  suggestions?: string[]
  onSuggestionSelect?: (suggestion: string) => void
}

export function SearchInput({
  onSearch,
  loading = false,
  suggestions = [],
  onSuggestionSelect,
  className,
  value,
  onChange,
  ...props
}: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [query, setQuery] = React.useState(value || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query as string)
    setShowSuggestions(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange?.(e)
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <EnhancedInput
          type="text"
          icon={<Search className="w-4 h-4" />}
          iconPosition="left"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(query.length > 0 && suggestions.length > 0)}
          loading={loading}
          className={cn("pr-12", className)}
          {...props}
        />
        
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          disabled={loading}
        >
          <Search className="w-4 h-4 text-muted-foreground" />
        </button>
      </form>
      
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-lg last:rounded-b-lg"
                onClick={() => {
                  setQuery(suggestion)
                  onSuggestionSelect?.(suggestion)
                  setShowSuggestions(false)
                }}
              >
                <span className="text-body-sm">{suggestion}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// =============================================
// DATE TIME PICKER COMPONENT
// =============================================

interface DateTimePickerProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  type?: "date" | "time" | "datetime-local"
  error?: string
  min?: string
  max?: string
}

export function DateTimePicker({
  label,
  value,
  onChange,
  type = "date",
  error,
  min,
  max,
  ...props
}: DateTimePickerProps) {
  const getIcon = () => {
    switch (type) {
      case "time":
        return <Clock className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <EnhancedInput
      type={type}
      label={label}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      error={error}
      icon={getIcon()}
      min={min}
      max={max}
      {...props}
    />
  )
}