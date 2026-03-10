-- Phase 11: Growth Engine Tables

CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    niche TEXT NOT NULL,
    title TEXT NOT NULL,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    content_html TEXT NOT NULL,
    status TEXT DEFAULT 'draft', -- draft, published
    conversion_rate NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- Allow public viewing of published pages
CREATE POLICY "Anyone can view published landing pages" ON public.landing_pages
    FOR SELECT USING (status = 'published');

-- Allow owners to manage their pages (linking to projects)
CREATE POLICY "Users can manage landing pages for their projects" ON public.landing_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = landing_pages.project_id 
            AND projects.user_id = auth.uid()
        )
    );
