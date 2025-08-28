"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
  disabled
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hours, setHours] = React.useState(value ? value.split(':')[0] : '09')
  const [minutes, setMinutes] = React.useState(value ? value.split(':')[1] : '00')

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const time = `${newHours.padStart(2, '0')}:${newMinutes.padStart(2, '0')}`
    onChange?.(time)
    setOpen(false)
  }

  const generateTimeOptions = () => {
    const times = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0')
        const minute = m.toString().padStart(2, '0')
        times.push(`${hour}:${minute}`)
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                step="15"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto">
            {timeOptions.map((time) => (
              <Button
                key={time}
                variant="ghost"
                size="sm"
                onClick={() => {
                  const [h, m] = time.split(':')
                  setHours(h)
                  setMinutes(m)
                  handleTimeChange(h, m)
                }}
                className="text-xs"
              >
                {time}
              </Button>
            ))}
          </div>
          
          <Button
            onClick={() => handleTimeChange(hours, minutes)}
            className="w-full"
          >
            Set Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}