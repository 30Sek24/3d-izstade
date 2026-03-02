import { createClient } from '@supabase/supabase-js';

// Drošības pārbaude. Ja atslēgas nav, izmantojam fiktīvu URL, lai nenobrūk visa React lietotne.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);