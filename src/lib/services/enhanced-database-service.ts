import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type {
  User,
  CreativeProfile,
  Booking,
  Conversation,
  Message,
  Notification,
  Database
} from '@/lib/database/types'

import { supabase } from '@/lib/supabase/client'

export class EnhancedDatabaseService {
  private static supabase = supabase

  // User Management
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error || !user) return null;

    // Get additional user data from profiles
    const { data: clientProfileData } = await this.supabase
      .from('client_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (clientProfileData) {
      const profile = clientProfileData as Database['public']['Tables']['client_profiles']['Row'];
      return {
        id: user.id,
        email: user.email!,
        full_name: profile.full_name || 'User',
        phone: profile.phone,
        role: 'client',
        location: profile.location,
        verified: user.email_confirmed_at !== null,
        approved: false,
        created_at: user.created_at,
        updated_at: profile.updated_at
      };
    }

    // Check creative profile
    const { data: creativeProfileData } = await this.supabase
      .from('creative_profiles')
      .select('*, users(*)')
      .eq('user_id', user.id)
      .single();

    if (creativeProfileData) {
      const creativeProfile = creativeProfileData as Database['public']['Tables']['creative_profiles']['Row'] & { users: Database['public']['Tables']['users']['Row'] };
      return {
        id: user.id,
        email: user.email!,
        full_name: creativeProfile.users?.full_name || 'Creative',
        phone: creativeProfile.users?.phone,
        role: 'creative',
        location: creativeProfile.users?.location,
        verified: user.email_confirmed_at !== null,
        approved: false,
        created_at: user.created_at,
        updated_at: creativeProfile.updated_at
      };
    }

    return null;
  }

  // Creative Profiles
  static async getCreativeProfiles(filters?: {
    category?: string
    location?: string
    rating?: number
    search?: string
    approvalStatus?: string
  }): Promise<CreativeProfile[]> {
    let query = this.supabase
      .from('creative_profiles')
      .select('*')

    // Only show approved creatives by default (unless admin is filtering)
    if (!filters?.approvalStatus) {
      query = query.eq('approval_status', 'approved')
    } else if (filters.approvalStatus !== 'all') {
      query = query.eq('approval_status', filters.approvalStatus)
    }

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.location) {
      query = query.eq('location', filters.location)
    }

    if (filters?.rating) {
      query = query.gte('rating', filters.rating)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order('rating', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch creative profiles: ${error.message}`)
    }

    return data || []
  }

  static async getCreativeProfileById(id: string): Promise<CreativeProfile | null> {
    const { data, error } = await this.supabase
      .from('creative_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to fetch creative profile: ${error.message}`)
    }

    return data
  }

  static async getCreativeProfileByUserId(userId: string): Promise<CreativeProfile | null> {
    const { data, error } = await this.supabase
      .from('creative_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to fetch creative profile: ${error.message}`)
    }

    return data
  }

  static async updateCreativeProfile(
    id: string, 
    updates: Partial<CreativeProfile>
  ): Promise<CreativeProfile> {
    const { data, error } = await this.supabase
      .from('creative_profiles')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update creative profile: ${error.message}`)
    }

    return data
  }

  // Bookings
  static async getBookings(filters?: {
    userId?: string
    status?: string
    creativeId?: string
  }): Promise<Booking[]> {
    let query = this.supabase
      .from('bookings')
      .select(`
        *,
        client:client_profiles(*),
        creative:creative_profiles(*),
        service:services(*)
      `)

    if (filters?.userId) {
      query = query.or(`client_id.eq.${filters.userId},creative_id.eq.${filters.userId}`)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.creativeId) {
      query = query.eq('creative_id', filters.creativeId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`)
    }

    return data || []
  }

  static async createBooking(bookingData: {
    creative_id: string
    service_id: string
    start_time: string
    end_time: string
    total_amount: number
    notes?: string
  }): Promise<Booking> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await this.supabase
      .from('bookings')
      .insert(bookingData as Database['public']['Tables']['bookings']['Insert'])
      .select(`
        *,
        client:client_profiles(*),
        creative:creative_profiles(*),
        service:services(*)
      `)
      .single() as { data: Booking | null; error: Error | null }

    if (error) {
      throw new Error(`Failed to create booking: ${error.message}`)
    }

    return data
  }

  static async updateBookingStatus(
    bookingId: string, 
    status: string
  ): Promise<Booking> {
    const { data, error } = await this.supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select(`
        *,
        client:client_profiles(*),
        creative:creative_profiles(*),
        service:services(*)
      `)
      .single()

    if (error) {
      throw new Error(`Failed to update booking status: ${error.message}`)
    }

    return data
  }

  // Conversations and Messages
  static async getAllConversations(): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select(`
        *,
        client:client_profiles(*),
        creative:creative_profiles(*),
        booking:bookings(*)
      `)
      .order('last_message_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch all conversations: ${error.message}`)
    }

    return data || []
  }

  static async getAllMessages(): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select(`
        *,
        sender:auth.users(*)
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.warn('Could not fetch messages with sender info:', error.message)
      // Fallback to basic message fetch
      const { data: basicMessages, error: basicError } = await this.supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (basicError) {
        throw new Error(`Failed to fetch messages: ${basicError.message}`)
      }

      return basicMessages || []
    }

    return data || []
  }

  static async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .or(`client_id.eq.${userId},creative_id.eq.${userId}`)
      .order('last_message_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`)
    }

    return data || []
  }

  static async createConversation(data: {
    booking_id?: string
    client_id: string
    creative_id: string
    status: string
  }): Promise<Conversation> {
    const { data: conversation, error } = await this.supabase
      .from('conversations')
      .insert(data as Database['public']['Tables']['conversations']['Insert'])
      .select('*')
      .single() as { data: Conversation | null; error: Error | null }

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`)
    }

    return conversation
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`)
    }

    return data || []
  }

  static async sendMessage(messageData: {
    conversation_id: string
    sender_id: string
    content: string
    message_type: string
  }): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert(messageData as Database['public']['Tables']['messages']['Insert'])
      .select('*')
      .single() as { data: Message | null; error: Error | null }

    if (error) {
      throw new Error(`Failed to send message: ${error.message}`)
    }

    // Update conversation last_message_at
    await this.supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', messageData.conversation_id)

    return data
  }

  static async markMessagesAsRead(
    conversationId: string, 
    userId: string
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .is('read_at', null)

    if (error) {
      console.error('Failed to mark messages as read:', error)
      return false
    }

    return true
  }

  // Real-time Subscriptions
  static subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    return this.supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        callback(payload.new as Message)
      })
      .subscribe()
  }

  static subscribeToBookingUpdates(
    userId: string,
    callback: (booking: Booking) => void
  ) {
    return this.supabase
      .channel(`bookings:${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `client_id=eq.${userId}`
      }, (payload) => {
        callback(payload.new as Booking)
      })
      .subscribe()
  }

  // Notifications
  static async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`)
    }

    return data || []
  }

  static async createNotification(
    notificationData: Partial<Notification>
  ): Promise<Notification> {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert(notificationData as Database['public']['Tables']['notifications']['Insert'])
      .select()
      .single() as { data: Notification | null; error: Error | null }

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`)
    }

    return data
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)

    if (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`)
    }
  }

  // Analytics and Admin Functions
  static async getAnalytics(dateRange?: { from: string; to: string }) {
    const queries = [
      this.supabase.from('bookings').select('count', { count: 'exact' }),
      this.supabase.from('creative_profiles').select('count', { count: 'exact' }),
      this.supabase.from('client_profiles').select('count', { count: 'exact' }),
    ]

    if (dateRange) {
      queries.forEach(query => {
        query.gte('created_at', dateRange.from)
        query.lte('created_at', dateRange.to)
      })
    }

    const [bookingsResult, creativesResult, clientsResult] = await Promise.all(queries);

    const { count: pendingApprovalsCount } = await this.supabase
      .from('creative_profiles')
      .select('count', { count: 'exact' })
      .eq('approval_status', 'pending')
      .single();

    const { data: totalRevenueData } = await this.supabase
      .from('bookings')
      .select('total_amount')
      .eq('status', 'completed');

    const totalRevenue = totalRevenueData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    return {
      totalBookings: bookingsResult.count || 0,
      totalCreatives: creativesResult.count || 0,
      totalClients: clientsResult.count || 0,
      pendingApprovals: pendingApprovalsCount || 0,
      totalRevenue: totalRevenue,
      monthlyGrowth: 12.5, // This would be calculated from historical data
      averageRating: 4.8 // This would be calculated from reviews
    };
  }

  // Admin-specific functions
  static async getUsers(filters?: {
    role?: string
    status?: string
    search?: string
  }): Promise<User[]> {
    const users: User[] = []

    try {
      // Get client profiles - they have user data directly
      const { data: clientProfiles, error: clientError } = await this.supabase
        .from('client_profiles')
        .select('*') as { data: User[] | null; error: Error | null }

      if (clientError) {
        console.warn('Could not fetch client profiles:', clientError.message)
      }

      // Get creative profiles with user relationship
      const { data: creativeProfiles, error: creativeError } = await this.supabase
        .from('creative_profiles')
        .select('*') as { data: CreativeProfile[] | null; error: Error | null }

      if (creativeError) {
        console.warn('Could not fetch creative profiles:', creativeError.message)
      }

      // Convert client profiles to User type
      if (clientProfiles) {
        clientProfiles.forEach(profile => {
          users.push({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name || 'Client User',
            phone: profile.phone,
            role: 'client',
            location: profile.location,
            verified: true,
            approved: true,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          })
        })
      }

      // Convert creative profiles to User type
      if (creativeProfiles) {
        creativeProfiles.forEach(profile => {
          users.push({
            id: profile.user_id,
            email: profile.email || 'N/A',
            full_name: profile.user?.full_name || profile.title || 'Creative User',
            phone: profile.phone,
            role: 'creative',
            location: profile.location,
            verified: true,
            approved: profile.approval_status === 'approved',
            created_at: profile.created_at,
            updated_at: profile.updated_at
          })
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Return empty array instead of throwing to prevent app crash
      return []
    }

    // Apply filters
    let filteredUsers = users

    if (filters?.role && filters.role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredUsers = filteredUsers.filter(user => 
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    return filteredUsers
  }

  // User Registration Helper Methods
  static async createClientProfile(userData: {
    id: string
    email: string
    full_name: string
    phone?: string
    location?: string
  }) {
    const { data, error } = await this.supabase
      .from('client_profiles')
      .insert(userData as Database['public']['Tables']['client_profiles']['Insert'])
      .select()
      .single() as { data: User | null; error: Error | null }

    if (error) {
      throw new Error(`Failed to create client profile: ${error.message}`)
    }

    return data
  }

  static async createCreativeProfile(userData: {
    user_id: string
    title: string
    category: string
    bio?: string
    hourly_rate?: number
  }) {
    const { data, error } = await this.supabase
      .from('creative_profiles')
      .insert(userData as Database['public']['Tables']['creative_profiles']['Insert'])
      .select()
      .single() as { data: CreativeProfile | null; error: Error | null }

    if (error) {
      throw new Error(`Failed to create creative profile: ${error.message}`)
    }

    return data
  }

  static async getDashboardStats() {
    try {
      const [
        totalBookings,
        totalCreatives,
        totalClients,
        pendingApprovals,
        totalRevenue
      ] = await Promise.all([
        this.supabase.from('bookings').select('count', { count: 'exact' }),
      this.supabase.from('creative_profiles').select('count', { count: 'exact' }),
      this.supabase.from('client_profiles').select('count', { count: 'exact' }),
      this.supabase.from('creative_profiles').select('count', { count: 'exact' }).eq('approval_status', 'pending'),
      this.supabase.from('bookings').select('total_amount').eq('status', 'completed')
      ])

      const { data: totalRevenueData } = await this.supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'completed');

      const revenue = totalRevenueData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

      return {
        totalBookings: totalBookings.count || 0,
        totalCreatives: totalCreatives.count || 0,
        totalClients: totalClients.count || 0,
        pendingApprovals: pendingApprovals.count || 0,
        totalRevenue: revenue,
        monthlyGrowth: 12.5, // This would be calculated from historical data
        averageRating: 4.8 // This would be calculated from reviews
      };
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      // Return default stats to prevent app crash
      return {
        totalBookings: 0,
        totalCreatives: 0,
        totalClients: 0,
        pendingApprovals: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        averageRating: 0
      }
    }
  }

  // Profile Management Methods
  static async updateClientProfile(
    userId: string,
    updates: {
      full_name?: string
      phone?: string
      location?: string
      company_name?: string
      industry?: string
      avatar_url?: string
    }
  ) {
    const { data, error } = await this.supabase
      .from('client_profiles')
      .update(updates as Database['public']['Tables']['client_profiles']['Update'])
      .eq('id', userId)
      .select()
      .single() as { data: Database['public']['Tables']['client_profiles']['Row'] | null }

    if (error) {
      throw new Error(`Failed to update client profile: ${error.message}`)
    }

    return data
  }

  static async updatePassword(currentPassword: string, newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw new Error(`Failed to update password: ${error.message}`)
    }

    return true
  }

  static async updateUserEmail(newEmail: string) {
    const { error } = await this.supabase.auth.updateUser({
      email: newEmail
    })

    if (error) {
      throw new Error(`Failed to update email: ${error.message}`)
    }

    return true
  }

  static async uploadAvatar(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await this.supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(`Failed to upload avatar: ${uploadError.message}`)
    }

    const { data } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  static async deleteAccount(userId: string) {
    // This would require admin privileges in a real app
    const { error } = await this.supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(`Failed to delete account: ${error.message}`)
    }

    return true
  }

  static async exportUserData(userId: string) {
    const userData = {
      profile: null,
      bookings: [],
      messages: [],
      reviews: []
    }

    try {
      // Get user profile
      const { data: clientProfile } = await this.supabase
        .from('client_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (clientProfile) {
        userData.profile = clientProfile
      } else {
        const { data: creativeProfile } = await this.supabase
          .from('creative_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
        userData.profile = creativeProfile
      }

      // Get bookings
      const { data: bookings } = await this.supabase
        .from('bookings')
        .select('*')
        .or(`client_id.eq.${userId},creative_id.eq.${userId}`)

      userData.bookings = bookings || []

      // Get messages
      const { data: messages } = await this.supabase
        .from('messages')
        .select('*')
        .eq('sender_id', userId)

      userData.messages = messages || []

      // Get reviews
      const { data: reviews } = await this.supabase
        .from('reviews')
        .select('*')
        .eq('client_id', userId)

      userData.reviews = reviews || []

      return userData
    } catch (error) {
      throw new Error(`Failed to export user data: ${error.message}`)
    }
  }

  // Error handling utility
  static handleSupabaseError(error: any): Error {
    if (error.code === 'PGRST301') {
      return new Error('Unauthorized access');
    } else if (error.code === 'PGRST116') {
      return new Error('Resource not found');
    } else if (error.code === '23505') {
      return new Error('Duplicate entry');
    } else {
      return new Error(error.message || 'Database operation failed');
    }
  }

  // Reviews and Ratings
  static async createReview(reviewData: {
    booking_id: string
    client_id: string
    creative_id: string
    rating: number
    comment?: string
  }): Promise<Review> {
    const { data, error } = await this.supabase
      .from('reviews')
      .insert(reviewData as Database['public']['Tables']['reviews']['Insert'])
      .select()
      .single() as { data: Database['public']['Tables']['reviews']['Row'] | null }

    if (error) {
      throw new Error(`Failed to create review: ${error.message}`)
    }

    return data
  }

  static async getReviews(creativeId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        client:client_profiles(full_name, avatar_url)
      `)
      .eq('creative_id', creativeId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`)
    }

    return data || []
  }
}