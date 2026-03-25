-- ============================================================
-- ECOWATT AO GENERATOR - ADMIN API KEYS
-- ============================================================

-- ============================================================
-- TABLE: admin_config
-- Stocke les clés API IA (admin only)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL UNIQUE CHECK (provider IN ('openrouter', 'groq', 'openai', 'anthropic')),
  api_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger mise à jour automatique updated_at
CREATE OR REPLACE FUNCTION public.handle_admin_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_config_updated_at
  BEFORE UPDATE ON public.admin_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_config_updated_at();

-- ============================================================
-- TABLE: admin_config RLS
-- ============================================================
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Admin only: lecture
CREATE POLICY "Admins can view admin_config"
  ON public.admin_config FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin only: mise à jour
CREATE POLICY "Admins can update admin_config"
  ON public.admin_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert initiale via service_role uniquement (pas par users)
CREATE POLICY "Service role can manage admin_config"
  ON public.admin_config FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================
-- COLUMN: role dans profiles
-- ============================================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' 
CHECK (role IN ('admin', 'user'));

-- Valeur par défaut pour les users existants
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;

-- ============================================================
-- INDEX pour perf
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_config_provider ON public.admin_config(provider);
