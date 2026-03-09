-- MARKETPLACE SERVICES
CREATE TABLE IF NOT EXISTS public.marketplace_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_starting_from DECIMAL,
    category TEXT,
    image_url TEXT,
    tags TEXT[],
    rating DECIMAL DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- REAL-TIME CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id),
    receiver_id UUID REFERENCES auth.users(id), -- NULL if global/AI
    session_id TEXT, -- For guest/AI sessions
    content TEXT NOT NULL,
    is_ai BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS SETTINGS
ALTER TABLE public.marketplace_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for services" ON public.marketplace_services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated chat" ON public.chat_messages FOR ALL USING (true);
