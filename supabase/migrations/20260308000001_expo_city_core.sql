-- WARPALA EXPO CITY CORE SCHEMA

-- 1. SEKTORI (RAJONI)
CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    color_theme TEXT DEFAULT '#3b82f6',
    map_position JSONB, -- {x: number, y: number, z: number} priekš 2D/3D
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. UZŅĒMUMI
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'enterprise');

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES sectors(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    location TEXT,
    contact_email TEXT,
    tier subscription_tier DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. STENDI (BOOTH CONTENT)
CREATE TABLE IF NOT EXISTS booths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
    video_url TEXT,
    images JSONB DEFAULT '[]', -- Bilžu galerija
    services JSONB DEFAULT '[]', -- Pakalpojumu saraksts
    products JSONB DEFAULT '[]', -- Produktu saraksts
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PIEPRASĪJUMI / LEADS
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID, -- Var būt NULL, ja klients nav reģistrēts
    service_name TEXT,
    client_name TEXT,
    client_email TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, contacted, closed, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IESPĒJOJAM RLS (Row Level Security)
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- PUBLISKĀS LASĪŠANAS TIESĪBAS (Visi redz pilsētu)
CREATE POLICY "Public sectors are viewable by everyone" ON sectors FOR SELECT USING (true);
CREATE POLICY "Active companies are viewable by everyone" ON companies FOR SELECT USING (is_active = true);
CREATE POLICY "Booths are viewable by everyone" ON booths FOR SELECT USING (true);

-- DATU PARAUGI (Sākotnējie sektori)
INSERT INTO sectors (name, description, color_theme, map_position) VALUES
('Construction', 'Building innovation and contractors', '#eab308', '{"x": 0, "y": 0, "z": -150}'),
('Tech Zone', 'AI, Software and Hardware', '#3b82f6', '{"x": 0, "y": 0, "z": -250}'),
('Art Gallery', 'Digital and fine arts', '#8b5cf6', '{"x": 0, "y": 0, "z": -400}'),
('Real Estate', 'Global property and investment', '#ec4899', '{"x": 0, "y": 0, "z": -550}');
