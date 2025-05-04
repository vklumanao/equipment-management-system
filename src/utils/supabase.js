import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

// Form Action Utils
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}

// Check if the session exists and is valid; Return false if there's an error
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error.message)
    return false
  }
  return !!data.session
}

// Get Current User Information
export const getUserInformation = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    console.error('User not found or error fetching user:', error?.message)
    return null
  }

  return data.user.user_metadata
}
