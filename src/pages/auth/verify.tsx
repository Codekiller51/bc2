import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from the URL
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'email') {
          throw new Error('Invalid verification link')
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        })

        if (error) throw error

        toast.success('Email verified successfully! You can now sign in.')
        navigate('/login')
      } catch (error: any) {
        console.error('Verification error:', error)
        toast.error(error.message || 'Failed to verify email')
        navigate('/login')
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Verifying your email...</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
            <p className="text-gray-600 dark:text-gray-400">Redirecting you to login...</p>
          </>
        )}
      </div>
    </div>
  )
}