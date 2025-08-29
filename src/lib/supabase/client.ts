import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Singleton pattern to ensure only one Supabase client instance
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  // Return existing instance if it exists
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ahrxwjpfxbmnkaevbwsr.supabase.co'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocnh3anBmeGJtbmthZXZid3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzI3NjUsImV4cCI6MjA2Njk0ODc2NX0.j3be54uL1cugIlbIcmi7eeS1ixrSUMBbnlxmpA-mXpA'

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    })
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  try {
    // Create new instance and store it
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    })
    
    return supabaseInstance
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw new Error('Failed to initialize Supabase client')
  }
}

// Export a default instance for convenience
export const supabase = createClient()