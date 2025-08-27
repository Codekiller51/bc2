import { Link } from "react-router-dom"
import { BarChart, Camera, Palette, Video } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  title: string
  icon: string
  description: string
  href: string
}

export function CategoryCard({ title, icon, description, href }: CategoryCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Palette":
        return <Palette className="h-6 w-6 text-brand-600 dark:text-brand-400" />
      case "Camera":
        return <Camera className="h-6 w-6 text-brand-600 dark:text-brand-400" />
      case "Video":
        return <Video className="h-6 w-6 text-brand-600 dark:text-brand-400" />
      case "BarChart":
        return <BarChart className="h-6 w-6 text-brand-600 dark:text-brand-400" />
      default:
        return <Palette className="h-6 w-6 text-brand-600 dark:text-brand-400" />
    }
  }

  return (
    <Link to={href}>
      <Card className="card-interactive">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-brand-100 dark:bg-brand-900 rounded-xl">
            {getIcon(icon)}
          </div>
          <h3 className="text-h3">{title}</h3>
          <p className="text-body-sm text-muted-foreground text-center">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
