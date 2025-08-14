import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  // Handle both ISO format and YYYY-MM-DD format
  const date = new Date(dateString)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  
  // Format in European style (DD/MM/YYYY)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatDateHeader(dateString: string): string {
  // Handle both ISO format and YYYY-MM-DD format
  const date = new Date(dateString)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  
  // Format in header style (Month Day, Year)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateFromISO(isoString: string): string {
  // Handle ISO timestamp format (e.g., "2024-01-15T10:30:00.000Z")
  const date = new Date(isoString)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  
  // Format in European style (DD/MM/YYYY)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
} 