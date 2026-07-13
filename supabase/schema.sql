-- ============================================================
-- SalesNova AI — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'outreach_agent' CHECK (role IN ('admin', 'sales_manager', 'outreach_agent', 'designer', 'developer')),
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'away', 'offline')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  website TEXT DEFAULT '',
  location TEXT DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  description TEXT DEFAULT '',
  social_links JSONB DEFAULT '[]'::jsonb,
  source TEXT DEFAULT 'website' CHECK (source IN ('google_maps', 'instagram', 'facebook', 'linkedin', 'justdial', 'indiamart', 'website', 'referral')),
  tags TEXT[] DEFAULT '{}',
  ai_score INT DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'ai_analyzed', 'contacted', 'follow_up', 'interested', 'proposal_sent', 'meeting_scheduled', 'closed', 'rejected')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON public.leads(ai_score DESC);

-- ============================================================
-- 3. PIPELINE STAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. DEALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  value NUMERIC(12,2) DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_activity TEXT DEFAULT '',
  ai_insight TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_lead ON public.deals(lead_id);

-- ============================================================
-- 5. TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'outreach' CHECK (type IN ('outreach', 'follow_up', 'redesign', 'proposal', 'meeting', 'onboarding', 'lead_scraping')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON public.tasks(assigned_to);

-- ============================================================
-- 6. OUTREACH MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.outreach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'email', 'instagram', 'linkedin')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'sent', 'replied', 'converted')),
  sent_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outreach_status ON public.outreach_messages(status);
CREATE INDEX IF NOT EXISTS idx_outreach_lead ON public.outreach_messages(lead_id);

-- ============================================================
-- 7. ARTIFACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'message' CHECK (type IN ('message', 'redesign', 'audit', 'proposal', 'landing_page', 'pitch_deck')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. ACTIVITY FEED
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT DEFAULT 'lead' CHECK (type IN ('outreach', 'pipeline', 'ai', 'artifact', 'lead', 'deal', 'task')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity_feed(created_at DESC);

-- ============================================================
-- 9. AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['leads', 'deals', 'tasks', 'outreach_messages', 'artifacts', 'profiles'])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON public.%I;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    ', tbl, tbl);
  END LOOP;
END;
$$;

-- ============================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (team-level app)
CREATE POLICY "Authenticated users can read all" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Team can read leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can insert leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Team can update leads" ON public.leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Team can delete leads" ON public.leads FOR DELETE TO authenticated USING (true);

CREATE POLICY "Team can read deals" ON public.deals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can insert deals" ON public.deals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Team can update deals" ON public.deals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Team can delete deals" ON public.deals FOR DELETE TO authenticated USING (true);

CREATE POLICY "Team can read tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can insert tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Team can update tasks" ON public.tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Team can delete tasks" ON public.tasks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Team can read outreach" ON public.outreach_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can insert outreach" ON public.outreach_messages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Team can update outreach" ON public.outreach_messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Team can delete outreach" ON public.outreach_messages FOR DELETE TO authenticated USING (true);

CREATE POLICY "Team can read artifacts" ON public.artifacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can insert artifacts" ON public.artifacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Team can update artifacts" ON public.artifacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Team can delete artifacts" ON public.artifacts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Team can read activity" ON public.activity_feed FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can insert activity" ON public.activity_feed FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Team can read stages" ON public.pipeline_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can manage stages" ON public.pipeline_stages FOR ALL TO authenticated USING (true);

-- ============================================================
-- 11. SEED DATA — Pipeline Stages
-- ============================================================
INSERT INTO public.pipeline_stages (name, color, position) VALUES
  ('New Lead', '#6366f1', 0),
  ('AI Analyzed', '#8b5cf6', 1),
  ('Contacted', '#06b6d4', 2),
  ('Follow-Up', '#f59e0b', 3),
  ('Interested', '#10b981', 4),
  ('Proposal Sent', '#3b82f6', 5),
  ('Meeting', '#8b5cf6', 6),
  ('Closed Won', '#22c55e', 7),
  ('Rejected', '#ef4444', 8)
ON CONFLICT DO NOTHING;
