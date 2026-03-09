-- Phase 13: AI Agent Marketplace Tables

CREATE TABLE IF NOT EXISTS public.marketplace_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT UNIQUE NOT NULL, -- e.g., 'seo_agent'
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER DEFAULT 0,
    category TEXT,
    capabilities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.marketplace_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER DEFAULT 0,
    steps JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_installed_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    marketplace_agent_id UUID REFERENCES public.marketplace_agents(id) ON DELETE CASCADE,
    installed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_installed_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    marketplace_workflow_id UUID REFERENCES public.marketplace_workflows(id) ON DELETE CASCADE,
    installed_at TIMESTAMPTZ DEFAULT NOW()
);
