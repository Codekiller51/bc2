import { supabase } from '@/lib/supabase/client'
import { ApiErrorHandler } from '@/lib/api/error-handler'
import { UnifiedDatabaseService } from './unified-database-service'
import type { User } from '@/lib/database/types'

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  location: string
  userType: 'client' | 'creative'
  profession?: string
  company_name?: string
  industry?: string
}

export interface AuthResult {
  success: boolean
  user?: any
  error?: string
}

export class EnhancedAuthService {
  // =============================================
  // AUTHENTICATION METHODS
  // =============================================

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Auth error:', error)
        return null
      }
      
      if (!user) return null

      // Get user profile data
      return await UnifiedDatabaseService.getCurrentUser()
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          // Resend verification email
          await supabase.auth.resend({
            type: 'signup',
            email: credentials.email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/verify`
            }
          })
          throw new Error('Please verify your email address. A new verification email has been sent.')
        }
        throw error
      }

      return { success: true, user: data.user }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  static async register(data: RegisterData): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            full_name: data.name,
            phone: data.phone,
            location: data.location,
            user_type: data.userType,
            role: data.userType,
            category: data.userType === 'creative' ? 'General' : undefined,
            profession: data.profession,
            company_name: data.company_name,
            industry: data.industry
          }
        }
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  static async logout(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      return { success: true }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  static async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  static async updateEmail(newEmail: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  // =============================================
  // SESSION MANAGEMENT
  // =============================================

  static async refreshSession(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) throw error

      return { success: true, user: data.user }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error

      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  // =============================================
  // PROFILE MANAGEMENT
  // =============================================

  static async updateProfile(updates: Partial<User>): Promise<AuthResult> {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('No user logged in')

      if (user.role === 'creative') {
        const profile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
        if (profile) {
          await UnifiedDatabaseService.updateCreativeProfile(profile.id, updates as any)
        }
      } else {
        await UnifiedDatabaseService.updateClientProfile(user.id, updates as any)
      }

      return { success: true }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  // =============================================
  // ROLE AND PERMISSION CHECKS
  // =============================================

  static async hasRole(role: 'client' | 'creative' | 'admin'): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      return user?.role === role
    } catch (error) {
      console.error('Error checking user role:', error)
      return false
    }
  }

  static async isAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user?.user_metadata?.role === 'admin'
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  static async isApproved(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      return user?.approved === true
    } catch (error) {
      console.error('Error checking approval status:', error)
      return false
    }
  }

  // =============================================
  // ADMIN FUNCTIONS
  // =============================================

  static async adminLogin(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error

      // Check if user is admin
      const userRole = data.user?.user_metadata?.role
      if (userRole !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Access denied. Admin credentials required.')
      }

      return { success: true, user: data.user }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  static async createAdminUser(email: string, password: string, name: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: name,
          role: 'admin'
        }
      })

      if (error) throw error

      return { success: true, user: data.user }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  // =============================================
  // VERIFICATION METHODS
  // =============================================

  static async verifyEmail(token: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  static async resendVerificationEmail(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error)
      return { success: false, error: apiError.message }
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  static async signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  static getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  }
}

export default EnhancedAuthService