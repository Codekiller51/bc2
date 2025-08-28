import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Share2, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react'
import { useParams, Link } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function BlogPostPage() {
  const { id } = useParams()

  // Mock blog post data
  const blogPost = {
    id: 1,
    title: "10 Tips for Building a Strong Creative Portfolio in Tanzania",
    content: `
      <p>Building a compelling creative portfolio is essential for success in Tanzania's growing creative economy. Whether you're a graphic designer in Dar es Salaam, a photographer in Arusha, or a digital marketer in Mwanza, your portfolio is your most powerful tool for attracting clients.</p>

      <h2>1. Showcase Your Best Work First</h2>
      <p>Your portfolio should lead with your strongest pieces. Clients typically make decisions within the first few seconds of viewing your work, so make those seconds count. Choose 3-5 of your absolute best projects to feature prominently.</p>

      <h2>2. Tell the Story Behind Each Project</h2>
      <p>Don't just show the final result – explain your process. Tanzanian clients appreciate understanding how you approach challenges and solve problems. Include brief descriptions of:</p>
      <ul>
        <li>The client's challenge or goal</li>
        <li>Your creative approach</li>
        <li>The results achieved</li>
      </ul>

      <h2>3. Include Local Context</h2>
      <p>Showcase work that resonates with the Tanzanian market. Include projects that demonstrate your understanding of local culture, languages, and business practices. This helps potential clients see that you "get" the local market.</p>

      <h2>4. Keep It Updated</h2>
      <p>An outdated portfolio can hurt your credibility. Regularly refresh your portfolio with new work, removing older pieces that no longer represent your current skill level.</p>

      <h2>5. Show Versatility Within Your Niche</h2>
      <p>While specialization is important, showing range within your area of expertise can help you attract more diverse projects. A graphic designer might show logo design, packaging, and digital graphics.</p>

      <h2>6. Include Client Testimonials</h2>
      <p>Social proof is powerful in the Tanzanian market. Include testimonials from satisfied clients, especially those from recognizable local businesses or organizations.</p>

      <h2>7. Optimize for Mobile</h2>
      <p>Many Tanzanian clients will view your portfolio on mobile devices. Ensure your portfolio looks great and loads quickly on smartphones and tablets.</p>

      <h2>8. Use High-Quality Images</h2>
      <p>Poor image quality can undermine even the best creative work. Invest time in photographing or scanning your work properly, ensuring colors are accurate and details are clear.</p>

      <h2>9. Include Contact Information</h2>
      <p>Make it easy for potential clients to reach you. Include multiple contact methods and consider adding your location to help with local SEO.</p>

      <h2>10. Get Professional Feedback</h2>
      <p>Before launching your portfolio, get feedback from other creatives or potential clients. Fresh eyes can spot issues you might miss and suggest improvements.</p>

      <h2>Conclusion</h2>
      <p>A strong portfolio is an investment in your creative career. Take the time to build something that truly represents your skills and attracts the right clients. Remember, your portfolio is often the first impression potential clients have of your work – make it count!</p>
    `,
    author: {
      name: "Sarah Mwalimu",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      bio: "Creative Director and Brand Strategist based in Dar es Salaam with over 8 years of experience helping businesses build strong visual identities."
    },
    publishedAt: "2024-01-15",
    category: "Portfolio Tips",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
    readTime: "5 min read",
    likes: 42,
    comments: 8
  }

  const relatedPosts = [
    {
      id: 2,
      title: "The Rise of Digital Marketing in East Africa",
      category: "Industry Insights",
      image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 3,
      title: "Photography Business: From Passion to Profit",
      category: "Business Tips",
      image: "https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 4,
      title: "Client Communication: Best Practices for Creatives",
      category: "Client Relations",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Link to="/blog">
          <Button variant="ghost" className="group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>
        </Link>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Badge className="bg-emerald-100 text-emerald-800 mb-4">
            {blogPost.category}
          </Badge>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {blogPost.title}
          </h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={blogPost.author.avatar} alt={blogPost.author.name} />
                <AvatarFallback>{blogPost.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {blogPost.author.name}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{new Date(blogPost.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{blogPost.readTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
            <img
              src={blogPost.image}
              alt={blogPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-emerald"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </motion.div>

        {/* Article Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {blogPost.likes} Likes
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {blogPost.comments} Comments
                  </Button>
                </div>
                
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={blogPost.author.avatar} alt={blogPost.author.name} />
                  <AvatarFallback>{blogPost.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">About {blogPost.author.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {blogPost.author.bio}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post, index) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-32">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {post.category}
                  </Badge>
                  
                  <h3 className="font-semibold mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
                    <Link to={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Read Article
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}