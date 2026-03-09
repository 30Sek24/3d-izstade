import { createClient } from '@supabase/supabase-js';

// Environment variable extraction with type safety and fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a safe, reusable client instance
const createSafeClient = () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ SUPABASE CLIENT WARNING: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
      console.warn('⚠️ Supabase client initialized in dummy mode. Backend queries will fail safely.');
      // Fallback for development/UI work without throwing fatal application errors
      return createClient('https://dummy-fallback.supabase.co', 'dummy-key');
    }
    
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } catch (error) {
    console.error('❌ FATAL: Failed to initialize Supabase client:', error);
    // Return dummy client to prevent complete React tree crashing
    return createClient('https://dummy-fallback.supabase.co', 'dummy-key');
  }
};

export const supabaseClient = createSafeClient();

// Utility for safe queries in backend services
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`[Supabase Error - ${context}]:`, error?.message || error);
  return { data: null, error: error?.message || 'Unknown database error' };
};
