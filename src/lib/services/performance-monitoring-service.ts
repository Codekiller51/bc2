export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count' | 'percentage'
  timestamp: Date
  tags?: Record<string, string>
}

export interface WebVital {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: Date
}

export class PerformanceMonitoringService {
  private static metrics: PerformanceMetric[] = []
  private static webVitals: WebVital[] = []
  private static isEnabled = process.env.NODE_ENV === 'production'

  static init() {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    this.initWebVitalsMonitoring()
    
    // Monitor resource loading
    this.initResourceMonitoring()
    
    // Monitor navigation timing
    this.initNavigationMonitoring()
    
    // Monitor memory usage
    this.initMemoryMonitoring()
  }

  private static initWebVitalsMonitoring() {
    // First Contentful Paint (FCP)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.recordWebVital('FCP', entry.startTime)
        }
      }
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordWebVital('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordWebVital('FID', (entry as any).processingStart - entry.startTime)
      }
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      this.recordWebVital('CLS', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }

  private static initResourceMonitoring() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming
        
        this.recordMetric({
          name: 'resource_load_time',
          value: resource.responseEnd - resource.startTime,
          unit: 'ms',
          timestamp: new Date(),
          tags: {
            resource_type: resource.initiatorType,
            resource_name: resource.name
          }
        })
      }
    }).observe({ entryTypes: ['resource'] })
  }

  private static initNavigationMonitoring() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.recordMetric({
        name: 'page_load_time',
        value: navigation.loadEventEnd - navigation.fetchStart,
        unit: 'ms',
        timestamp: new Date()
      })

      this.recordMetric({
        name: 'dom_content_loaded',
        value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        unit: 'ms',
        timestamp: new Date()
      })

      this.recordWebVital('TTFB', navigation.responseStart - navigation.requestStart)
    })
  }

  private static initMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        
        this.recordMetric({
          name: 'memory_used',
          value: memory.usedJSHeapSize,
          unit: 'bytes',
          timestamp: new Date()
        })

        this.recordMetric({
          name: 'memory_total',
          value: memory.totalJSHeapSize,
          unit: 'bytes',
          timestamp: new Date()
        })
      }, 30000) // Every 30 seconds
    }
  }

  private static recordWebVital(name: WebVital['name'], value: number) {
    let rating: WebVital['rating'] = 'good'
    
    // Define thresholds based on Core Web Vitals standards
    switch (name) {
      case 'FCP':
        rating = value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
        break
      case 'LCP':
        rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
        break
      case 'FID':
        rating = value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
        break
      case 'CLS':
        rating = value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
        break
      case 'TTFB':
        rating = value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
        break
    }

    const webVital: WebVital = {
      name,
      value,
      rating,
      timestamp: new Date()
    }

    this.webVitals.push(webVital)

    // Keep only last 100 measurements
    if (this.webVitals.length > 100) {
      this.webVitals.shift()
    }

    // Send to analytics
    if (this.isEnabled) {
      this.sendWebVitalToAnalytics(webVital)
    }

    console.log(`Web Vital - ${name}: ${value.toFixed(2)} (${rating})`)
  }

  static recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift()
    }

    // Send to monitoring service in production
    if (this.isEnabled) {
      this.sendMetricToService(metric)
    }
  }

  private static async sendWebVitalToAnalytics(webVital: WebVital) {
    try {
      await fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webVital)
      })
    } catch (error) {
      console.error('Failed to send web vital to analytics:', error)
    }
  }

  private static async sendMetricToService(metric: PerformanceMetric) {
    try {
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      })
    } catch (error) {
      console.error('Failed to send metric to service:', error)
    }
  }

  // Public API methods
  static getMetrics(filters?: {
    name?: string
    timeRange?: { start: Date; end: Date }
  }): PerformanceMetric[] {
    let filtered = [...this.metrics]

    if (filters?.name) {
      filtered = filtered.filter(m => m.name === filters.name)
    }

    if (filters?.timeRange) {
      filtered = filtered.filter(m => 
        m.timestamp >= filters.timeRange!.start && 
        m.timestamp <= filters.timeRange!.end
      )
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  static getWebVitals(): WebVital[] {
    return [...this.webVitals].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  static getPerformanceScore(): {
    score: number
    breakdown: Record<WebVital['name'], { value: number; rating: WebVital['rating'] }>
  } {
    const latestVitals = this.getLatestWebVitals()
    let totalScore = 0
    let vitalCount = 0

    const breakdown: Record<WebVital['name'], { value: number; rating: WebVital['rating'] }> = {} as any

    Object.entries(latestVitals).forEach(([name, vital]) => {
      if (vital) {
        breakdown[name as WebVital['name']] = {
          value: vital.value,
          rating: vital.rating
        }

        // Convert rating to score
        const score = vital.rating === 'good' ? 100 : vital.rating === 'needs-improvement' ? 50 : 0
        totalScore += score
        vitalCount++
      }
    })

    return {
      score: vitalCount > 0 ? Math.round(totalScore / vitalCount) : 0,
      breakdown
    }
  }

  private static getLatestWebVitals(): Partial<Record<WebVital['name'], WebVital>> {
    const latest: Partial<Record<WebVital['name'], WebVital>> = {}
    
    this.webVitals.forEach(vital => {
      if (!latest[vital.name] || vital.timestamp > latest[vital.name]!.timestamp) {
        latest[vital.name] = vital
      }
    })

    return latest
  }

  // Bundle size monitoring
  static async analyzeBundleSize(): Promise<{
    totalSize: number
    chunks: Array<{ name: string; size: number }>
    recommendations: string[]
  }> {
    try {
      const response = await fetch('/api/performance/bundle-analysis')
      return await response.json()
    } catch (error) {
      console.error('Failed to analyze bundle size:', error)
      return {
        totalSize: 0,
        chunks: [],
        recommendations: []
      }
    }
  }

  // Network monitoring
  static monitorNetworkRequests() {
    const originalFetch = window.fetch
    
    window.fetch = async (...args) => {
      const start = performance.now()
      const url = typeof args[0] === 'string' ? args[0] : args[0].url
      
      try {
        const response = await originalFetch(...args)
        const duration = performance.now() - start
        
        this.recordMetric({
          name: 'api_request_duration',
          value: duration,
          unit: 'ms',
          timestamp: new Date(),
          tags: {
            url,
            status: response.status.toString(),
            method: args[1]?.method || 'GET'
          }
        })

        return response
      } catch (error) {
        const duration = performance.now() - start
        
        this.recordMetric({
          name: 'api_request_duration',
          value: duration,
          unit: 'ms',
          timestamp: new Date(),
          tags: {
            url,
            status: 'error',
            method: args[1]?.method || 'GET'
          }
        })

        throw error
      }
    }
  }

  // User session monitoring
  static startSessionMonitoring(userId: string) {
    const sessionStart = Date.now()
    
    // Track page views
    let pageViews = 0
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    const trackPageView = () => {
      pageViews++
      this.recordMetric({
        name: 'page_view',
        value: pageViews,
        unit: 'count',
        timestamp: new Date(),
        tags: { userId, page: window.location.pathname }
      })
    }

    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      trackPageView()
    }

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      trackPageView()
    }

    window.addEventListener('popstate', trackPageView)

    // Track session duration on page unload
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - sessionStart
      
      this.recordMetric({
        name: 'session_duration',
        value: sessionDuration,
        unit: 'ms',
        timestamp: new Date(),
        tags: { userId, pageViews: pageViews.toString() }
      })
    })

    // Initial page view
    trackPageView()
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  PerformanceMonitoringService.init()
  PerformanceMonitoringService.monitorNetworkRequests()
}

export default PerformanceMonitoringService