-- 1. Create the base EXPO tables that were missing from the previous migration

CREATE TABLE IF NOT EXISTS public.sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    color_theme TEXT DEFAULT '#3b82f6',
    map_position JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    location TEXT,
    tier TEXT DEFAULT 'basic',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.booths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    video_url TEXT,
    model_url TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    services JSONB DEFAULT '[]'::jsonb,
    products JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS so the API can read them (Public Read)
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sectors" ON public.sectors FOR SELECT USING (true);
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Anyone can view booths" ON public.booths FOR SELECT USING (true);

-- 2. Insert the SEED DATA (The 2 scripts you wanted to run)

-- Insert Sectors and return their generated UUIDs
WITH new_sectors AS (
  INSERT INTO public.sectors (name, color_theme, map_position)
  VALUES 
    ('Construction', '#3b82f6', '{"x": 0, "y": 0, "z": -100}'::jsonb),
    ('Technology', '#10b981', '{"x": 0, "y": 0, "z": -300}'::jsonb)
  RETURNING id, name
)
-- Use the new UUIDs to insert Companies
INSERT INTO public.companies (sector_id, name, is_active)
SELECT 
  (SELECT id FROM new_sectors WHERE name = 'Construction'),
  'Demo Company 1', 
  true
UNION ALL
SELECT 
  (SELECT id FROM new_sectors WHERE name = 'Technology'),
  'Demo Company 2', 
  true;
