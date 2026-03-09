import { createClient } from '@supabase/supabase-js';

// Drošības pārbaude. Ja atslēgas nav, izmantojam fiktīvu URL, lai nenobrūk visa React lietotne.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Supabase atslēgas nav atrastas! Pārliecinieties, ka Vercel iestatījumos ir pievienoti VITE_SUPABASE_URL un VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
