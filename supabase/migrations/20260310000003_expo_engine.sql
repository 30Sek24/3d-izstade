-- Phase 10: Expo City Engine

-- Add specific fields requested for expo_booths if they don't exist
ALTER TABLE public.expo_booths 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS booth_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS "3d_model_url" TEXT,
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS district TEXT;

-- Analytics table for booths
CREATE TABLE IF NOT EXISTS public.booth_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booth_id UUID REFERENCES public.expo_booths(id) ON DELETE CASCADE,
    visits INTEGER DEFAULT 0,
    interactions INTEGER DEFAULT 0,
    leads_generated INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
