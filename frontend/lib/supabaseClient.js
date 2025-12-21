
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tmviltegjyyafvogczui.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtdmlsdGVnanl5YWZ2b2djenVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjExNjMsImV4cCI6MjA4MTczNzE2M30.4WiBjySjHGDoH0HXIns-LMZ9qsMTmF-wA7z0Z6WVqA0'

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
