import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme-provider'
import { RouteGuard } from '@/components/route-guard'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AIChatBot } from '@/components/ai-chat-bot'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { EnhancedAuthProvider } from '@/components/enhanced-auth-provider'
import { LoadingProvider } from '@/components/loading-provider'
import { SessionStatusIndicator } from '@/components/session-status-indicator'

// Import pages
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import SearchPage from '@/pages/SearchPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import HelpPage from '@/pages/HelpPage'
import TestimonialsPage from '@/pages/TestimonialsPage'
import BookingPage from '@/pages/BookingPage'
import BookingDetailsPage from '@/pages/BookingDetailsPage'
import PaymentPage from '@/pages/PaymentPage'
import ChatPage from '@/pages/ChatPage'
import ProfilePage from '@/pages/ProfilePage'
import ProfileEditPage from '@/pages/ProfileEditPage'
import ProfileCompletePage from '@/pages/ProfileCompletePage'
import ProfileViewPage from '@/pages/ProfileViewPage'
import DashboardPage from '@/pages/DashboardPage'
import DashboardOverviewPage from '@/pages/DashboardOverviewPage'
import DashboardCreativePage from '@/pages/DashboardCreativePage'
import DashboardBookingsPage from '@/pages/DashboardBookingsPage'
import DashboardMessagesPage from '@/pages/DashboardMessagesPage'
import DashboardPortfolioPage from '@/pages/DashboardPortfolioPage'
import DashboardAvailabilityPage from '@/pages/DashboardAvailabilityPage'
import DashboardSettingsPage from '@/pages/DashboardSettingsPage'
import AdminPage from '@/pages/AdminPage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import AdminUsersPage from '@/pages/AdminUsersPage'
import AdminBookingsPage from '@/pages/AdminBookingsPage'
import AdminMessagesPage from '@/pages/AdminMessagesPage'
import AdminAnalyticsPage from '@/pages/AdminAnalyticsPage'
import AdminReportsPage from '@/pages/AdminReportsPage'
import AdminSettingsPage from '@/pages/AdminSettingsPage'
import AdminCreateUserPage from '@/pages/AdminCreateUserPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import VerifyEmail from '@/pages/auth/verify'
import TermsPage from '@/pages/TermsPage'
import PrivacyPage from '@/pages/PrivacyPage'
import NotFoundPage from '@/pages/NotFoundPage'

function AppContent() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          {/* Booking routes */}
          <Route path="/booking" element={
            <RouteGuard requireProfileComplete>
              <BookingPage />
            </RouteGuard>
          } />
          <Route path="/booking/:id" element={
            <RouteGuard requireProfileComplete>
              <BookingDetailsPage />
            </RouteGuard>
          } />
          <Route path="/booking/:id/payment" element={
            <RouteGuard requireProfileComplete>
              <PaymentPage />
            </RouteGuard>
          } />
          
          {/* Profile routes */}
          <Route path="/profile" element={
            <RouteGuard>
              <ProfilePage />
            </RouteGuard>
          } />
          <Route path="/profile/edit" element={
            <RouteGuard>
              <ProfileEditPage />
            </RouteGuard>
          } />
          <Route path="/profile/complete" element={<ProfileCompletePage />} />
          <Route path="/profile/:slug" element={<ProfileViewPage />} />
          
          {/* Chat */}
          <Route path="/chat" element={
            <RouteGuard requireProfileComplete>
              <ChatPage />
            </RouteGuard>
          } />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={
            <RouteGuard requireProfileComplete>
              <DashboardPage />
            </RouteGuard>
          } />
          <Route path="/dashboard/overview" element={
            <RouteGuard requiredRole="client" requireProfileComplete>
              <DashboardOverviewPage />
            </RouteGuard>
          } />
          <Route path="/dashboard/creative" element={
            <RouteGuard requiredRole="creative" requireProfileComplete>
              <DashboardCreativePage />
            </RouteGuard>
          } />
          <Route path="/dashboard/bookings" element={
            <RouteGuard requiredRole="creative" requireProfileComplete>
              <DashboardBookingsPage />
            </RouteGuard>
          } />
          <Route path="/dashboard/messages" element={
            <RouteGuard requireProfileComplete>
              <DashboardMessagesPage />
            </RouteGuard>
          } />
          <Route path="/dashboard/portfolio" element={
            <RouteGuard requiredRole="creative" requireProfileComplete>
              <DashboardPortfolioPage />
            </RouteGuard>
          } />
          <Route path="/dashboard/availability" element={
            <RouteGuard requiredRole="creative" requireProfileComplete>
              <DashboardAvailabilityPage />
            </RouteGuard>
          } />
          <Route path="/dashboard/settings" element={
            <RouteGuard requireProfileComplete>
              <DashboardSettingsPage />
            </RouteGuard>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <RouteGuard requiredRole="admin">
              <AdminPage />
            </RouteGuard>
          } />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/users" element={
            <RouteGuard requiredRole="admin">
              <AdminUsersPage />
            </RouteGuard>
          } />
          <Route path="/admin/bookings" element={
            <RouteGuard requiredRole="admin">
              <AdminBookingsPage />
            </RouteGuard>
          } />
          <Route path="/admin/messages" element={
            <RouteGuard requiredRole="admin">
              <AdminMessagesPage />
            </RouteGuard>
          } />
          <Route path="/admin/analytics" element={
            <RouteGuard requiredRole="admin">
              <AdminAnalyticsPage />
            </RouteGuard>
          } />
          <Route path="/admin/reports" element={
            <RouteGuard requiredRole="admin">
              <AdminReportsPage />
            </RouteGuard>
          } />
          <Route path="/admin/settings" element={
            <RouteGuard requiredRole="admin">
              <AdminSettingsPage />
            </RouteGuard>
          } />
          <Route path="/admin/create-user" element={
            <RouteGuard requiredRole="admin">
              <AdminCreateUserPage />
            </RouteGuard>
          } />
          
          {/* Auth routes */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth/verify" element={<VerifyEmail />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LoadingProvider>
          <EnhancedAuthProvider>
            <AppContent />
            <AIChatBot />
            <SessionStatusIndicator />
            <Toaster />
          </EnhancedAuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App