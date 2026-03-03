import { createClient } from '@supabase/supabase-js';

// Drošības pārbaude. Ja atslēgas nav, izmantojam fiktīvu URL, lai nenobrūk visa React lietotne.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase atslēgas nav atrastas! Pārliecinieties, ka Vercel iestatījumos ir pievienoti VITE_SUPABASE_URL un VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co', 
  supabaseAnonKey || 'dummy_key'
);