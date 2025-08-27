import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 mobile-padding">
      <Card className="card-brand max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-brand-600 mb-4">404</div>
          <h1 className="text-h2 mb-4">Page Not Found</h1>
          <p className="text-body text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.history.back()} className="btn-secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link to="/">
              <Button className="btn-primary">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}