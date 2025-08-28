import { useAuth } from '@/components/enhanced-auth-provider'
import { useNavigate } from 'react-router-dom'
import { EnhancedOnboardingFlow } from '@/components/enhanced-onboarding-flow'

export default function ProfileCompletePage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const handleComplete = () => {
    if (user?.role === 'creative') {
      navigate('/dashboard/creative')
    } else {
      navigate('/dashboard/overview')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <EnhancedOnboardingFlow 
      onComplete={handleComplete}
      userType={user.role as 'client' | 'creative'}
    />
  )
}