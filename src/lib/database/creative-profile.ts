export interface CreativeProfile {
  id: string
  user_id: string
  title: string
  category: string
  bio?: string
  skills?: string[]
  hourly_rate?: number
  rating: number
  reviews_count: number
  completed_projects: number
  location?: string
  phone?: string
  email?: string
  avatar_url?: string
  portfolio_url?: string
  availability_status: 'available' | 'busy' | 'unavailable'
  approval_status: 'pending' | 'approved' | 'rejected'
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  
  // Related data
  services?: Service[]
  portfolio_items?: PortfolioItem[]
  reviews?: Review[]
  availability?: CreativeAvailability
}

export interface Service {
  id: string
  creative_id: string
  name: string
  description?: string
  price: number
  duration: number
  category?: string
  active: boolean
  created_at: string
}

export interface PortfolioItem {
  id: string
  creative_id: string
  title: string
  description?: string
  image_url?: string
  category?: string
  project_url?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  client_id: string
  creative_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
  client?: {
    full_name: string
    avatar_url?: string
  }
}

export interface CreativeAvailability {
  id: string
  creative_id: string
  recurring_availability: Record<string, {
    start: string
    end: string
    isAvailable: boolean
  }>
  buffer_time: number
  created_at: string
  updated_at: string
}