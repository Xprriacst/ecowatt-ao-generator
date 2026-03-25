import { NextRequest, NextResponse } from 'next/server';
import { getAdminConfig, getAdminConfigSummary, updateAdminConfig, isAdmin } from '@/lib/admin-config';

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    // Retourne la config SANS les api_key pour le client
    const summary = await getAdminConfigSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('[api/admin/config] GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const { provider, apiKey, enabled } = await request.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'provider et apiKey sont requis' },
        { status: 400 }
      );
    }

    const validProviders = ['openrouter', 'groq', 'openai', 'anthropic'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: 'Provider invalide' },
        { status: 400 }
      );
    }

    const result = await updateAdminConfig(provider, apiKey, enabled ?? true);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/admin/config] PUT error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
