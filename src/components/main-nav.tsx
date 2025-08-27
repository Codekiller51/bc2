import * as React from "react"
import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex items-center">
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
        <SheetContent side="left" className="pr-0">
          <div className="px-7">
            <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <span className="font-bold text-xl">Brand Connect</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-4 text-lg font-medium mt-8 px-7">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              Home
            </Link>
            <Link
              to="/search"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              Find Creatives
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              Blog
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              About
            </Link>
            <Link
              to="/testimonials"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              Testimonials
            </Link>
            <Link
              to="/help"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              Help
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              Contact
            </Link>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="nav-link block"
            >
              Register
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <nav className="hidden lg:flex gap-6 ml-6">
        <Link
          to="/"
          className="nav-link"
        >
          Home
        </Link>
        <Link
          to="/search"
          className="nav-link"
        >
          Find Creatives
        </Link>
        <Link
          to="/blog"
          className="nav-link"
        >
          Blog
        </Link>
        <Link
          to="/about"
          className="nav-link"
        >
          About
        </Link>
        <Link
          to="/testimonials"
          className="nav-link"
        >
          Testimonials
        </Link>
        <Link
          to="/help"
          className="nav-link"
        >
          Help
        </Link>
        <Link
          to="/contact"
          className="nav-link"
        >
          Contact
        </Link>
      </nav>
    </div>
  )
}
