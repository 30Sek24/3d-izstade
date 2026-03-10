-- Phase 4: Outreach Logs Table
-- Tracks every email sent via the platform

CREATE TABLE IF NOT EXISTS public.outreach_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, failed, delivered, opened
    provider_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.outreach_logs ENABLE ROW LEVEL SECURITY;

-- Owner-only policy
CREATE POLICY "Users can view their own outreach logs" ON public.outreach_logs
    FOR SELECT USING (auth.uid() = user_id);
