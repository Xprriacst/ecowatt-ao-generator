import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { PROMPT_GENERER_MEMOIRE } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { aoText, aoData, config } = await request.json();

    if (!aoText || !config) {
      return NextResponse.json(
        { error: "Le texte de l'AO et la configuration entreprise sont requis" },
        { status: 400 }
      );
    }

    const userMessage = `${PROMPT_GENERER_MEMOIRE}

<appel_offres>
${aoText}
</appel_offres>

<analyse_ao>
${JSON.stringify(aoData, null, 2)}
</analyse_ao>

<config_entreprise>
${JSON.stringify(config, null, 2)}
</config_entreprise>

Génère le mémoire technique complet maintenant. Réponds UNIQUEMENT avec le tableau JSON.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "Réponse vide de l'IA" },
        { status: 500 }
      );
    }

    // Parse le JSON retourné par Claude
    let sections;
    try {
      // Extraire le tableau JSON même s'il y a du texte autour
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Pas de tableau JSON trouvé dans la réponse");
      }
      sections = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", textContent.text.substring(0, 500));
      return NextResponse.json(
        { error: "Erreur de parsing de la réponse IA", raw: textContent.text },
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

    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number; error?: { message?: string } };
      const message = apiError.error?.message || "Erreur API Anthropic";
      return NextResponse.json(
        { error: `Erreur Anthropic (${apiError.status}): ${message}` },
        { status: apiError.status }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Erreur interne du serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
