import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY



// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is available
export function isSupabaseAvailable(): boolean {
  return supabase !== null
}

// Helper function to log Supabase errors
export function logSupabaseError(operation: string, error: any): void {
  console.error(`Supabase ${operation} error:`, error)
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Falling back to local data for ${operation}`)
  }
} 