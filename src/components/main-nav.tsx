import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, ChevronDown } from "lucide-react"
import { useAuth } from "@/components/enhanced-auth-provider"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NavItem {
  href?: string
  label: string
  submenu?: Array<{ href: string; label: string }>
}

export function MainNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const location = useLocation()
  const { user } = useAuth()

  const getNavigationItems = (): NavItem[] => {
    const baseItems = [
      { href: "/", label: "Home" },
      { href: "/search", label: "Find Creatives" },
      { 
        label: "Services",
        submenu: [
          { href: "/search?category=graphic-design", label: "Graphic Design" },
          { href: "/search?category=photography", label: "Photography" },
          { href: "/search?category=videography", label: "Videography" },
          { href: "/search?category=digital-marketing", label: "Digital Marketing" },
          { href: "/search?category=web-design", label: "Web Design" },
          { href: "/search?category=ui-ux-design", label: "UI/UX Design" }
        ]
      },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About" },
      { href: "/testimonials", label: "Success Stories" },
      { href: "/help", label: "Help" }
    ]

    // Add authenticated user navigation
    if (user) {
      const dashboardItem: NavItem = {
        href: user.role === 'admin' ? '/admin' : '/dashboard',
        label: "Dashboard"
      }
      
      const userItems: NavItem[] = [
        dashboardItem,
        { href: "/chat", label: "Messages" },
        { href: "/profile", label: "Profile" }
      ]
      
      return [...baseItems.slice(0, 3), ...userItems, ...baseItems.slice(3)]
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  const isActiveLink = (href: string) => {
    return location.pathname === href
  }

  return (
    <div className="flex items-center">
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-2 text-base hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden rounded-md"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 w-80 bg-white dark:bg-gray-900">
          <div className="px-7">
            <Link to="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">BC</span>
              </div>
              <span className="font-bold text-xl">Brand Connect</span>
            </Link>
          </div>
          
          <nav className="flex flex-col gap-1 text-base font-medium mt-8 px-7">
            {navigationItems.map((item, index) => (
              <div
                key={item.label}
              >
                {'submenu' in item && item.submenu ? (
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-900 dark:text-white py-2 text-sm">
                      {item.label}
                    </div>
                    {item.submenu.map((subItem: { href: string; label: string }) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className="block pl-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={item.href!}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      isActiveLink(item.href!) 
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-1 ml-8">
        {navigationItems.map((item) => (
          <div key={item.label}>
            {'submenu' in item && item.submenu ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-md transition-colors group">
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                  {item.submenu.map((subItem: { href: string; label: string }) => (
                    <DropdownMenuItem key={subItem.href} asChild>
                      <Link 
                        to={subItem.href}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer text-sm"
                      >
                        {subItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to={item.href!}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActiveLink(item.href!) 
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                }`}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}