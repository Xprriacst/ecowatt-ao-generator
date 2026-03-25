-- ============================================================
-- ECOWATT AO GENERATOR - SCHEMA SUPABASE
-- ============================================================

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  nom_entreprise TEXT,
  config_entreprise JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- TABLE: usage
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL, -- Format: '2026-03'
  ao_count INT DEFAULT 0,
  ao_limit INT DEFAULT 1, -- 1 for free, 5 for pro
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, month)
);

CREATE TRIGGER usage_updated_at
  BEFORE UPDATE ON public.usage
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- TABLE: ao_history
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ao_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  titre TEXT,
  ao_text TEXT,
  analyse_data JSONB,
  reponse JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'exported')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER ao_history_updated_at
  BEFORE UPDATE ON public.ao_history
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ao_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS: profiles
-- ============================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- RLS: subscriptions
-- ============================================================

-- Users can only see their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (for Stripe webhooks)
CREATE POLICY "Service role can manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================
-- RLS: usage
-- ============================================================

-- Users can only see their own usage
CREATE POLICY "Users can view own usage"
  ON public.usage FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own usage
CREATE POLICY "Users can update own usage"
  ON public.usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own usage
CREATE POLICY "Users can insert own usage"
  ON public.usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS: ao_history
-- ============================================================

-- Users can only see their own AO history
CREATE POLICY "Users can view own ao_history"
  ON public.ao_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own AO history
CREATE POLICY "Users can insert own ao_history"
  ON public.ao_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own AO history
CREATE POLICY "Users can update own ao_history"
  ON public.ao_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own AO history
CREATE POLICY "Users can delete own ao_history"
  ON public.ao_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: handle_new_user
-- ============================================================
-- Auto-creates a profile when a user signs up via auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: get_or_create_usage
-- ============================================================
-- Gets or creates usage record for current month
CREATE OR REPLACE FUNCTION public.get_or_create_usage(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  month TEXT,
  ao_count INT,
  ao_limit INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  v_month TEXT;
  v_record RECORD;
BEGIN
  v_month := to_char(now(), 'YYYY-MM');
  
  -- Try to get existing record
  SELECT * INTO v_record
  FROM public.usage
  WHERE user_id = p_user_id AND month = v_month;
  
  IF FOUND THEN
    RETURN QUERY SELECT v_record.id, v_record.user_id, v_record.month, v_record.ao_count, v_record.ao_limit, v_record.created_at, v_record.updated_at;
  ELSE
    -- Get user's plan to set correct limit
    SELECT COALESCE(
      (SELECT ao_limit FROM public.subscriptions WHERE user_id = p_user_id AND status = 'active'),
      1
    ) INTO v_record;
    
    INSERT INTO public.usage (user_id, month, ao_count, ao_limit)
    VALUES (p_user_id, v_month, 0, v_record.ao_limit)
    RETURNING * INTO v_record;
    
    RETURN QUERY SELECT v_record.id, v_record.user_id, v_record.month, v_record.ao_count, v_record.ao_limit, v_record.created_at, v_record.updated_at;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: increment_usage
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_usage(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_month TEXT;
  v_current_count INT;
BEGIN
  v_month := to_char(now(), 'YYYY-MM');
  
  UPDATE public.usage
  SET ao_count = ao_count + 1, updated_at = now()
  WHERE user_id = p_user_id AND month = v_month
  RETURNING ao_count INTO v_current_count;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
