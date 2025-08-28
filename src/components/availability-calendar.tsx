"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Save, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TimePicker } from "@/components/ui/time-picker"
import { Input } from "@/components/ui/input"
import { UnifiedDatabaseService } from "@/lib/services/unified-database-service"
import { toast } from "sonner"

interface AvailabilityCalendarProps {
  creativeId: string
}

const dayNames = [
  { key: "0", name: "Sunday", short: "Sun" },
  { key: "1", name: "Monday", short: "Mon" },
  { key: "2", name: "Tuesday", short: "Tue" },
  { key: "3", name: "Wednesday", short: "Wed" },
  { key: "4", name: "Thursday", short: "Thu" },
  { key: "5", name: "Friday", short: "Fri" },
  { key: "6", name: "Saturday", short: "Sat" }
]

export function AvailabilityCalendar({ creativeId }: AvailabilityCalendarProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bufferTime, setBufferTime] = useState(30)
  const [availability, setAvailability] = useState<Record<string, {
    start: string
    end: string
    isAvailable: boolean
  }>>({})

  useEffect(() => {
    loadAvailability()
  }, [creativeId])

  const loadAvailability = async () => {
    try {
      setLoading(true)
      const data = await UnifiedDatabaseService.getCreativeAvailability(creativeId)
      
      if (data) {
        setAvailability(data.recurring_availability || {})
        setBufferTime(data.buffer_time || 30)
      } else {
        // Set default availability (Monday to Friday, 9 AM to 5 PM)
        const defaultAvailability = {
          '0': { start: '09:00', end: '17:00', isAvailable: false },
          '1': { start: '09:00', end: '17:00', isAvailable: true },
          '2': { start: '09:00', end: '17:00', isAvailable: true },
          '3': { start: '09:00', end: '17:00', isAvailable: true },
          '4': { start: '09:00', end: '17:00', isAvailable: true },
          '5': { start: '09:00', end: '17:00', isAvailable: true },
          '6': { start: '09:00', end: '17:00', isAvailable: false }
        }
        setAvailability(defaultAvailability)
      }
    } catch (error) {
      console.error('Failed to load availability:', error)
      toast.error('Failed to load availability settings')
    } finally {
      setLoading(false)
    }
  }

  const updateDayAvailability = (dayKey: string, field: string, value: any) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await UnifiedDatabaseService.updateCreativeAvailability(creativeId, {
        recurring_availability: availability,
        buffer_time: bufferTime
      })
      toast.success('Availability settings saved successfully!')
    } catch (error) {
      console.error('Failed to save availability:', error)
      toast.error('Failed to save availability settings')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefaults = () => {
    const defaultAvailability = {
      '0': { start: '09:00', end: '17:00', isAvailable: false },
      '1': { start: '09:00', end: '17:00', isAvailable: true },
      '2': { start: '09:00', end: '17:00', isAvailable: true },
      '3': { start: '09:00', end: '17:00', isAvailable: true },
      '4': { start: '09:00', end: '17:00', isAvailable: true },
      '5': { start: '09:00', end: '17:00', isAvailable: true },
      '6': { start: '09:00', end: '17:00', isAvailable: false }
    }
    setAvailability(defaultAvailability)
    setBufferTime(30)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buffer Time Setting */}
          <div className="space-y-2">
            <Label htmlFor="buffer-time">Buffer Time Between Bookings (minutes)</Label>
            <Input
              id="buffer-time"
              type="number"
              min={0}
              max={120}
              step={15}
              value={bufferTime}
              onChange={(e) => setBufferTime(Number(e.target.value))}
              className="max-w-[200px]"
            />
            <p className="text-sm text-gray-500">
              Time between bookings to prepare and travel
            </p>
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Weekly Schedule</h3>
              <Button
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
            
            <div className="space-y-4">
              {dayNames.map((day, index) => {
                const dayAvailability = availability[day.key] || {
                  start: "09:00",
                  end: "17:00",
                  isAvailable: false
                }

                return (
                  <motion.div
                    key={day.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20 border"
                  >
                    <div className="w-24">
                      <Label className="font-medium">{day.name}</Label>
                    </div>
                    
                    <Switch
                      checked={dayAvailability.isAvailable}
                      onCheckedChange={(checked) => 
                        updateDayAvailability(day.key, 'isAvailable', checked)
                      }
                    />
                    
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Start Time</Label>
                        <TimePicker
                          value={dayAvailability.start}
                          onChange={(time) => updateDayAvailability(day.key, 'start', time)}
                          disabled={!dayAvailability.isAvailable}
                          placeholder="Start time"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">End Time</Label>
                        <TimePicker
                          value={dayAvailability.end}
                          onChange={(time) => updateDayAvailability(day.key, 'end', time)}
                          disabled={!dayAvailability.isAvailable}
                          placeholder="End time"
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
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
                  Save Availability
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}