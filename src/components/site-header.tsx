'use client'

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Bell, MessageSquare, Settings, LogOut, User, Crown } from "lucide-react"

import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationSystem } from "@/components/notification-system"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/enhanced-auth-provider"
import { SessionStatusBadge } from "@/components/session-status-indicator"

export function SiteHeader() {
  const { user, loading, logout } = useAuth()

  const handleSignOut = async () => {
    try {
      const result = await logout()
      if (!result.success) {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error("Logout error:", error)
    }
  }

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs font-bold">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case 'creative':
        return (
          <Badge className="bg-gradient-to-r from-brand-500 to-teal-500 text-white border-0 text-xs font-bold">
            Creative
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-xs font-bold">
            Client
          </Badge>
        )
    }
  }

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <span className="text-white font-bold text-lg">BC</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
          </motion.div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent dark:from-white dark:to-emerald-200">
              Brand Connect
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              Creative Marketplace
            </div>
          </div>
        </Link>
        
        {/* Navigation */}
        <MainNav />
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          
          {user && (
            <>
              <NotificationSystem />
              <SessionStatusBadge />
            </>
          )}
          
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full border-2 border-transparent hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.avatar_url || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"} 
                      alt={user.name} 
                    />
                    <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-72 p-3" align="end" forceMount>
                {/* User Info Header */}
                <div className="flex items-center gap-3 mb-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <div className="mt-1">
                      {getUserRoleBadge(user.role)}
                    </div>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Navigation Items */}
                <div className="space-y-1">
                  <DropdownMenuItem asChild>
                    <Link 
                      to={
                        user.role === 'admin' ? '/admin' :
                        user.role === 'creative' ? '/dashboard/creative' :
                        '/dashboard'
                      }
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-md flex items-center justify-center">
                        <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/profile"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                        <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/chat"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                        <MessageSquare className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium">Messages</span>
                      <Badge className="ml-auto bg-green-500 text-white text-xs px-1.5 py-0.5">3</Badge>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/profile/edit"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                        <Settings className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-sm font-medium">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Logout */}
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-md flex items-center justify-center">
                    <LogOut className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-medium text-sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}