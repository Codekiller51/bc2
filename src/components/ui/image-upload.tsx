"use client"

import * as React from "react"
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value?: string
  onChange?: (url: string) => void
  onFileSelect?: (file: File) => void
  className?: string
  disabled?: boolean
  aspectRatio?: "square" | "video" | "auto"
  maxSize?: number
}

export function ImageUpload({
  value,
  onChange,
  onFileSelect,
  className,
  disabled = false,
  aspectRatio = "auto",
  maxSize = 5 * 1024 * 1024 // 5MB
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string>(value || "")
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setPreview(value || "")
  }, [value])

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [disabled])

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    if (disabled) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      console.error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onChange?.(result)
    }
    reader.readAsDataURL(file)

    // Call file select callback
    onFileSelect?.(file)
  }

  const removeImage = () => {
    setPreview("")
    onChange?.("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "aspect-auto"
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg overflow-hidden transition-colors",
          aspectRatioClasses[aspectRatio],
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer hover:bg-muted/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <AnimatePresence>
          {preview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full min-h-[200px]"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Replace Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Click to replace</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8 min-h-[200px]"
            >
              <ImageIcon className={cn(
                "h-12 w-12 mb-4",
                dragActive ? "text-primary" : "text-muted-foreground"
              )} />
              
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">
                  {dragActive ? "Drop image here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}