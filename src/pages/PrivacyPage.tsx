import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            How we protect and handle your data
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: January 2024
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Our Commitment to Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  At Brand Connect, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our platform and services.
                </p>
                <p>
                  We are committed to protecting your personal information and being transparent about our 
                  data practices in accordance with Tanzanian data protection laws and international best practices.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>Personal Information</h3>
                <ul>
                  <li><strong>Account Information:</strong> Name, email address, phone number, location</li>
                  <li><strong>Profile Information:</strong> Professional title, bio, skills, portfolio items</li>
                  <li><strong>Business Information:</strong> Company name, industry (for clients)</li>
                  <li><strong>Financial Information:</strong> Payment methods, transaction history</li>
                </ul>

                <h3>Usage Information</h3>
                <ul>
                  <li><strong>Platform Activity:</strong> Bookings, messages, reviews, search queries</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                  <li><strong>Analytics Data:</strong> Page views, feature usage, performance metrics</li>
                </ul>

                <h3>Communications</h3>
                <ul>
                  <li>Messages between clients and creative professionals</li>
                  <li>Customer support communications</li>
                  <li>Marketing communications (with your consent)</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* How We Use Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>Platform Operations</h3>
                <ul>
                  <li>Facilitate connections between clients and creative professionals</li>
                  <li>Process bookings and manage transactions</li>
                  <li>Verify creative professional credentials</li>
                  <li>Provide customer support and resolve disputes</li>
                </ul>

                <h3>Communication</h3>
                <ul>
                  <li>Send booking confirmations and reminders</li>
                  <li>Notify you of platform updates and new features</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>

                <h3>Platform Improvement</h3>
                <ul>
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Develop new features and functionality</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>With Other Users</h3>
                <ul>
                  <li>Profile information is visible to other platform users</li>
                  <li>Contact information is shared when bookings are confirmed</li>
                  <li>Reviews and ratings are publicly visible</li>
                </ul>

                <h3>With Service Providers</h3>
                <ul>
                  <li>Payment processors for transaction handling</li>
                  <li>Email and SMS service providers for communications</li>
                  <li>Analytics providers for platform improvement</li>
                  <li>Cloud hosting providers for data storage</li>
                </ul>

                <h3>Legal Requirements</h3>
                <ul>
                  <li>We may disclose information to comply with legal obligations</li>
                  <li>Law enforcement requests will be handled according to applicable laws</li>
                  <li>We may share information to protect our rights and safety</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>Security Measures</h3>
                <ul>
                  <li>Industry-standard encryption for data transmission and storage</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure cloud infrastructure with backup systems</li>
                </ul>

                <h3>Your Responsibilities</h3>
                <ul>
                  <li>Keep your account credentials secure and confidential</li>
                  <li>Report any suspected security breaches immediately</li>
                  <li>Use strong passwords and enable two-factor authentication when available</li>
                  <li>Log out of your account when using shared devices</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>Access and Control</h3>
                <ul>
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                </ul>

                <h3>Communication Preferences</h3>
                <ul>
                  <li>Opt out of marketing communications at any time</li>
                  <li>Manage notification preferences in your account settings</li>
                  <li>Essential service communications cannot be disabled</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Privacy Questions?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Privacy Officer:</strong> privacy@brandconnect.co.tz</p>
                  <p><strong>General Support:</strong> support@brandconnect.co.tz</p>
                  <p><strong>Phone:</strong> +255 123 456 789</p>
                  <p><strong>Address:</strong> Dar es Salaam, Tanzania</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}