"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, Upload, FileText, Image, X, Loader2, Trash2, Copy, Download, Settings } from "lucide-react";
import { AnalysePlans } from "@/lib/types";

interface StepPlansProps {
  analysePlans: AnalysePlans;
  setAnalysePlans: (a: AnalysePlans) => void;
  onGenerer: () => void;
  onRetour: () => void;
  isGenerating?: boolean;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StepPlans({ analysePlans, setAnalysePlans, onGenerer, onRetour, isGenerating }: StepPlansProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [dpgfFile, setDpgfFile] = useState<File | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("http://187.77.169.67:5678/webhook-test/btp-electricite-agents-test");
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [copied, setCopied] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const dpgfInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files.filter((f) => !prev.some((p) => p.name === f.name && p.size === f.size))]);
  };

  const handleDpgfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDpgfFile(file);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent, type: "pdf" | "images" | "dpgf") => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (type === "pdf" && files[0]) setPdfFile(files[0]);
    if (type === "images") setImageFiles((prev) => [...prev, ...files]);
    if (type === "dpgf" && files[0]) setDpgfFile(files[0]);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAnalyserPlans = async () => {
    if (!pdfFile && imageFiles.length === 0) {
      setAnalysePlans({ ...analysePlans, status: "error", error: "Ajoutez au moins un PDF ou une image de plan" });
      return;
    }

    setIsAnalysing(true);
    setAnalysePlans({ rapportMarkdown: "", status: "loading" });

    try {
      const payload: Record<string, unknown> = { webhookUrl };

      if (pdfFile) {
        payload.pdfBase64 = await fileToBase64(pdfFile);
        payload.pdfFilename = pdfFile.name;
      }

      if (imageFiles.length > 0) {
        const images = [];
        for (const img of imageFiles) {
          images.push({
            base64: await fileToBase64(img),
            filename: img.name,
            mime: img.type,
          });
        }
        payload.images = images;
      }

      if (dpgfFile) {
        payload.dpgfBase64 = await fileToBase64(dpgfFile);
        payload.dpgfFilename = dpgfFile.name;
      }

      const response = await fetch("/api/analyser-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur lors de l'analyse des plans");
      }

      const result = await response.json();
      setAnalysePlans({ rapportMarkdown: result.rapportMarkdown, status: "done" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setAnalysePlans({ rapportMarkdown: "", status: "error", error: message });
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(analysePlans.rapportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([analysePlans.rapportMarkdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rapport-analyse-plans.md";
    a.click();
  };

  const hasFiles = pdfFile || imageFiles.length > 0;

  return (
    <div className="space-y-6">
      {/* Header + config webhook */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Analyse des plans techniques</h2>
          <p className="text-sm text-muted">
            Uploadez vos plans PDF et images pour une analyse IA multi-agents via n8n
          </p>
        </div>
        <button
          onClick={() => setShowWebhookConfig(!showWebhookConfig)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
        >
          <Settings className="w-3.5 h-3.5" />
          Webhook
        </button>
      </div>

      {showWebhookConfig && (
        <div className="bg-surface-alt rounded-lg p-4 border border-border">
          <label className="text-xs font-medium text-muted uppercase tracking-wide">URL du Webhook n8n</label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-surface text-sm font-mono"
            placeholder="http://votre-serveur:5678/webhook-test/votre-workflow"
          />
          <p className="text-xs text-muted mt-1">Modifiez cette URL pour pointer vers votre workflow n8n</p>
        </div>
      )}

      {/* Upload zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF upload */}
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Plan PDF</h3>
          </div>

          {pdfFile ? (
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-primary truncate flex-1">{pdfFile.name}</span>
              <span className="text-xs text-muted">{(pdfFile.size / 1024 / 1024).toFixed(1)} Mo</span>
              <button onClick={() => { setPdfFile(null); if (pdfInputRef.current) pdfInputRef.current.value = ""; }} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDrop={(e) => handleDrop(e, "pdf")}
              onDragOver={handleDragOver}
              onClick={() => pdfInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <input ref={pdfInputRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
              <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-muted">Glisser-déposer le PDF</p>
              <p className="text-xs text-muted/60 mt-1">.pdf uniquement</p>
            </div>
          )}
        </div>

        {/* Images upload */}
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Images du plan</h3>
          </div>

          <div
            onDrop={(e) => handleDrop(e, "images")}
            onDragOver={handleDragOver}
            onClick={() => imagesInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all mb-3"
          >
            <input ref={imagesInputRef} type="file" accept=".png,.jpg,.jpeg,.webp" multiple onChange={handleImagesUpload} className="hidden" />
            <Upload className="w-6 h-6 text-muted mx-auto mb-1" />
            <p className="text-xs font-medium text-muted">Ajouter des images (.png .jpg .webp)</p>
          </div>

          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageFiles.map((file, i) => (
                <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border">
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DPGF (optionnel) */}
      <div className="bg-surface rounded-xl p-5 shadow-sm border border-border">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-sm">DPGF (optionnel)</h3>
          <span className="text-xs text-muted bg-surface-alt px-2 py-0.5 rounded-full">Analyse comparative</span>
        </div>

        {dpgfFile ? (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-sm font-medium text-amber-700 truncate flex-1">{dpgfFile.name}</span>
            <button onClick={() => { setDpgfFile(null); if (dpgfInputRef.current) dpgfInputRef.current.value = ""; }} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDrop={(e) => handleDrop(e, "dpgf")}
            onDragOver={handleDragOver}
            onClick={() => dpgfInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all"
          >
            <input ref={dpgfInputRef} type="file" accept=".xlsx,.xls" onChange={handleDpgfUpload} className="hidden" />
            <p className="text-xs font-medium text-muted">Ajouter un DPGF (.xlsx)</p>
          </div>
        )}
      </div>

      {/* Bouton analyser */}
      {analysePlans.status !== "done" && (
        <button
          onClick={handleAnalyserPlans}
          disabled={!hasFiles || isAnalysing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalysing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyse en cours via n8n (2 à 5 min)...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Analyser les plans
            </>
          )}
        </button>
      )}

      {/* Erreur */}
      {analysePlans.status === "error" && analysePlans.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <strong>Erreur :</strong> {analysePlans.error}
        </div>
      )}

      {/* Résultat */}
      {analysePlans.status === "done" && analysePlans.rapportMarkdown && (
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Rapport d&apos;analyse des plans</h3>
            <div className="flex items-center gap-2">
              <button onClick={handleCopyMarkdown} className="text-xs text-primary hover:text-primary-dark flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copié !" : "Copier"}
              </button>
              <button onClick={handleDownloadMarkdown} className="text-xs text-primary hover:text-primary-dark flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                Télécharger
              </button>
              <button
                onClick={() => { setAnalysePlans({ rapportMarkdown: "", status: "idle" }); }}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Refaire
              </button>
            </div>
          </div>
          <div
            className="p-6 prose prose-sm max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(analysePlans.rapportMarkdown) }}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onRetour}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;analyse
        </button>
        <button
          onClick={onGenerer}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Génération du mémoire...
            </>
          ) : (
            <>
              Générer le mémoire technique
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Simple Markdown to HTML converter (basic)
function simpleMarkdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-foreground mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-primary mt-5 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-primary mt-6 mb-3 border-b border-border pb-2">$1</h1>');

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
  html = html.replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Tables (basic)
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split("|").filter(Boolean).map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) return "";
    const tag = "td";
    return "<tr>" + cells.map((c) => `<${tag} class="border border-border px-2 py-1 text-xs">${c}</${tag}>`).join("") + "</tr>";
  });

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-border my-4" />');

  // Paragraphs (blank lines)
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";
  html = html.replace(/<p><\/p>/g, "");

  // Line breaks
  html = html.replace(/\n/g, "<br />");

  return html;
}
