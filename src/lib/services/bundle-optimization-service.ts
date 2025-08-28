export interface BundleAnalysis {
  totalSize: number
  gzippedSize: number
  chunks: Array<{
    name: string
    size: number
    gzippedSize: number
    modules: string[]
  }>
  recommendations: Array<{
    type: 'warning' | 'error' | 'info'
    message: string
    impact: 'high' | 'medium' | 'low'
  }>
  duplicates: Array<{
    module: string
    occurrences: number
    totalSize: number
  }>
}

export class BundleOptimizationService {
  private static readonly SIZE_THRESHOLDS = {
    CHUNK_WARNING: 250 * 1024, // 250KB
    CHUNK_ERROR: 500 * 1024,   // 500KB
    TOTAL_WARNING: 1024 * 1024, // 1MB
    TOTAL_ERROR: 2048 * 1024    // 2MB
  }

  static async analyzeBundleSize(): Promise<BundleAnalysis> {
    try {
      // In a real implementation, this would analyze the actual bundle
      // For now, we'll simulate the analysis
      
      const mockAnalysis: BundleAnalysis = {
        totalSize: 1.2 * 1024 * 1024, // 1.2MB
        gzippedSize: 0.4 * 1024 * 1024, // 400KB
        chunks: [
          {
            name: 'main',
            size: 800 * 1024,
            gzippedSize: 250 * 1024,
            modules: ['react', 'react-dom', 'framer-motion', '@supabase/supabase-js']
          },
          {
            name: 'vendor',
            size: 300 * 1024,
            gzippedSize: 100 * 1024,
            modules: ['lucide-react', '@radix-ui/react-*', 'tailwindcss']
          },
          {
            name: 'pages',
            size: 100 * 1024,
            gzippedSize: 50 * 1024,
            modules: ['pages/*', 'components/*']
          }
        ],
        recommendations: [],
        duplicates: []
      }

      // Generate recommendations
      mockAnal ysis.recommendations = this.generateRecommendations(mockAnalysis)
      mockAnalysis.duplicates = this.findDuplicates(mockAnalysis)

      return mockAnalysis
    } catch (error) {
      console.error('Failed to analyze bundle:', error)
      throw error
    }
  }

  private static generateRecommendations(analysis: BundleAnalysis): BundleAnalysis['recommendations'] {
    const recommendations: BundleAnalysis['recommendations'] = []

    // Check total bundle size
    if (analysis.totalSize > this.SIZE_THRESHOLDS.TOTAL_ERROR) {
      recommendations.push({
        type: 'error',
        message: `Total bundle size (${this.formatSize(analysis.totalSize)}) exceeds recommended limit`,
        impact: 'high'
      })
    } else if (analysis.totalSize > this.SIZE_THRESHOLDS.TOTAL_WARNING) {
      recommendations.push({
        type: 'warning',
        message: `Total bundle size (${this.formatSize(analysis.totalSize)}) is approaching the limit`,
        impact: 'medium'
      })
    }

    // Check individual chunks
    analysis.chunks.forEach(chunk => {
      if (chunk.size > this.SIZE_THRESHOLDS.CHUNK_ERROR) {
        recommendations.push({
          type: 'error',
          message: `Chunk "${chunk.name}" (${this.formatSize(chunk.size)}) is too large`,
          impact: 'high'
        })
      } else if (chunk.size > this.SIZE_THRESHOLDS.CHUNK_WARNING) {
        recommendations.push({
          type: 'warning',
          message: `Chunk "${chunk.name}" (${this.formatSize(chunk.size)}) could be optimized`,
          impact: 'medium'
        })
      }
    })

    // Check compression ratio
    const compressionRatio = analysis.gzippedSize / analysis.totalSize
    if (compressionRatio > 0.7) {
      recommendations.push({
        type: 'warning',
        message: 'Poor compression ratio suggests large binary assets or unoptimized code',
        impact: 'medium'
      })
    }

    // General optimization suggestions
    recommendations.push({
      type: 'info',
      message: 'Consider implementing code splitting for better performance',
      impact: 'medium'
    })

    recommendations.push({
      type: 'info',
      message: 'Use dynamic imports for non-critical components',
      impact: 'low'
    })

    return recommendations
  }

