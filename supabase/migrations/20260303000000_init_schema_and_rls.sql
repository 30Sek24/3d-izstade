-- PR 1 & PR 2 & PR 3: Init Schema, Re-enable RLS, Owner Isolation, and Telemetry Tables

-- 1. Create essential tables (if they don't exist)
CREATE TABLE IF NOT EXISTS organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    business_type TEXT,
    logo_url TEXT,
    owner_id UUID REFERENCES auth.users(id) NOT NULL -- Links to Supabase Auth user
);

CREATE TABLE IF NOT EXISTS expo_booth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organization(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    plan_type TEXT DEFAULT 'standard',
    is_paid BOOLEAN DEFAULT false,
    color TEXT DEFAULT '#3b82f6',
    position_z FLOAT,
    side TEXT
);

CREATE TABLE IF NOT EXISTS ad_slot (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    base_price_weekly NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS ad_campaign (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organization(id) ON DELETE CASCADE,
    slot_id TEXT REFERENCES ad_slot(id),
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL,
    link_url TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS expo_seminar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    is_live BOOLEAN DEFAULT false,
    expo_booth_id UUID REFERENCES expo_booth(id)
);

-- PR 3: Telemetry tables
CREATE TABLE IF NOT EXISTS ad_impression (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES ad_campaign(id) ON DELETE CASCADE,
    visitor_id TEXT, -- Anonymous session ID or user ID
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ad_click (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES ad_campaign(id) ON DELETE CASCADE,
    visitor_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS booth_lead (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booth_id UUID REFERENCES expo_booth(id) ON DELETE CASCADE,
    visitor_id TEXT,
    contact_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for performance and telemetry queries
CREATE INDEX IF NOT EXISTS idx_ad_campaign_active ON ad_campaign(slot_id, is_active, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_ad_impression_campaign ON ad_impression(campaign_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ad_click_campaign ON ad_click(campaign_id, created_at);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE expo_booth ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_slot ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaign ENABLE ROW LEVEL SECURITY;
ALTER TABLE expo_seminar ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impression ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_click ENABLE ROW LEVEL SECURITY;
ALTER TABLE booth_lead ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (PR 1 & PR 2)

-- Organization: Users can only see and edit their own organization
CREATE POLICY "Users can view their own organization" ON organization
    FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can update their own organization" ON organization
    FOR UPDATE USING (auth.uid() = owner_id);

-- Expo Booth: Anyone can read public info, but only org owner can edit
CREATE POLICY "Anyone can view expo booths" ON expo_booth
    FOR SELECT USING (true);
CREATE POLICY "Org owner can insert booth" ON expo_booth
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM organization WHERE id = expo_booth.org_id AND owner_id = auth.uid()));
CREATE POLICY "Org owner can update booth" ON expo_booth
    FOR UPDATE USING (EXISTS (SELECT 1 FROM organization WHERE id = expo_booth.org_id AND owner_id = auth.uid()));

-- Ad Slots: Publicly readable (to know what to buy), not editable by clients
CREATE POLICY "Anyone can view ad slots" ON ad_slot
    FOR SELECT USING (true);

-- Ad Campaigns: Publicly readable IF active, org owner can manage ALL their campaigns
CREATE POLICY "Anyone can view active ad campaigns" ON ad_campaign
    FOR SELECT USING (is_active = true AND now() BETWEEN start_date AND end_date);
CREATE POLICY "Org owner can view all their campaigns" ON ad_campaign
    FOR SELECT USING (EXISTS (SELECT 1 FROM organization WHERE id = ad_campaign.org_id AND owner_id = auth.uid()));
CREATE POLICY "Org owner can insert campaigns" ON ad_campaign
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM organization WHERE id = ad_campaign.org_id AND owner_id = auth.uid()));
CREATE POLICY "Org owner can update campaigns" ON ad_campaign
    FOR UPDATE USING (EXISTS (SELECT 1 FROM organization WHERE id = ad_campaign.org_id AND owner_id = auth.uid()));

-- Expo Seminar: Publicly readable
CREATE POLICY "Anyone can view seminars" ON expo_seminar
    FOR SELECT USING (true);

-- Telemetry (Impressions & Clicks): Anyone can insert (anonymous web traffic), only org owners can read their own
CREATE POLICY "Anyone can insert impressions" ON ad_impression
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Org owners can read their own impressions" ON ad_impression
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ad_campaign c 
            JOIN organization o ON c.org_id = o.id 
            WHERE c.id = ad_impression.campaign_id AND o.owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert clicks" ON ad_click
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Org owners can read their own clicks" ON ad_click
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ad_campaign c 
            JOIN organization o ON c.org_id = o.id 
            WHERE c.id = ad_click.campaign_id AND o.owner_id = auth.uid()
        )
    );

-- Booth Leads: Anyone can insert (visitor submitting form), only org owners can read
CREATE POLICY "Anyone can insert booth leads" ON booth_lead
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Org owners can read their own booth leads" ON booth_lead
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM expo_booth b 
            JOIN organization o ON b.org_id = o.id 
            WHERE b.id = booth_lead.booth_id AND o.owner_id = auth.uid()
        )
    );
