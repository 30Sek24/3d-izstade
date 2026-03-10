-- Phase 19-23: AI Revenue Engine

-- 1. Prospects Table (Businesses we target for our SaaS)
CREATE TABLE IF NOT EXISTS public.prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    website TEXT,
    email TEXT,
    industry TEXT,
    location TEXT,
    niche_relevance_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'new', -- new, analyzing, offer_generated, outreach_active, converted, rejected
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Personalized Offers Table
CREATE TABLE IF NOT EXISTS public.personalized_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
    offer_type TEXT NOT NULL, -- ai_website, ai_marketing, ai_lead_gen
    analysis_context TEXT, -- Data extracted from their website
    personalized_copy TEXT NOT NULL,
    stripe_checkout_url TEXT,
    status TEXT DEFAULT 'draft', -- draft, sent, accepted
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Conversion tracking table
CREATE TABLE IF NOT EXISTS public.revenue_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES public.personalized_offers(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- email_open, link_click, stripe_session_started, purchase_completed
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalized_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_conversions ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for revenue management
CREATE POLICY "Admins can manage prospects" ON public.prospects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Admins can manage offers" ON public.personalized_offers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Admins can view conversions" ON public.revenue_conversions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);
