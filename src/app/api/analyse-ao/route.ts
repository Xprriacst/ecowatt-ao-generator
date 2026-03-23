import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { PROMPT_ANALYSE_AO } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { aoText } = await request.json();

    if (!aoText || aoText.trim().length === 0) {
      return NextResponse.json(
        { error: "Le texte de l'appel d'offres est requis" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `${PROMPT_ANALYSE_AO}\n\n<appel_offres>\n${aoText}\n</appel_offres>`,
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
    let parsed;
    try {
      // Extraire le JSON même s'il y a du texte autour
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Pas de JSON trouvé dans la réponse");
      }
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", textContent.text);
      return NextResponse.json(
        { error: "Erreur de parsing de la réponse IA", raw: textContent.text },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Erreur API analyse-ao:", error);

    // Gestion des erreurs Anthropic
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