  private static findDuplicates(analysis: BundleAnalysis): BundleAnalysis['duplicates'] {
    const moduleCount: Record<string, { count: number; size: number }> = {}

    analysis.chunks.forEach(chunk => {
      chunk.modules.forEach(module => {
        if (!moduleCount[module]) {
          moduleCount[module] = { count: 0, size: 0 }
        }
        moduleCount[module].count++
        moduleCount[module].size += chunk.size / chunk.modules.length // Approximate
      })
    })

    return Object.entries(moduleCount)
      .filter(([_, data]) => data.count > 1)
      .map(([module, data]) => ({
        module,
        occurrences: data.count,
        totalSize: data.size
      }))
      .sort((a, b) => b.totalSize - a.totalSize)
  }

  private static formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  // Image optimization recommendations
  static async analyzeImageOptimization(): Promise<{
    totalImages: number
    unoptimizedImages: Array<{
      src: string
      currentSize: number
      recommendedFormat: string
      potentialSavings: number
    }>
    recommendations: string[]
  }> {
    const images = document.querySelectorAll('img')
    const unoptimizedImages: any[] = []
    const recommendations: string[] = []

    images.forEach(img => {
      const src = img.src
      
      // Check for unoptimized formats
      if (src.includes('.png') && !src.includes('logo')) {
        unoptimizedImages.push({
          src,
          currentSize: 0, // Would need actual size analysis
          recommendedFormat: 'WebP',
          potentialSavings: 30 // Estimated percentage
        })
      }

      // Check for missing lazy loading
      if (!img.loading || img.loading !== 'lazy') {
        if (!recommendations.includes('Implement lazy loading for images')) {
          recommendations.push('Implement lazy loading for images')
        }
      }
    })

    // General recommendations
    if (unoptimizedImages.length > 0) {
      recommendations.push('Convert PNG images to WebP format for better compression')
    }

    recommendations.push('Use responsive images with srcset for different screen sizes')
    recommendations.push('Implement image CDN for faster loading')

    return {
      totalImages: images.length,
      unoptimizedImages,
      recommendations
    }
  }

  // Code splitting recommendations
  static generateCodeSplittingRecommendations(): string[] {
    return [
      'Split admin pages into separate chunks',
      'Lazy load dashboard components',
      'Create separate chunks for different user roles',
      'Split large third-party libraries',
      'Use dynamic imports for modal components',
      'Separate authentication flows into own chunk'
    ]
  }

  // Performance optimization suggestions
  static generatePerformanceOptimizations(): Array<{
    category: string
    suggestions: string[]
    impact: 'high' | 'medium' | 'low'
  }> {
    return [
      {
        category: 'Bundle Size',
        suggestions: [
          'Implement tree shaking for unused code',
          'Use dynamic imports for route-based code splitting',
          'Optimize third-party library imports',
          'Remove unused dependencies'
        ],
        impact: 'high'
      },
      {
        category: 'Image Optimization',
        suggestions: [
          'Convert images to WebP format',
          'Implement responsive images',
          'Use image CDN for faster delivery',
          'Add lazy loading for below-fold images'
        ],
        impact: 'high'
      },
      {
        category: 'Caching',
        suggestions: [
          'Implement service worker for offline support',
          'Use browser caching for static assets',
          'Implement API response caching',
          'Use CDN for static file delivery'
        ],
        impact: 'medium'
      },
      {
        category: 'Runtime Performance',
        suggestions: [
          'Optimize React re-renders with useMemo/useCallback',
          'Implement virtual scrolling for large lists',
          'Debounce search inputs',
          'Use React.lazy for component lazy loading'
        ],
        impact: 'medium'
      },
      {
        category: 'Database',
        suggestions: [
          'Add database indexes for frequently queried columns',
          'Implement query result caching',
          'Optimize N+1 query problems',
          'Use database connection pooling'
        ],
        impact: 'high'
      }
    ]
  }
}

export default BundleOptimizationService