import { NextRequest, NextResponse } from "next/server";
import { createChatCompletion } from "@/lib/ai-client";
import { PROMPT_ANALYSE_AO } from "@/lib/prompts";
import { getAdminApiKey } from "@/lib/admin-config";
import { AIProviderType } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { aoText, aiProvider } = await request.json() as { 
      aoText: string; 
      aiProvider: { type: AIProviderType; model: string };
    };

    if (!aoText || aoText.trim().length === 0) {
      return NextResponse.json(
        { error: "Le texte de l'appel d'offres est requis" },
        { status: 400 }
      );
    }

    // Récupérer la clé API depuis admin_config (coté server)
    const apiKey = await getAdminApiKey(aiProvider.type);
    if (!apiKey) {
      return NextResponse.json(
        { error: `Clé API non configurée pour ${aiProvider.type}. Contactez l'administrateur.` },
        { status: 400 }
      );
    }

    const chat = createChatCompletion({ type: aiProvider.type, model: aiProvider.model }, apiKey);
    const responseText = await chat(
      PROMPT_ANALYSE_AO,
      `<appel_offres>\n${aoText}\n</appel_offres>`
    );

    // Parse le JSON retourné par le modèle
    let parsed;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Pas de JSON trouvé dans la réponse");
      }
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("Erreur de parsing JSON:", responseText);
      return NextResponse.json(
        { error: "Erreur de parsing de la réponse IA", raw: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Erreur API analyse-ao:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur interne du serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
