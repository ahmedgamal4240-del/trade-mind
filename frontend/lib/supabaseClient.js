
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables! Check your .env.local file.')
    console.log('Current NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
    // Don't log the key for security, just presence
    console.log('Current NEXT_PUBLIC_SUPABASE_ANON_KEY present:', !!supabaseAnonKey)
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
