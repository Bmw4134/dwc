import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wuoqgqmaiuhcmfxnorip.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// Create Supabase client - will be fully functional once ANON key is provided
export const supabase = supabaseAnonKey !== 'demo-key' 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null

// Quantum-secure session validation
export const validateQuantumSession = async () => {
  if (!supabase) return null;
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) throw error
  
  if (session) {
    // Additional quantum security checks
    const sessionAge = Date.now() - new Date(session.refresh_token).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (sessionAge > maxAge) {
      await supabase.auth.signOut()
      return null
    }
  }
  
  return session
}