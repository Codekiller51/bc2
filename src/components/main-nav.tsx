import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MainNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const location = useLocation()

  const navigationItems = [
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
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 w-80">
          <div className="px-7">
            <Link to="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">BC</span>
              </div>
              <span className="font-bold text-xl">Brand Connect</span>
            </Link>
          </div>
          
          <nav className="flex flex-col gap-2 text-lg font-medium mt-8 px-7">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.submenu ? (
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-900 dark:text-white py-2">
                      {item.label}
                    </div>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className="nav-link block pl-4 text-base"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={item.href!}
                    onClick={() => setIsOpen(false)}
                    className={`nav-link block ${isActiveLink(item.href!) ? 'nav-link-active' : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex gap-2 ml-8">
        {navigationItems.map((item) => (
          <div key={item.label}>
            {item.submenu ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="nav-link group">
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-2">
                  {item.submenu.map((subItem) => (
                    <DropdownMenuItem key={subItem.href} asChild>
                      <Link 
                        to={subItem.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
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
                className={`nav-link ${isActiveLink(item.href!) ? 'nav-link-active' : ''}`}
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