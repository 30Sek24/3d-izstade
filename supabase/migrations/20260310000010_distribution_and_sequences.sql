-- Phase 14-16: Distribution, Analytics, and Sequences

-- 1. Content Schedule Table
CREATE TABLE IF NOT EXISTS public.content_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- twitter, linkedin, reddit
    content JSONB NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled', -- scheduled, published, failed
    published_at TIMESTAMPTZ,
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Traffic Analytics Table
CREATE TABLE IF NOT EXISTS public.traffic_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE SET NULL,
    source TEXT NOT NULL, -- reddit, twitter, direct, etc.
    campaign TEXT,
    device_type TEXT,
    converted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Email Sequences Table
CREATE TABLE IF NOT EXISTS public.email_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    steps JSONB NOT NULL, -- [{ "day": 0, "subject": "...", "body": "..." }, { "day": 2, ... }]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Sequence Progress
CREATE TABLE IF NOT EXISTS public.user_sequence_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    sequence_id UUID REFERENCES public.email_sequences(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 0,
    last_sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active', -- active, completed, paused
    UNIQUE(lead_id, sequence_id)
);

-- Add slug to landing_pages if missing
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Enable RLS
ALTER TABLE public.content_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sequence_progress ENABLE ROW LEVEL SECURITY;

-- Basic Owner-only policies
CREATE POLICY "Users can manage their content schedule" ON public.content_schedule FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = content_schedule.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can view their analytics" ON public.traffic_analytics FOR SELECT USING (true); -- Public for tracking
