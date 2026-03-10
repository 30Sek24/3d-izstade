-- Phase 17: Agent Governance and Safety

CREATE TABLE IF NOT EXISTS public.governance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL, -- loop_detected, budget_exceeded, velocity_limit
    severity TEXT DEFAULT 'warning', -- warning, critical, blocked
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow stats to track depth and task count
CREATE TABLE IF NOT EXISTS public.workflow_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    total_tasks_run INTEGER DEFAULT 0,
    max_depth INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    last_run_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.governance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their alerts" ON public.governance_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their workflow stats" ON public.workflow_stats FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = workflow_stats.project_id AND projects.user_id = auth.uid())
);
