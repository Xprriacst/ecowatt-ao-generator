import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl, pdfBase64, pdfFilename, images, dpgfBase64, dpgfFilename } =
      await request.json();

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "L'URL du webhook n8n est requise" },
        { status: 400 }
      );
    }

    if (!pdfBase64 && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: "Au moins un fichier PDF ou une image est requis" },
        { status: 400 }
      );
    }

    // Construire le payload identique à celui de l'interface HTML standalone
    const payload: Record<string, unknown> = {};

    if (pdfBase64) {
      payload.pdf_base64 = pdfBase64;
      payload.pdf_filename = pdfFilename;
    }

    if (images && images.length > 0) {
      payload.images = images;
    }

    if (dpgfBase64) {
      payload.dpgf_base64 = dpgfBase64;
      payload.dpgf_filename = dpgfFilename;
    }

    // Appel au webhook n8n
    let response: Response;
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      return NextResponse.json(
        { error: `Impossible de contacter le webhook n8n (${msg}). Vérifiez que le serveur est accessible.` },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Le webhook n8n a répondu avec une erreur HTTP ${response.status}. Vérifiez que le workflow est actif.` },
        { status: 502 }
      );
    }

    // n8n renvoie du texte Markdown
    const markdown = await response.text();

    return NextResponse.json({ rapportMarkdown: markdown });
  } catch (error: unknown) {
    console.error("Erreur API analyser-plans:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur interne du serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
