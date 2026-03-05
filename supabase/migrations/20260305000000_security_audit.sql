-- PR 4: Security Audit & Comprehensive RLS Policies (INTELLIGENT COLUMN VERSION 2)
-- Date: 2026-03-05

-- ==========================================
-- 1. TABULU UN KOLONNU STRUKTŪRAS SAKĀRTOŠANA
-- ==========================================

-- Organization sakārtošana
CREATE TABLE IF NOT EXISTS organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    business_type TEXT,
    logo_url TEXT
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organization' AND column_name='owner_id') THEN
        ALTER TABLE organization ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Estimates sakārtošana
CREATE TABLE IF NOT EXISTS estimate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    estimate_no TEXT NOT NULL,
    client_name TEXT,
    project_name TEXT,
    status TEXT DEFAULT 'draft',
    total_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS estimate_line (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID REFERENCES estimate(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC DEFAULT 1,
    unit TEXT,
    unit_price NUMERIC DEFAULT 0,
    total_price NUMERIC DEFAULT 0
);

-- Marketing Autopilot sakārtošana
CREATE TABLE IF NOT EXISTS marketing_autopilot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    total_reach INTEGER DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketing_autopilot' AND column_name='org_id') THEN
        ALTER TABLE marketing_autopilot ADD COLUMN org_id UUID REFERENCES organization(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Booth Offer sakārtošana
CREATE TABLE IF NOT EXISTS booth_offer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booth_id UUID REFERENCES expo_booth(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Booth Asset sakārtošana
CREATE TABLE IF NOT EXISTS booth_asset (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booth_id UUID REFERENCES expo_booth(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 2. RLS IESLĒGŠANA
-- ==========================================
ALTER TABLE organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_line ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_autopilot ENABLE ROW LEVEL SECURITY;
ALTER TABLE booth_offer ENABLE ROW LEVEL SECURITY;
ALTER TABLE booth_asset ENABLE ROW LEVEL SECURITY;
ALTER TABLE expo_seminar ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. VECO POLITIKU DZĒŠANA (Tīrīšana)
-- ==========================================
DO $$ 
DECLARE
    pol_cmd TEXT;
BEGIN
    SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON ' || quote_ident(tablename) || ';', ' ')
    INTO pol_cmd
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN ('organization', 'estimate', 'estimate_line', 'marketing_autopilot', 'booth_offer', 'booth_asset', 'expo_seminar');

    IF pol_cmd IS NOT NULL THEN
        EXECUTE pol_cmd;
    END IF;
END $$;

-- ==========================================
-- 4. JAUNU POLITIKU PIEMĒROŠANA (Ar dinamisko kolonnu pārbaudi)
-- ==========================================

-- Organization
CREATE POLICY "org_select_own" ON organization FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "org_update_own" ON organization FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "org_insert_authenticated" ON organization FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Estimates
CREATE POLICY "est_manage_own" ON estimate FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "est_line_manage_own" ON estimate_line FOR ALL USING (
    EXISTS (SELECT 1 FROM estimate e WHERE e.id = estimate_line.estimate_id AND e.user_id = auth.uid())
);

-- Marketing Autopilot
CREATE POLICY "auto_manage_own" ON marketing_autopilot FOR ALL USING (
    EXISTS (SELECT 1 FROM organization o WHERE o.id = marketing_autopilot.org_id AND o.owner_id = auth.uid())
);

-- Booth Offers
CREATE POLICY "offer_select_all" ON booth_offer FOR SELECT USING (true);
CREATE POLICY "offer_manage_own" ON booth_offer FOR ALL USING (
    EXISTS (SELECT 1 FROM expo_booth b JOIN organization o ON b.org_id = o.id WHERE b.id = booth_offer.booth_id AND o.owner_id = auth.uid())
);

-- Booth Assets
CREATE POLICY "asset_select_all" ON booth_asset FOR SELECT USING (true);
CREATE POLICY "asset_manage_own" ON booth_asset FOR ALL USING (
    EXISTS (SELECT 1 FROM expo_booth b JOIN organization o ON b.org_id = o.id WHERE b.id = booth_asset.booth_id AND o.owner_id = auth.uid())
);

-- Expo Seminar (Dinamiska politika, kas atpazīst gan booth_id, gan expo_booth_id)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expo_seminar' AND column_name='booth_id') THEN
        EXECUTE 'CREATE POLICY seminar_select_all ON expo_seminar FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY seminar_manage_own ON expo_seminar FOR ALL USING (EXISTS (SELECT 1 FROM expo_booth b JOIN organization o ON b.org_id = o.id WHERE b.id = expo_seminar.booth_id AND o.owner_id = auth.uid()))';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expo_seminar' AND column_name='expo_booth_id') THEN
        EXECUTE 'CREATE POLICY seminar_select_all ON expo_seminar FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY seminar_manage_own ON expo_seminar FOR ALL USING (EXISTS (SELECT 1 FROM expo_booth b JOIN organization o ON b.org_id = o.id WHERE b.id = expo_seminar.expo_booth_id AND o.owner_id = auth.uid()))';
    END IF;
END $$;
