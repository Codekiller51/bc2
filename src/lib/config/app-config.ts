export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || "Brand Connect",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  url: import.meta.env.VITE_SITE_URL || "http://localhost:3000",
  
  // Feature flags
  features: {
    chat: import.meta.env.VITE_ENABLE_CHAT === "true",
    payments: import.meta.env.VITE_ENABLE_PAYMENTS === "true",
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === "true",
  },
  
  // API endpoints
  api: {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL!,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    },
    openrouter: {
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    },
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: "emerald",
      radius: "0.5rem",
    },
    pagination: {
      defaultPageSize: 10,
      maxPageSize: 100,
    },
    upload: {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    },
  },
  
  // Business rules
  business: {
    commission: {
      rate: 0.1, // 10%
      minimum: 1000, // TZS
    },
    booking: {
      advanceBookingDays: 90,
      cancellationHours: 24,
    },
    rating: {
      minRating: 1,
      maxRating: 5,
    },
  },
} as const

export type AppConfig = typeof appConfig