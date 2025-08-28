import { AnalyticsService } from './analytics-service'

export interface ErrorReport {
  id: string
  message: string
  stack?: string
  url: string
  userAgent: string
  userId?: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
}

export class ErrorMonitoringService {
  private static errors: ErrorReport[] = []
  private static isEnabled = process.env.NODE_ENV === 'production'

  static init() {
    if (typeof window === 'undefined') return

    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      })
    })

    // React error boundary integration
    if ((window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__) {
      const originalCaptureException = (window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.captureException
      ;(window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.captureException = (error: Error) => {
        this.captureError(error, { type: 'react_error' })
        if (originalCaptureException) {
          originalCaptureException(error)
        }
      }
    }
  }

  static captureError(
    error: Error,
    context?: Record<string, any>,
    severity: ErrorReport['severity'] = 'medium'
  ): string {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const errorReport: ErrorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      severity,
      context
    }

    // Store error locally
    this.errors.push(errorReport)

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors.shift()
    }

    // Log to console in development
    if (!this.isEnabled) {
      console.error('Error captured:', errorReport)
    }

    // Send to monitoring service in production
    if (this.isEnabled) {
      this.sendToMonitoringService(errorReport)
    }

    // Track in analytics
    AnalyticsService.errorOccurred(error, context)

    return errorId
  }

  private static async sendToMonitoringService(errorReport: ErrorReport) {
    try {
      // In production, integrate with services like:
      // - Sentry
      // - LogRocket
      // - Bugsnag
      // - Custom error endpoint

      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      })
    } catch (error) {
      console.error('Failed to send error to monitoring service:', error)
    }
  }

  static getErrors(filters?: {
    severity?: ErrorReport['severity']
    userId?: string
    timeRange?: { start: Date; end: Date }
  }): ErrorReport[] {
    let filteredErrors = [...this.errors]

    if (filters?.severity) {
      filteredErrors = filteredErrors.filter(e => e.severity === filters.severity)
    }

    if (filters?.userId) {
      filteredErrors = filteredErrors.filter(e => e.userId === filters.userId)
    }

    if (filters?.timeRange) {
      filteredErrors = filteredErrors.filter(e => 
        e.timestamp >= filters.timeRange!.start && 
        e.timestamp <= filters.timeRange!.end
      )
    }

    return filteredErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  static getErrorStats(): {
    total: number
    bySeverity: Record<ErrorReport['severity'], number>
    byType: Record<string, number>
    recentErrors: ErrorReport[]
  } {
    const bySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    }

    const byType: Record<string, number> = {}

    this.errors.forEach(error => {
      bySeverity[error.severity]++
      
      const errorType = error.context?.type || 'unknown'
      byType[errorType] = (byType[errorType] || 0) + 1
    })

    return {
      total: this.errors.length,
      bySeverity,
      byType,
      recentErrors: this.errors.slice(0, 10)
    }
  }

  static clearErrors() {
    this.errors = []
  }

  // Performance monitoring
  static measurePerformance<T>(
    operation: string,
    fn: () => T | Promise<T>
  ): T | Promise<T> {
    const start = performance.now()
    
    try {
      const result = fn()
      
      if (result instanceof Promise) {
        return result
          .then(value => {
            const duration = performance.now() - start
            this.recordPerformanceMetric(operation, duration, 'success')
            return value
          })
          .catch(error => {
            const duration = performance.now() - start
            this.recordPerformanceMetric(operation, duration, 'error')
            this.captureError(error, { operation, duration })
            throw error
          })
      } else {
        const duration = performance.now() - start
        this.recordPerformanceMetric(operation, duration, 'success')
        return result
      }
    } catch (error) {
      const duration = performance.now() - start
      this.recordPerformanceMetric(operation, duration, 'error')
      this.captureError(error as Error, { operation, duration })
      throw error
    }
  }

  private static recordPerformanceMetric(
    operation: string,
    duration: number,
    status: 'success' | 'error'
  ) {
    // In production, send to performance monitoring service
    if (this.isEnabled) {
      // Example: Send to your analytics service
      AnalyticsService.track({
        name: 'performance_metric',
        properties: {
          operation,
          duration,
          status
        }
      })
    } else {
      console.log(`Performance: ${operation} took ${duration.toFixed(2)}ms (${status})`)
    }
  }

  // User feedback integration
  static captureUserFeedback(
    errorId: string,
    feedback: {
      description: string
      email?: string
      reproductionSteps?: string
    }
  ) {
    const error = this.errors.find(e => e.id === errorId)
    if (error) {
      error.context = {
        ...error.context,
        userFeedback: feedback
      }

      if (this.isEnabled) {
        this.sendToMonitoringService(error)
      }
    }
  }

  // Health check
  static getSystemHealth(): {
    status: 'healthy' | 'degraded' | 'down'
    errorRate: number
    criticalErrors: number
    lastError?: ErrorReport
  } {
    const recentErrors = this.errors.filter(e => 
      e.timestamp.getTime() > Date.now() - (60 * 60 * 1000) // Last hour
    )

    const criticalErrors = recentErrors.filter(e => e.severity === 'critical').length
    const errorRate = recentErrors.length / 60 // Errors per minute

    let status: 'healthy' | 'degraded' | 'down' = 'healthy'
    
    if (criticalErrors > 0) {
      status = 'down'
    } else if (errorRate > 5) {
      status = 'degraded'
    }

    return {
      status,
      errorRate,
      criticalErrors,
      lastError: this.errors[0]
    }
  }
}

// Initialize error monitoring
if (typeof window !== 'undefined') {
  ErrorMonitoringService.init()
}

export default ErrorMonitoringService