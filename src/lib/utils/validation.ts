export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateTanzanianPhone(phone: string): boolean {
  // Tanzanian phone number formats:
  // +255XXXXXXXXX (international)
  // 0XXXXXXXXX (national)
  // 255XXXXXXXXX (without +)
  const phoneRegex = /^(\+255|0255|255|0)[67]\d{8}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateFileUpload(file: File, options: {
  maxSize?: number
  allowedTypes?: string[]
  maxDimensions?: { width: number; height: number }
}): {
  isValid: boolean
  error?: string
} {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options
  
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    }
  }
  
  return { isValid: true }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export function validateBusinessHours(start: string, end: string): boolean {
  const startTime = new Date(`2000-01-01T${start}:00`)
  const endTime = new Date(`2000-01-01T${end}:00`)
  
  return startTime < endTime
}

export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return start <= end
}

export function validateTanzanianCurrency(amount: number): boolean {
  // Validate Tanzanian Shilling amounts (reasonable range)
  return amount >= 1000 && amount <= 10000000 // 1,000 TZS to 10M TZS
}

export function validateSkills(skills: string[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (skills.length === 0) {
    errors.push('At least one skill is required')
  }
  
  if (skills.length > 20) {
    errors.push('Maximum 20 skills allowed')
  }
  
  const invalidSkills = skills.filter(skill => 
    skill.length < 2 || skill.length > 50 || !/^[a-zA-Z0-9\s\-\/\+\&]+$/.test(skill)
  )
  
  if (invalidSkills.length > 0) {
    errors.push('Skills must be 2-50 characters and contain only letters, numbers, spaces, and common symbols')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}