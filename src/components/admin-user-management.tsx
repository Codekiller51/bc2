"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Crown, 
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"
import { UnifiedDatabaseService } from "@/lib/services/unified-database-service"
import { EnhancedNotificationService } from "@/lib/services/enhanced-notification-service"
import { useAuth } from "@/components/enhanced-auth-provider"
import { toast } from "sonner"

export function AdminUserManagement() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') {
      loadUsers()
    }
  }, [user])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const userData = await UnifiedDatabaseService.getUsers({
        role: filter !== 'all' ? filter : undefined,
        search: searchTerm || undefined
      })
      setUsers(userData)
    } catch (error) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveCreative = async (userId: string) => {
    try {
      const creative = users.find(u => u.id === userId && u.role === 'creative')
      if (!creative) return

      const creativeProfile = await UnifiedDatabaseService.getCreativeProfileByUserId(userId)
      if (!creativeProfile) return

      await UnifiedDatabaseService.approveCreativeProfile(creativeProfile.id, user?.id!)
      
      // Send approval notification
      await EnhancedNotificationService.sendApprovalNotification(creativeProfile.id, 'approved')
      
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

      await UnifiedDatabaseService.rejectCreativeProfile(creativeProfile.id, user?.id!)
      
      // Send rejection notification
      await EnhancedNotificationService.sendApprovalNotification(creativeProfile.id, 'rejected')
      
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

  const getStatusBadge = (userData: any) => {
    if (userData.role === 'creative') {
      if (userData.approved) {
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      } else {
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      }
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>
  }

  const filteredUsers = users.filter(userData => {
    const matchesFilter = filter === 'all' || userData.role === filter
    const matchesSearch = !searchTerm || 
      userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage platform users and creative approvals
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
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
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
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
                        src={userData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}&backgroundColor=059669&textColor=ffffff`} 
                        alt={userData.name} 
                      />
                      <AvatarFallback>
                        {userData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {userData.name}
                        </h3>
                        {getRoleBadge(userData.role)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {userData.email}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {userData.location || 'Not specified'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(userData.created_at).toLocaleDateString()}
                        </span>
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
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(userData)
                        setShowUserModal(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {selectedUser.email}
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {selectedUser.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {selectedUser.location || 'Not specified'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(selectedUser.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedUser.role === 'client' && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedUser.company_name && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company</Label>
                      <p className="text-gray-900 dark:text-white">{selectedUser.company_name}</p>
                    </div>
                  )}
                  {selectedUser.industry && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Industry</Label>
                      <p className="text-gray-900 dark:text-white">{selectedUser.industry}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowUserModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
                
                {selectedUser.role === 'creative' && !selectedUser.approved && (
                  <>
                    <Button
                      onClick={() => {
                        handleApproveCreative(selectedUser.id)
                        setShowUserModal(false)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        handleRejectCreative(selectedUser.id)
                        setShowUserModal(false)
                      }}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}