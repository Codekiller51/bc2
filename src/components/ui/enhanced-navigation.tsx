"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================
// ENHANCED BREADCRUMB
// =============================================

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ElementType
}

interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function EnhancedBreadcrumb({ items, className }: EnhancedBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          )}
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {item.href ? (
              <Link
                to={item.href}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </Link>
            ) : (
              <span className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </span>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </nav>
  )
}

// =============================================
// ENHANCED PAGINATION
// =============================================

interface EnhancedPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showInfo?: boolean
  totalItems?: number
  itemsPerPage?: number
  className?: string
}

export function EnhancedPagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems,
  itemsPerPage = 10,
  className
}: EnhancedPaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      {/* Info */}
      {showInfo && totalItems && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
        </div>
      )}
      
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Previous
        </motion.button>
        
        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400 dark:text-gray-500">...</span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    "w-10 h-10 rounded-xl font-semibold transition-all duration-300",
                    currentPage === page
                      ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950"
                  )}
                >
                  {page}
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Next
        </motion.button>
      </div>
    </div>
  )
}

// =============================================
// ENHANCED TAB NAVIGATION
// =============================================

interface TabItem {
  id: string
  label: string
  icon?: React.ElementType
  count?: number
  disabled?: boolean
}

interface EnhancedTabsProps {
  items: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: "default" | "pills" | "underline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function EnhancedTabs({
  items,
  activeTab,
  onTabChange,
  variant = "default",
  size = "md",
  className
}: EnhancedTabsProps) {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-800 rounded-2xl p-1",
    pills: "space-x-2",
    underline: "border-b border-gray-200 dark:border-gray-700"
  }
  
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className={cn(variants[variant], sizes[size], className)}>
      <div className={cn(
        "flex",
        variant === "pills" ? "flex-wrap gap-2" : "relative"
      )}>
        {items.map((item, index) => {
          const isActive = activeTab === item.id
          const Icon = item.icon
          
          return (
            <motion.button
              key={item.id}
              onClick={() => !item.disabled && onTabChange(item.id)}
              disabled={item.disabled}
              whileHover={!item.disabled ? { scale: 1.02 } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
              className={cn(
                "relative flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 rounded-xl",
                variant === "default" && (
                  isActive
                    ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                ),
                variant === "pills" && (
                  isActive
                    ? "bg-brand-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                ),
                variant === "underline" && (
                  isActive
                    ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent"
                ),
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs font-bold",
                  isActive
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                )}>
                  {item.count}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// =============================================
// ENHANCED SEARCH BAR
// =============================================

interface EnhancedSearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  suggestions?: string[]
  loading?: boolean
  className?: string
}

export function EnhancedSearchBar({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  suggestions = [],
  loading = false,
  className
}: EnhancedSearchBarProps) {
  const [query, setQuery] = React.useState(value)
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
    setShowSuggestions(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange?.(newValue)
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0)
  }

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(query.length > 0 && suggestions.length > 0)}
            placeholder={placeholder}
            className="w-full h-14 pl-6 pr-16 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all duration-300 shadow-lg"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-6 py-4 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              onClick={() => {
                setQuery(suggestion)
                onChange?.(suggestion)
                onSearch?.(suggestion)
                setShowSuggestions(false)
              }}
            >
              <span className="text-gray-900 dark:text-white font-medium">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================
// ENHANCED SIDEBAR NAVIGATION
// =============================================

interface SidebarItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  badge?: string | number
  children?: SidebarItem[]
}

interface EnhancedSidebarProps {
  items: SidebarItem[]
  collapsed?: boolean
  onToggle?: () => void
  className?: string
}

export function EnhancedSidebar({
  items,
  collapsed = false,
  onToggle,
  className
}: EnhancedSidebarProps) {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const isActiveLink = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <motion.div
      animate={{ width: collapsed ? "4.5rem" : "18rem" }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 overflow-hidden",
        className
      )}
    >
      <div className="p-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">BC</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-xl text-gray-900 dark:text-white"
            >
              Brand Connect
            </motion.div>
          )}
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group",
                  isActiveLink(item.href)
                    ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActiveLink(item.href) ? "text-white" : "group-hover:scale-110"
                )} />
                
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        isActiveLink(item.href)
                          ? "bg-white/20 text-white"
                          : "bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300"
                      )}>
                        {item.badge}
                      </span>
                    )}
                    
                    {item.children && (
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          expandedItems.has(item.id) && "rotate-90"
                        )} />
                      </button>
                    )}
                  </>
                )}
              </Link>
              
              {/* Submenu */}
              {!collapsed && item.children && expandedItems.has(item.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-8 mt-2 space-y-1"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                        isActiveLink(child.href)
                          ? "bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <child.icon className="w-4 h-4" />
                      <span>{child.label}</span>
                      {child.badge && (
                        <span className="ml-auto px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-bold">
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </nav>
    </div>
  )
}