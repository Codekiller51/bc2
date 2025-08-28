import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export class EmailVerificationService {
  static async checkVerificationStatus(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user?.email_confirmed_at !== null
    } catch (error) {
      console.error('Error checking email verification status:', error)
      return false
    }
  }

  static async resendVerificationEmail(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        throw new Error('No user email found')
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      })

      if (error) throw error

      toast.success('Verification email sent! Please check your inbox.')
      return true
    } catch (error: any) {
      console.error('Error resending verification email:', error)
      toast.error(error.message || 'Failed to resend verification email')
      return false
    }
  }

  static async verifyEmailWithToken(token: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      })

      if (error) throw error

      toast.success('Email verified successfully!')
      return true
    } catch (error: any) {
      console.error('Error verifying email:', error)
      toast.error(error.message || 'Failed to verify email')
      return false
    }
  }

  static async sendCustomVerificationEmail(email: string, name: string): Promise<boolean> {
    try {
      // Use Supabase Edge Function for custom email
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Welcome to Brand Connect - Verify Your Email',
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #059669;">Welcome to Brand Connect! 🎉</h2>
              <p>Dear ${name},</p>
              <p>Thank you for joining Brand Connect, Tanzania's premier creative marketplace!</p>
              
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #047857;">What's Next?</h3>
                <ul style="color: #065f46;">
                  <li>Complete your profile setup</li>
                  <li>Start connecting with creative professionals</li>
                  <li>Explore amazing talent across Tanzania</li>
                </ul>
              </div>
              
              <p>If you have any questions, our support team is here to help at support@brandconnect.co.tz</p>
              <p>Welcome to the community!</p>
              <p>Best regards,<br>The Brand Connect Team</p>
            </div>
          `
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Error sending custom verification email:', error)
      return false
    }
  }
}

export default EmailVerificationService