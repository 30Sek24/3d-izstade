-- Phase 6: API Usage and Cost Protection Tables

-- 1. Logs every LLM call and its token cost
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    provider TEXT NOT NULL, -- openai, gemini, serpapi, resend
    model TEXT,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    estimated_cost_usd NUMERIC DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily limits tracker for users
CREATE TABLE IF NOT EXISTS public.user_daily_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    usage_date DATE DEFAULT CURRENT_DATE,
    total_requests INTEGER DEFAULT 0,
    total_credits_consumed INTEGER DEFAULT 0,
    UNIQUE(user_id, usage_date)
);

-- Enable RLS
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API usage" ON public.api_usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own daily limits" ON public.user_daily_limits FOR SELECT USING (auth.uid() = user_id);
