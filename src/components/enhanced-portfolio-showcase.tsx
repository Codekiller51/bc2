"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Image as ImageIcon, 
  Play, 
  ExternalLink, 
  Eye, 
  Heart,
  Share2,
  Download,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PortfolioItem {
  id: string
  title: string
  description: string
  image_url?: string
  video_url?: string
  category: string
  project_url?: string
  tags?: string[]
  client?: string
  year?: number
  featured?: boolean
}

interface EnhancedPortfolioShowcaseProps {
  items: PortfolioItem[]
  layout?: 'grid' | 'masonry' | 'carousel'
  showFilters?: boolean
  allowFullscreen?: boolean
  className?: string
}

export function EnhancedPortfolioShowcase({
  items,
  layout = 'grid',
  showFilters = true,
  allowFullscreen = true,
  className = ""
}: EnhancedPortfolioShowcaseProps) {
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>(items)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))]

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(items)
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, items])

  const openLightbox = (item: PortfolioItem, index: number) => {
    setSelectedItem(item)
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedItem(null)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem?.id)
    let newIndex = currentIndex

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedItem(filteredItems[newIndex])
    setLightboxIndex(newIndex)
  }

  const handleShare = async (item: PortfolioItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const PortfolioCard = ({ item, index }: { item: PortfolioItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
      onClick={() => allowFullscreen && openLightbox(item, index)}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Image/Video Container */}
        <div className="relative h-64 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {item.featured && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                Featured
              </Badge>
            </div>
          )}

          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : item.video_url ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <Play className="h-16 w-16 text-white opacity-80" />
              <video
                src={item.video_url}
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-3">
              {allowFullscreen && (
                <Button
                  size="sm"
                  className="bg-white/20 border border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    openLightbox(item, index)
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
              
              {item.project_url && (
                <Button
                  size="sm"
                  className="bg-white/20 border border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(item.project_url, '_blank')
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                size="sm"
                className="bg-white/20 border border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare(item)
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white backdrop-blur-sm">
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
              {item.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
              {item.description}
            </p>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              {item.client && <span>Client: {item.client}</span>}
              {item.year && <span>{item.year}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className={className}>
      {/* Filters */}
      {showFilters && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {category === 'all' ? 'All Work' : category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className={`
        ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' :
          layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8' :
          'flex overflow-x-auto gap-6 pb-4'
        }
      `}>
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No portfolio items found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory === 'all' 
              ? 'No portfolio items have been added yet'
              : `No items found in the ${selectedCategory} category`
            }
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black/95 border-0">
          {selectedItem && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                onClick={closeLightbox}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation Buttons */}
              {filteredItems.length > 1 && (
                <>
                  <Button
                    onClick={() => navigateLightbox('prev')}
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  
                  <Button
                    onClick={() => navigateLightbox('next')}
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Main Content */}
              <div className="w-full h-full flex flex-col lg:flex-row">
                {/* Media */}
                <div className="flex-1 flex items-center justify-center p-8">
                  {selectedItem.image_url ? (
                    <img
                      src={selectedItem.image_url}
                      alt={selectedItem.title}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                  ) : selectedItem.video_url ? (
                    <video
                      src={selectedItem.video_url}
                      controls
                      className="max-w-full max-h-full rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div className="w-96 h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info Panel */}
                <div className="lg:w-96 bg-white dark:bg-gray-900 p-8 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                        {selectedItem.category}
                      </Badge>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedItem.description}
                    </p>

                    {/* Meta Information */}
                    {(selectedItem.client || selectedItem.year) && (
                      <div className="space-y-2 text-sm">
                        {selectedItem.client && (
                          <div>
                            <span className="font-medium">Client: </span>
                            <span className="text-gray-600 dark:text-gray-400">{selectedItem.client}</span>
                          </div>
                        )}
                        {selectedItem.year && (
                          <div>
                            <span className="font-medium">Year: </span>
                            <span className="text-gray-600 dark:text-gray-400">{selectedItem.year}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {selectedItem.tags && selectedItem.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                      {selectedItem.project_url && (
                        <Button
                          onClick={() => window.open(selectedItem.project_url, '_blank')}
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Live Project
                        </Button>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleShare(selectedItem)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        
                        {selectedItem.image_url && (
                          <Button
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = selectedItem.image_url!
                              link.download = `${selectedItem.title}.jpg`
                              link.click()
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Navigation Info */}
                    {filteredItems.length > 1 && (
                      <div className="text-center text-sm text-gray-500">
                        {lightboxIndex + 1} of {filteredItems.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Video Portfolio Component
export function VideoPortfolioShowcase({ items }: { items: PortfolioItem[] }) {
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null)

  const videoItems = items.filter(item => item.video_url)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedVideo(item)}
          >
            <Card className="overflow-hidden">
              <div className="relative h-48 bg-black">
                <video
                  src={item.video_url}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-0">
          {selectedVideo && (
            <div className="relative">
              <Button
                onClick={() => setSelectedVideo(null)}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
              
              <video
                src={selectedVideo.video_url}
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh]"
              />
              
              <div className="p-6 bg-white dark:bg-gray-900">
                <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedVideo.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Interactive Portfolio Gallery
export function InteractivePortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))]
  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.category === activeTab)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === 'all' ? 'All Work' : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Portfolio Display */}
      <EnhancedPortfolioShowcase
        items={filteredItems}
        layout={viewMode === 'grid' ? 'grid' : 'grid'}
        showFilters={false}
        allowFullscreen={true}
      />
    </div>
  )
}