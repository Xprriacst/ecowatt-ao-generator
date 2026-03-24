import { NextRequest, NextResponse } from "next/server";
import { createChatCompletion } from "@/lib/ai-client";
import { PROMPT_GENERER_MEMOIRE } from "@/lib/prompts";
import { AIProvider } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { aoText, aoData, config, aiProvider } = await request.json() as {
      aoText: string;
      aoData: unknown;
      config: unknown;
      aiProvider: AIProvider;
    };

    if (!aoText || !config) {
      return NextResponse.json(
        { error: "Le texte de l'AO et la configuration entreprise sont requis" },
        { status: 400 }
      );
    }

    if (!aiProvider?.apiKey) {
      return NextResponse.json(
        { error: "Clé API manquante. Configurez votre provider IA dans les paramètres." },
        { status: 400 }
      );
    }

    const userMessage = `<appel_offres>
${aoText}
</appel_offres>

<analyse_ao>
${JSON.stringify(aoData, null, 2)}
</analyse_ao>

<config_entreprise>
${JSON.stringify(config, null, 2)}
</config_entreprise>

Génère le mémoire technique complet maintenant. Réponds UNIQUEMENT avec le tableau JSON.`;

    const chat = createChatCompletion(aiProvider);
    const responseText = await chat(PROMPT_GENERER_MEMOIRE, userMessage);

    // Parse le JSON retourné par le modèle
    let sections;
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Pas de tableau JSON trouvé dans la réponse");
      }
      sections = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("Erreur de parsing JSON:", responseText.substring(0, 500));
      return NextResponse.json(
        { error: "Erreur de parsing de la réponse IA", raw: responseText },
        { status: 500 }
      );
    }

    // Ajouter les champs editable et included à chaque section
    const formattedSections = sections.map((section: { id: string; titre: string; contenu: string }) => ({
      id: section.id,
      titre: section.titre,
      contenu: section.contenu,
      editable: true,
      included: true,
    }));

    return NextResponse.json({ sections: formattedSections });
  } catch (error: unknown) {
    console.error("Erreur API generer-memoire:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur interne du serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
