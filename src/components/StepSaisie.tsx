"use client";

import { useState, useEffect, useRef } from "react";
import { ClipboardPaste, ArrowRight, FileText, Search, FileCheck, Zap, Loader2, Upload, X } from "lucide-react";

interface UploadedFile {
  name: string;
  content: string;
}

interface StepSaisieProps {
  aoText: string;
  setAoText: (text: string) => void;
  onAnalyser: () => void;
  exempleAO: string;
  isAnalysing?: boolean;
}

const analyseSteps = [
  { icon: Search, label: "Lecture du document..." },
  { icon: FileCheck, label: "Extraction des informations clés..." },
  { icon: Zap, label: "Analyse des exigences techniques..." },
  { icon: Loader2, label: "Préparation des recommandations..." },
];

export default function StepSaisie({ aoText, setAoText, onAnalyser, exempleAO, isAnalysing }: StepSaisieProps) {
  const [currentAnalyseStep, setCurrentAnalyseStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasFiles = uploadedFiles.length > 0;
  const hasText = aoText.length > 0;

  useEffect(() => {
    if (!isAnalysing) {
      setCurrentAnalyseStep(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentAnalyseStep((prev) => (prev < analyseSteps.length - 1 ? prev + 1 : prev));
    }, 500);
    return () => clearInterval(interval);
  }, [isAnalysing]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const newFiles: UploadedFile[] = [];
      for (const file of Array.from(files)) {
        const text = await file.text();
        newFiles.push({ name: file.name, content: text });
      }
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      if (aoText) setAoText("");
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier:", error);
      alert("Erreur lors de la lecture du fichier. Veuillez réessayer.");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isAnalysing) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-surface rounded-2xl p-10 shadow-lg border border-border max-w-md w-full text-center space-y-8">
          {/* Spinner */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground">Analyse en cours</h2>
            <p className="text-sm text-muted mt-1">Extraction des données de l&apos;appel d&apos;offres</p>
          </div>

          {/* Étapes animées */}
          <div className="space-y-3 text-left">
            {analyseSteps.map((s, i) => {
              const Icon = s.icon;
              const isDone = i < currentAnalyseStep;
              const isCurrent = i === currentAnalyseStep;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                    isCurrent
                      ? "bg-primary/10 text-primary"
                      : isDone
                      ? "bg-primary/5 text-primary/70"
                      : "text-muted/40"
                  }`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center shrink-0 ${isCurrent ? "animate-pulse" : ""}`}>
                    {isDone ? (
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Icon className={`w-4 h-4 ${isCurrent && Icon === Loader2 ? "animate-spin" : ""}`} />
                    )}
                  </div>
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentAnalyseStep + 1) / analyseSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClipboardPaste className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Importer l&apos;appel d&apos;offres</h2>
              <p className="text-sm text-muted">Copiez-collez le texte ou importez un fichier (TXT, PDF, DOCX)</p>
            </div>
          </div>
          
          {/* Upload button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            <button
              onClick={handleUploadClick}
              disabled={hasText}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                hasText
                  ? "text-muted/40 bg-surface-alt border-border cursor-not-allowed"
                  : "text-primary bg-primary/5 hover:bg-primary/10 border-primary/20"
              }`}
            >
              <Upload className="w-4 h-4" />
              Importer les documents (RC, CCTP, CCAP, Annexes...)
            </button>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mb-3 space-y-2">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{file.name}</span>
                  <span className="text-muted text-xs">({file.content.length} car.)</span>
                </div>
                <button
                  onClick={() => handleRemoveFile(i)}
                  className="p-1 text-muted hover:text-accent hover:bg-accent/10 rounded transition-colors"
                  title="Supprimer ce document"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={aoText}
          onChange={(e) => {
            setAoText(e.target.value);
            if (uploadedFiles.length > 0) setUploadedFiles([]);
          }}
          disabled={hasFiles}
          placeholder={hasFiles
            ? "Documents importés ci-dessus. Supprimez-les pour saisir du texte manuellement."
            : "Collez ici le texte de l'appel d'offres (avis de marché, CCTP, règlement de consultation...)\n\nOu cliquez sur 'Importer un fichier' pour charger un document.\n\nL'outil analysera automatiquement les informations clés : objet du marché, critères d'attribution, documents exigés, délais, etc."}
          className={`w-full h-80 p-4 border border-border rounded-lg text-sm leading-relaxed resize-y font-mono ${
            hasFiles ? "bg-surface-dim text-muted cursor-not-allowed" : "bg-surface-alt"
          }`}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-muted">
            {hasFiles ? (
              <span>{uploadedFiles.length} document{uploadedFiles.length > 1 ? "s" : ""} importé{uploadedFiles.length > 1 ? "s" : ""} • {uploadedFiles.reduce((sum, f) => sum + f.content.length, 0)} caractères au total</span>
            ) : aoText.length > 0 ? (
              <span>{aoText.length} caractères • {aoText.split(/\s+/).filter(Boolean).length} mots</span>
            ) : (
              <span>En attente du texte de l&apos;AO...</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setAoText(exempleAO); setUploadedFiles([]); }}
              disabled={hasFiles}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                hasFiles
                  ? "text-muted/40 bg-surface-alt border-border cursor-not-allowed"
                  : "text-primary bg-primary/5 hover:bg-primary/10 border-primary/20"
              }`}
            >
              <FileText className="w-4 h-4" />
              Charger un exemple
            </button>
            <button
              onClick={() => {
                if (hasFiles) {
                  const combined = uploadedFiles.map(f => `--- ${f.name} ---\n${f.content}`).join("\n\n");
                  setAoText(combined);
                }
                setTimeout(() => onAnalyser(), 50);
              }}
              disabled={!hasText && !hasFiles}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-md ${
                hasText || hasFiles
                  ? "bg-primary hover:bg-primary-dark"
                  : "bg-muted/30 cursor-not-allowed"
              }`}
            >
              Analyser l&apos;AO
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-accent mb-2">💡 Conseil</h3>
        <p className="text-sm text-muted leading-relaxed">
          Pour de meilleurs résultats, collez l&apos;intégralité de l&apos;avis de marché incluant : l&apos;objet, les critères d&apos;attribution et leur pondération, les documents exigés, les délais et le contact du pouvoir adjudicateur. Vous pouvez aussi coller le CCTP pour une analyse technique plus poussée.
        </p>
      </div>
    </div>
  );
}
