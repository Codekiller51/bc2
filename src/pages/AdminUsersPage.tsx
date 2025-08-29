import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, CheckCircle, XCircle, Eye, AlertTriangle, Crown, Award } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTable } from '@/components/ui/data-table'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { toast } from 'sonner'

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user?.role === 'admin') {
      loadUsers()
    }
  }, [user])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await UnifiedDatabaseService.getUsers({
        role: filter !== 'all' ? filter : undefined,
        search: searchTerm || undefined
      })
      setUsers(userData)
    } catch (error) {
      console.error('Failed to load users:', error)
      setError('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveCreative = async (userId: string) => {
    try {
      // Find the creative profile
      const creative = users.find(u => u.id === userId && u.role === 'creative')
      if (!creative) return

      // Get the creative profile ID
      const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(userId)
      if (!creativeProfile) return

      await UnifiedDatabaseService.updateCreativeProfile(creativeProfile.id, {
        approval_status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString()
      })

      toast.success('Creative profile approved successfully!')
      loadUsers()
    } catch (error) {
      console.error('Failed to approve creative:', error)
      toast.error('Failed to approve creative profile')
    }
  }

  const handleRejectCreative = async (userId: string) => {
    try {
      const creative = users.find(u => u.id === userId && u.role === 'creative')
      if (!creative) return

      const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(userId)
      if (!creativeProfile) return

      await UnifiedDatabaseService.updateCreativeProfile(creativeProfile.id, {
        approval_status: 'rejected',
        approved_by: user?.id,
        approved_at: new Date().toISOString()
      })

      toast.success('Creative profile rejected')
      loadUsers()
    } catch (error) {
      console.error('Failed to reject creative:', error)
      toast.error('Failed to reject creative profile')
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case 'creative':
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <Award className="w-3 h-3 mr-1" />
            Creative
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            Client
          </Badge>
        )
    }
  }

  const getStatusBadge = (user: any) => {
    if (user.role === 'creative') {
      if (user.approved) {
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      } else {
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      }
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter
    const matchesSearch = !searchTerm || 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading users..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Users</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadUsers} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage platform users and creative approvals
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="client">Clients</SelectItem>
            <SelectItem value="creative">Creatives</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadUsers} variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="professional-card">
          <CardHeader>
            <CardTitle>Platform Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((userData, index) => (
                  <motion.div
                    key={userData.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={userData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.full_name}&backgroundColor=059669&textColor=ffffff`} 
                          alt={userData.full_name} 
                        />
                        <AvatarFallback>
                          {userData.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {userData.full_name}
                          </h3>
                          {getRoleBadge(userData.role)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userData.email}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>📍 {userData.location || 'Not specified'}</span>
                          <span>📅 Joined {new Date(userData.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(userData)}
                      
                      {userData.role === 'creative' && !userData.approved && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveCreative(userData.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectCreative(userData.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}