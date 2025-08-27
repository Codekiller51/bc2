import { Link } from "react-router-dom"
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Heart, ArrowUp } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden mt-auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2px, transparent 0)',
          backgroundSize: '100px 100px'
        }} />
      </div>
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Newsletter Section */}
        <motion.div 
          className="py-12 md:py-16 border-b border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-lg text-gray-300 mb-6 md:mb-8">
              Get the latest updates on new creative professionals, success stories, and platform features
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-lg"
              />
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">BC</span>
                </div>
                <div>
                  <span className="font-bold text-2xl text-white">Brand Connect</span>
                  <div className="text-sm text-gray-400">Creative Marketplace</div>
                </div>
              </Link>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                Bridging the gap between businesses and creative talent across Tanzania. 
                Building a stronger creative economy, one connection at a time.
              </p>
              
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" }
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="w-10 h-10 bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {/* For Clients */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">For Clients</h4>
              <nav className="flex flex-col space-y-3">
                {[
                  { href: "/search", label: "Find Creatives" },
                  { href: "/about", label: "How It Works" },
                  { href: "/testimonials", label: "Success Stories" },
                  { href: "/help", label: "Client Guide" },
                  { href: "/pricing", label: "Pricing" }
                ].map((link) => (
                  <Link 
                    key={link.href}
                    to={link.href} 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
            
            {/* For Creatives */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">For Creatives</h4>
              <nav className="flex flex-col space-y-3">
                {[
                  { href: "/register", label: "Join as Creative" },
                  { href: "/help", label: "Creative Guide" },
                  { href: "/blog", label: "Resources" },
                  { href: "/success-stories", label: "Success Stories" },
                  { href: "/community", label: "Community" }
                ].map((link) => (
                  <Link 
                    key={link.href}
                    to={link.href} 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
            
            {/* Company & Contact */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <nav className="flex flex-col space-y-3">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "Contact" },
                  { href: "/careers", label: "Careers" },
                  { href: "/press", label: "Press Kit" }
                ].map((link) => (
                  <Link 
                    key={link.href}
                    to={link.href} 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              {/* Contact Info */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>hello@brandconnect.co.tz</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+255 123 456 789</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Dar es Salaam, Tanzania</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-800 py-6 md:py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Brand Connect. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-brand-400 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:text-emerald-400 transition-colors hover:underline">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                Made with <Heart className="w-4 h-4 text-red-500" /> in Tanzania
              </p>
              
              <Button
                onClick={scrollToTop}
                variant="outline"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-white/10 border-gray-600 hover:border-gray-500 rounded-full w-8 h-8"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}