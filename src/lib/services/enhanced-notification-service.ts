import type { Notification } from "@/lib/database/types"
import { formatCurrency } from "@/lib/utils/format"
import { supabase } from "@/lib/supabase/client"

export class EnhancedNotificationService {
  // Email notifications using Supabase Edge Functions
  static async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ahrxwjpfxbmnkaevbwsr.supabase.co'
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocnh3anBmeGJtbmthZXZid3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzI3NjUsImV4cCI6MjA2Njk0ODc2NX0.j3be54uL1cugIlbIcmi7eeS1ixrSUMBbnlxmpA-mXpA'
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, content }),
      })

      return response.ok
    } catch (error) {
      console.error("Email notification failed:", error)
      return false
    }
  }

  // SMS notifications using Supabase Edge Functions
  static async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ahrxwjpfxbmnkaevbwsr.supabase.co'
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocnh3anBmeGJtbmthZXZid3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzI3NjUsImV4cCI6MjA2Njk0ODc2NX0.j3be54uL1cugIlbIcmi7eeS1ixrSUMBbnlxmpA-mXpA'
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message }),
      })

      return response.ok
    } catch (error) {
      console.error("SMS notification failed:", error)
      return false
    }
  }

  // In-app notifications
  static async createNotification(notification: Partial<Notification>): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Failed to create notification:", error)
      return null
    }
  }

  // Booking notifications
  static async sendBookingConfirmation(booking: any, creative: any, client: any): Promise<void> {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Booking Confirmation - Brand Connect</h2>
        <p>Dear ${client.full_name},</p>
        <p>Your booking with ${creative.name} has been confirmed!</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #047857;">Booking Details</h3>
          <p><strong>Service:</strong> ${booking.service?.name || 'Creative Service'}</p>
          <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${booking.start_time} - ${booking.end_time}</p>
          <p><strong>Amount:</strong> ${formatCurrency(booking.total_amount)}</p>
          <p><strong>Location:</strong> ${creative.location}</p>
        </div>
        
        <p><strong>Creative Contact:</strong></p>
        <p>📧 ${creative.email}</p>
        <p>📱 ${creative.phone}</p>
        
        <p>We'll send you a reminder before your appointment.</p>
        <p>Best regards,<br>The Brand Connect Team</p>
      </div>
    `

    const smsMessage = `Brand Connect: Your booking with ${creative.name} is confirmed for ${new Date(booking.booking_date).toLocaleDateString()} at ${booking.start_time}. Contact: ${creative.phone}. Booking ID: ${booking.id}`

    await Promise.all([
      this.sendEmail(client.email, "Booking Confirmation - Brand Connect", emailContent),
      this.sendSMS(client.phone, smsMessage),
      this.createNotification({
        user_id: client.id,
        type: "booking",
        title: "Booking Confirmed",
        message: `Your booking with ${creative.name} has been confirmed`,
        data: { booking_id: booking.id },
      }),
    ])
  }

  static async sendBookingReminder(booking: any, creative: any, client: any): Promise<void> {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Booking Reminder - Brand Connect</h2>
        <p>Dear ${client.full_name},</p>
        <p>This is a reminder about your upcoming booking:</p>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1d4ed8;">Tomorrow's Appointment</h3>
          <p><strong>Creative:</strong> ${creative.name}</p>
          <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${booking.start_time} - ${booking.end_time}</p>
          <p><strong>Location:</strong> ${creative.location}</p>
        </div>
        
        <p><strong>Contact Information:</strong></p>
        <p>📧 ${creative.email}</p>
        <p>📱 ${creative.phone}</p>
        
        <p>Looking forward to your creative session!</p>
        <p>Best regards,<br>The Brand Connect Team</p>
      </div>
    `

    const smsMessage = `Reminder: You have a booking with ${creative.name} tomorrow at ${booking.start_time}. Location: ${creative.location}. Contact: ${creative.phone}`

    await Promise.all([
      this.sendEmail(client.email, "Booking Reminder - Brand Connect", emailContent),
      this.sendSMS(client.phone, smsMessage),
    ])
  }

  static async sendStatusUpdateNotification(booking: any, newStatus: string, user: any): Promise<void> {
    const statusMessages = {
      confirmed: "Your booking has been confirmed",
      in_progress: "Your booking is now in progress", 
      completed: "Your booking has been completed",
      cancelled: "Your booking has been cancelled"
    }

    const message = statusMessages[newStatus as keyof typeof statusMessages] || `Booking status updated to ${newStatus}`
    const smsMessage = `Brand Connect: ${message}. Booking ID: ${booking.id}`

    await Promise.all([
      this.sendSMS(user.phone, smsMessage),
      this.createNotification({
        user_id: user.id,
        type: "booking",
        title: "Booking Status Update",
        message,
        data: { booking_id: booking.id, status: newStatus },
      }),
    ])
  }

  static async sendNewMessageNotification(message: any, recipient: any, sender: any): Promise<void> {
    const smsMessage = `New message from ${sender.full_name}: ${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}`

    await Promise.all([
      this.sendSMS(recipient.phone, smsMessage),
      this.createNotification({
        user_id: recipient.id,
        type: "message",
        title: `New message from ${sender.full_name}`,
        message: message.content,
        data: { 
          conversation_id: message.conversation_id,
          sender_id: sender.id 
        },
      }),
    ])
  }

  static async sendApprovalNotification(profileId: string, status: 'approved' | 'rejected'): Promise<void> {
    try {
      // Get creative profile and user data
      const { data: profile } = await supabase
        .from('creative_profiles')
        .select('*, user:auth.users(*)')
        .eq('id', profileId)
        .single()

      if (!profile) return

      const userEmail = profile.email
      const userName = profile.title
      const userPhone = profile.phone

      if (status === 'approved') {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Profile Approved - Welcome to Brand Connect! 🎉</h2>
            <p>Dear ${userName},</p>
            <p>Congratulations! Your creative professional profile has been approved and is now live on Brand Connect.</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #047857;">What's next?</h3>
              <ul style="color: #065f46;">
                <li>Complete your portfolio with your best work samples</li>
                <li>Set up your services and pricing</li>
                <li>Configure your availability schedule</li>
                <li>Start receiving booking requests from clients</li>
              </ul>
            </div>
            
            <p>Your profile is now visible to potential clients across Tanzania. Start building your creative business today!</p>
            <p>Best regards,<br>The Brand Connect Team</p>
          </div>
        `

        const smsMessage = `Brand Connect: Congratulations! Your creative profile has been approved. You can now receive bookings from clients. Login to complete your portfolio.`

        await Promise.all([
          userEmail && this.sendEmail(userEmail, "Profile Approved - Brand Connect", emailContent),
          userPhone && this.sendSMS(userPhone, smsMessage),
          this.createNotification({
            user_id: profile.user_id,
            type: "approval",
            title: "Profile Approved!",
            message: "Your creative professional profile has been approved and is now live.",
            data: { profile_id: profileId, status: 'approved' },
          }),
        ])
      } else {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Profile Review Update - Brand Connect</h2>
            <p>Dear ${userName},</p>
            <p>Thank you for your interest in joining Brand Connect as a creative professional.</p>
            <p>After reviewing your profile, we need additional information or improvements before we can approve your account.</p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #92400e;">Common reasons for profile review:</h3>
              <ul style="color: #78350f;">
                <li>Portfolio samples need to be more comprehensive</li>
                <li>Professional information requires clarification</li>
                <li>Additional verification documents needed</li>
              </ul>
            </div>
            
            <p>Please contact our support team at support@brandconnect.co.tz for specific feedback and guidance on improving your profile.</p>
            <p>We're here to help you succeed!</p>
            <p>Best regards,<br>The Brand Connect Team</p>
          </div>
        `

        const smsMessage = `Brand Connect: Your profile needs additional review. Please contact support@brandconnect.co.tz for guidance on completing your application.`

        await Promise.all([
          userEmail && this.sendEmail(userEmail, "Profile Review Update - Brand Connect", emailContent),
          userPhone && this.sendSMS(userPhone, smsMessage),
          this.createNotification({
            user_id: profile.user_id,
            type: "approval",
            title: "Profile Needs Review",
            message: "Your profile requires additional information. Please contact support for guidance.",
            data: { profile_id: profileId, status: 'rejected' },
          }),
        ])
      }
    } catch (error) {
      console.error('Failed to send approval notification:', error)
    }
  }

  static async sendPaymentReceipt(payment: any, booking: any): Promise<void> {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Payment Receipt - Brand Connect</h2>
        <p>Thank you for your payment!</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #047857;">Payment Details</h3>
          <p><strong>Amount:</strong> ${formatCurrency(payment.amount)}</p>
          <p><strong>Transaction ID:</strong> ${payment.transaction_id}</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Status:</strong> Completed</p>
        </div>
        
        <p>Your payment has been processed successfully.</p>
        <p>Best regards,<br>The Brand Connect Team</p>
      </div>
    `

    await this.sendEmail(booking.client?.email, "Payment Receipt - Brand Connect", emailContent)
  }
}