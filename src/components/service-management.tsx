"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, DollarSign, Clock, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { UnifiedDatabaseService } from "@/lib/services/unified-database-service"
import { useAuth } from "@/components/enhanced-auth-provider"
import { formatCurrency, formatDuration } from "@/lib/utils/format"
import { toast } from "sonner"

interface Service {
  id: string
  creative_id: string
  name: string
  description?: string
  price: number
  duration: number
  category?: string
  active: boolean
  created_at: string
}

export function ServiceManagement() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 60,
    category: "",
    active: true
  })

  useEffect(() => {
    loadServices()
  }, [user])

  const loadServices = async () => {
    if (!user) return

    try {
      setLoading(true)
      const profile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
      if (profile?.services) {
        setServices(profile.services)
      }
    } catch (error) {
      console.error('Failed to load services:', error)
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration: 60,
      category: "",
      active: true
    })
    setEditingService(null)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price,
      duration: service.duration,
      category: service.category || "",
      active: service.active
    })
    setShowAddDialog(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim() || formData.price <= 0 || formData.duration <= 0) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!user) return

    try {
      setSaving(true)
      const profile = await UnifiedDatabaseService.getCreativeProfileByUserId(user.id)
      if (!profile) return

      const serviceData = {
        creative_id: profile.id,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        category: formData.category,
        active: formData.active
      }

      if (editingService) {
        // Update existing service
        await UnifiedDatabaseService.updateService(editingService.id, serviceData)
        toast.success('Service updated successfully!')
      } else {
        // Create new service
        await UnifiedDatabaseService.createService(serviceData)
        toast.success('Service added successfully!')
      }

      setShowAddDialog(false)
      resetForm()
      loadServices()
    } catch (error) {
      console.error('Failed to save service:', error)
      toast.error('Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      await UnifiedDatabaseService.deleteService(serviceId)
      toast.success('Service deleted successfully!')
      loadServices()
    } catch (error) {
      console.error('Failed to delete service:', error)
      toast.error('Failed to delete service')
    }
  }

  const toggleServiceStatus = async (serviceId: string, active: boolean) => {
    try {
      await UnifiedDatabaseService.updateService(serviceId, { active })
      toast.success(`Service ${active ? 'activated' : 'deactivated'} successfully!`)
      loadServices()
    } catch (error) {
      console.error('Failed to update service status:', error)
      toast.error('Failed to update service status')
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your services and pricing
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm()
                setShowAddDialog(true)
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Logo Design, Portrait Session"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Logo Design">Logo Design</SelectItem>
                      <SelectItem value="Web Design">Web Design</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Branding">Branding</SelectItem>
                      <SelectItem value="Print Design">Print Design</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="Video Production">Video Production</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what's included in this service..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (TZS) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Service is active and bookable</Label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowAddDialog(false)
                    resetForm()
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || !formData.name.trim() || formData.price <= 0}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingService ? 'Update' : 'Add'} Service
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Services Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding your first service to attract clients
            </p>
            <Button
              onClick={() => {
                resetForm()
                setShowAddDialog(true)
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "group hover:shadow-lg transition-shadow",
                  !service.active && "opacity-60"
                )}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{service.name}</CardTitle>
                        {service.category && (
                          <Badge variant="outline" className="mt-2">
                            {service.category}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={service.active}
                          onCheckedChange={(checked) => toggleServiceStatus(service.id, checked)}
                          size="sm"
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {service.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {service.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">{formatCurrency(service.price)}</span>
                      </div>

                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{formatDuration(service.duration)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => handleEdit(service)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        onClick={() => handleDelete(service.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}