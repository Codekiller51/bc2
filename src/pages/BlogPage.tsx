import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Search, Filter, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Building a Strong Creative Portfolio in Tanzania",
      excerpt: "Learn how to showcase your creative work effectively to attract more clients on Brand Connect.",
      author: "Sarah Mwalimu",
      publishedAt: "2024-01-15",
      category: "Portfolio Tips",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Rise of Digital Marketing in East Africa",
      excerpt: "Exploring the growing demand for digital marketing services and how creative professionals can capitalize on this trend.",
      author: "John Kimaro",
      publishedAt: "2024-01-12",
      category: "Industry Insights",
      image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Photography Business: From Passion to Profit",
      excerpt: "A comprehensive guide for photographers looking to turn their passion into a sustainable business in Tanzania.",
      author: "Grace Mollel",
      publishedAt: "2024-01-10",
      category: "Business Tips",
      image: "https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=800",
      readTime: "8 min read"
    },
    {
      id: 4,
      title: "Client Communication: Best Practices for Creatives",
      excerpt: "Master the art of client communication to build lasting relationships and grow your creative business.",
      author: "David Mwanza",
      publishedAt: "2024-01-08",
      category: "Client Relations",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "Pricing Your Creative Services: A Complete Guide",
      excerpt: "Learn how to price your creative services competitively while ensuring profitability in the Tanzanian market.",
      author: "Amina Hassan",
      publishedAt: "2024-01-05",
      category: "Business Tips",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "The Future of Creative Work in Tanzania",
      excerpt: "Insights into emerging trends and opportunities in Tanzania's creative industry.",
      author: "Michael Juma",
      publishedAt: "2024-01-03",
      category: "Industry Insights",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
      readTime: "10 min read"
    }
  ]

  const categories = ['all', 'Portfolio Tips', 'Industry Insights', 'Business Tips', 'Client Relations']

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Creative Insights</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Tips, insights, and stories from Tanzania's creative community to help you grow your business and improve your craft
          </p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-emerald-600 text-white">Featured</Badge>
                </div>
              </div>
              
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge variant="outline" className="w-fit mb-4">
                  {filteredPosts[0].category}
                </Badge>
                
                <h2 className="text-2xl font-bold mb-4 hover:text-emerald-600 transition-colors">
                  <Link to={`/blog/${filteredPosts[0].id}`}>
                    {filteredPosts[0].title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {filteredPosts[0].excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{filteredPosts[0].author}</span>
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>{new Date(filteredPosts[0].publishedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <Link to={`/blog/${filteredPosts[0].id}`}>
                    <Button variant="outline" size="sm">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.slice(1).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="relative h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-white/90 text-gray-800">
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-lg font-bold mb-3 hover:text-emerald-600 transition-colors line-clamp-2">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or browse all categories
          </p>
        </div>
      )}

      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16"
      >
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get the latest creative tips, industry insights, and platform updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="btn-primary">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}