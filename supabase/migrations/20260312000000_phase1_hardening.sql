-- PHASE 1: DATA PERSISTENCE & SECURITY HARDENING

-- 1. CITIES TABLE
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    architecture_style TEXT DEFAULT 'Futuristic', -- Futuristic, Industrial, Minimalist, Cyberpunk
    global_location JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LINK SECTORS TO CITIES
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES cities(id) ON DELETE CASCADE;

-- 3. ENHANCE COMPANIES WITH ECONOMIC DATA
ALTER TABLE companies ADD COLUMN IF NOT EXISTS current_revenue NUMERIC DEFAULT 0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS activity_score NUMERIC DEFAULT 0.5; -- 0.0 to 1.0
ALTER TABLE companies ADD COLUMN IF NOT EXISTS employee_count INTEGER DEFAULT 0;

-- 4. BOOTH 3D DATA
ALTER TABLE booths ADD COLUMN IF NOT EXISTS model_url TEXT DEFAULT 'L_Booth_Default';

-- 5. API SECURITY (Simple key table for UE5)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name TEXT NOT NULL,
    secret_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Public cities are viewable by everyone" ON cities FOR SELECT USING (is_active = true);
CREATE POLICY "API keys are service-only" ON api_keys FOR ALL USING (false); -- No public access

-- SEED DATA
INSERT INTO cities (name, architecture_style, global_location) 
VALUES ('Warpala Prime', 'Futuristic', '{"x": 0, "y": 0, "z": 0}')
ON CONFLICT DO NOTHING;

-- Link existing sectors to the first city
UPDATE sectors SET city_id = (SELECT id FROM cities LIMIT 1) WHERE city_id IS NULL;
