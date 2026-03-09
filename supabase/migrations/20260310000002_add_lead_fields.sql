-- Phase 9: Add additional fields to leads table
-- Adding score and contacted fields (status already exists from initial setup)

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS contacted BOOLEAN DEFAULT false;
