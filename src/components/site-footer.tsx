import { Link } from "react-router-dom"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container-brand py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logos/logo-transparent.png"
                alt="Brand Connect Logo"
                width="120"
                height="30"
                className="h-[30px] w-[120px]"
              />
            </Link>
            <p className="text-body-sm text-muted-foreground">
              Bridging clients with creative talent across Tanzania
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-body font-medium">For Clients</h3>
            <nav className="flex flex-col space-y-2 text-body-sm text-muted-foreground">
              <Link to="/search" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Find Creatives
              </Link>
              <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                How It Works
              </Link>
              <Link to="/testimonials" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Testimonials
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-body font-medium">For Creatives</h3>
            <nav className="flex flex-col space-y-2 text-body-sm text-muted-foreground">
              <Link to="/register" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Join as a Creative
              </Link>
              <Link to="/help" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Help & FAQ
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-body font-medium">Company</h3>
            <nav className="flex flex-col space-y-2 text-body-sm text-muted-foreground">
              <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                About Us
              </Link>
              <Link to="/blog" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Contact
              </Link>
              <Link to="/help" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Help Center
              </Link>
              <Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} Brand Connect. All rights reserved.
          </p>
          <p className="text-caption text-muted-foreground mt-4 md:mt-0">Made with ❤️ in Tanzania</p>
        </div>
      </div>
    </footer>
  )
}
