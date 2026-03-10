-- Phase 17: Security & Auth Orchestration
-- 1. Enable RLS on all system tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expo_booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booth_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_installed_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_installed_workflows ENABLE ROW LEVEL SECURITY;

-- 2. USERS Table Policies
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 3. PROJECTS Table Policies
CREATE POLICY "Users can manage their own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- 4. AGENT_TASKS Table Policies
-- Tasks are linked to projects, so we check if the user owns the project
CREATE POLICY "Users can view tasks for their projects" ON public.agent_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = agent_tasks.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- 5. LEADS Table Policies
-- For simplicity, leads in this phase are user-specific if we add a user_id, 
-- or global if shared. Let's make them private by adding a user_id check.
-- First, let's add user_id to leads for proper RLS
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id);

CREATE POLICY "Users can manage their own leads" ON public.leads
    FOR ALL USING (auth.uid() = user_id);

-- 6. EXPO_BOOTHS Table Policies
-- Expo booths are usually public for viewing but private for editing
CREATE POLICY "Anyone can view active booths" ON public.expo_booths
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage their own booths" ON public.expo_booths
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- 7. MARKETPLACE (Read-only for users)
ALTER TABLE public.marketplace_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view marketplace" ON public.marketplace_agents FOR SELECT USING (true);
CREATE POLICY "Everyone can view workflows" ON public.marketplace_workflows FOR SELECT USING (true);

-- 8. USER_INSTALLED (Owner-only)
CREATE POLICY "Users can view their own installs" ON public.user_installed_agents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own workflow installs" ON public.user_installed_workflows FOR ALL USING (auth.uid() = user_id);

-- 9. AUTH TRIGGER
-- Automatically sync Supabase Auth users with our public.users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name',
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
