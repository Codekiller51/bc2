import { motion } from 'framer-motion'
import { Shield, FileText, Users, Gavel, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Brand Connect terms and conditions
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
                  <FileText className="h-5 w-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Welcome to Brand Connect, Tanzania's premier creative marketplace. These Terms of Service ("Terms") 
                  govern your use of our platform and services. By accessing or using Brand Connect, you agree to be 
                  bound by these Terms.
                </p>
                <p>
                  Brand Connect connects clients with verified creative professionals across Tanzania, including 
                  graphic designers, photographers, videographers, and digital marketers.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>Account Registration</h3>
                <ul>
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account credentials</li>
                  <li>You must be at least 18 years old to use our services</li>
                  <li>One person may not maintain more than one account</li>
                </ul>

                <h3>Creative Professional Accounts</h3>
                <ul>
                  <li>Creative professionals must undergo verification and approval process</li>
                  <li>You must provide accurate portfolio samples and professional credentials</li>
                  <li>Misrepresentation of skills or experience may result in account suspension</li>
                  <li>You are responsible for maintaining professional standards in all interactions</li>
                </ul>

                <h3>Client Accounts</h3>
                <ul>
                  <li>Clients must provide accurate project requirements and expectations</li>
                  <li>Payment information must be valid and up-to-date</li>
                  <li>Respectful communication with creative professionals is required</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Platform Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>Acceptable Use</h3>
                <p>You agree to use Brand Connect only for lawful purposes and in accordance with these Terms. You may not:</p>
                <ul>
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit any harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Post false, misleading, or defamatory content</li>
                </ul>

                <h3>Content Guidelines</h3>
                <ul>
                  <li>All content must be original or properly licensed</li>
                  <li>Portfolio items must accurately represent your work</li>
                  <li>No adult, violent, or offensive content is permitted</li>
                  <li>Respect intellectual property rights of others</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking and Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Booking and Services
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>Booking Process</h3>
                <ul>
                  <li>All bookings are subject to creative professional approval</li>
                  <li>Booking confirmations are binding agreements</li>
                  <li>Cancellation policies vary by creative professional</li>
                  <li>Brand Connect facilitates connections but is not party to service agreements</li>
                </ul>

                <h3>Service Delivery</h3>
                <ul>
                  <li>Creative professionals are responsible for delivering agreed-upon services</li>
                  <li>Clients must provide necessary materials and information for project completion</li>
                  <li>Disputes should be resolved directly between parties when possible</li>
                  <li>Brand Connect may mediate disputes at its discretion</li>
                </ul>

                <h3>Platform Commission</h3>
                <ul>
                  <li>Brand Connect charges a service fee on completed transactions</li>
                  <li>Commission rates are clearly displayed during booking process</li>
                  <li>Fees are automatically deducted from payments to creative professionals</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Liability and Disclaimers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Liability and Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3>Platform Disclaimer</h3>
                <p>
                  Brand Connect provides a platform for connecting clients with creative professionals. 
                  We do not guarantee the quality, safety, or legality of services provided by creative professionals.
                </p>

                <h3>Limitation of Liability</h3>
                <ul>
                  <li>Brand Connect is not liable for disputes between users</li>
                  <li>We are not responsible for the quality of services delivered</li>
                  <li>Our liability is limited to the platform commission fees collected</li>
                  <li>Users engage with each other at their own risk</li>
                </ul>

                <h3>Indemnification</h3>
                <p>
                  You agree to indemnify and hold Brand Connect harmless from any claims, damages, 
                  or expenses arising from your use of the platform or violation of these Terms.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Questions about these Terms?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> legal@brandconnect.co.tz</p>
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