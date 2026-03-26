/**
 * Admin API Keys Management
 * Fonctions server-side pour gérer les clés API IA.
 * Ces fonctions ne doivent JAMAIS être appelées côté client.
 */

import { createClient } from './supabase/server';

export interface AdminProviderConfig {
  provider: string;
  api_key: string;
  enabled: boolean;
}

/**
 * Récupère la config admin (clés API) pour un provider donné.
 * Utilisé côté server dans les API routes IA.
 */
export async function getAdminApiKey(provider: string): Promise<string | null> {
  // 1. Try Supabase admin_config table
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('admin_config')
      .select('api_key, enabled')
      .eq('provider', provider)
      .eq('enabled', true)
      .single();

    if (!error && data?.api_key) {
      return data.api_key;
    }
  } catch {
    // Supabase not configured — fall through to env vars
  }

  // 2. Fallback to environment variables
  const envMap: Record<string, string> = {
    openrouter: 'OPENROUTER_API_KEY',
    groq: 'GROQ_API_KEY',
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
  };
  const envKey = envMap[provider];
  if (envKey && process.env[envKey]) {
    return process.env[envKey]!;
  }

  console.error(`[admin-config] Aucune clé API trouvée pour ${provider}`);
  return null;
}

/**
 * Récupère la config complète de tous les providers (admin only).
 * Retourne sans les api_key (juste enabled) pour le client.
 */
export async function getAdminConfigSummary(): Promise<Record<string, { enabled: boolean }>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('admin_config')
    .select('provider, enabled');

  if (error) {
    console.error('[admin-config] Erreur getAdminConfigSummary:', error);
    return {};
  }

  const result: Record<string, { enabled: boolean }> = {};
  for (const row of data ?? []) {
    result[row.provider] = { enabled: row.enabled };
  }
  return result;
}

/**
 * Récupère la config complète admin (admin only).
 * Inclut les api_key - NE JAMAIS exposer au client.
 */
export async function getAdminConfig(): Promise<AdminProviderConfig[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('admin_config')
    .select('provider, api_key, enabled')
    .order('provider');

  if (error) {
    console.error('[admin-config] Erreur getAdminConfig:', error);
    return [];
  }

  return data ?? [];
}

/**
 * Met à jour la config d'un provider (admin only).
 */
export async function updateAdminConfig(
  provider: string,
  apiKey: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('admin_config')
    .upsert(
      { provider, api_key: apiKey, enabled },
      { onConflict: 'provider' }
    );

  if (error) {
    console.error('[admin-config] Erreur updateAdminConfig:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Vérifie si l'utilisateur courant est admin.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) return false;
  return data.role === 'admin';
}
