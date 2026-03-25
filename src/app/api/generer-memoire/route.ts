import { NextRequest, NextResponse } from "next/server";
import { createChatCompletion } from "@/lib/ai-client";
import { PROMPT_GENERER_MEMOIRE } from "@/lib/prompts";
import { getAdminApiKey } from "@/lib/admin-config";
import { AIProviderType } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { aoText, aoData, config, contexteAO, aiProvider } = await request.json() as {
      aoText: string;
      aoData: unknown;
      config: unknown;
      contexteAO: { moyensTechniques: string; certificationsPertinentes: string; experiencesSimilaires: string; notesSpecifiques: string };
      aiProvider: { type: AIProviderType; model: string };
    };

    if (!aoText || !config) {
      return NextResponse.json(
        { error: "Le texte de l'AO et la configuration entreprise sont requis" },
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

    const userMessage = `<appel_offres>
${aoText}
</appel_offres>

<analyse_ao>
${JSON.stringify(aoData, null, 2)}
</analyse_ao>

<config_entreprise>
${JSON.stringify(config, null, 2)}
</config_entreprise>

<contexte_reponse_ao>
${contexteAO ? `Moyens techniques:\n${contexteAO.moyensTechniques || 'Non précisés'}\n\nCertifications pertinentes:\n${contexteAO.certificationsPertinentes || 'Aucune précisée'}\n\nExpériences similaires:\n${contexteAO.experiencesSimilaires || 'Aucune mentionnée'}\n\nNotes spécifiques:\n${contexteAO.notesSpecifiques || 'Aucune'}` : ''}
</contexte_reponse_ao>

Génère le mémoire technique complet maintenant. Réponds UNIQUEMENT avec le tableau JSON.`;

    const chat = createChatCompletion({ type: aiProvider.type, model: aiProvider.model }, apiKey);
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
