import { NextRequest, NextResponse } from "next/server";
import { createChatCompletion } from "@/lib/ai-client";
import { PROMPT_ANALYSE_AO } from "@/lib/prompts";
import { AIProvider } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { aoText, aiProvider } = await request.json() as { aoText: string; aiProvider: AIProvider };

    if (!aoText || aoText.trim().length === 0) {
      return NextResponse.json(
        { error: "Le texte de l'appel d'offres est requis" },
        { status: 400 }
      );
    }

    if (!aiProvider?.apiKey) {
      return NextResponse.json(
        { error: "Clé API manquante. Configurez votre provider IA dans les paramètres." },
        { status: 400 }
      );
    }

    const chat = createChatCompletion(aiProvider);
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
