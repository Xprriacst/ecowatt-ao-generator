"use client";

import { useState } from "react";
import { Step, AOData, AnalyseAO, SectionReponse, ConfigEntreprise, AnalysePlans, AIProvider, AI_PROVIDERS, ContexteAO } from "@/lib/types";
import { defaultConfig, exempleAO } from "@/lib/mock-data";
import Header from "@/components/Header";
import Stepper from "@/components/Stepper";
import StepSaisie from "@/components/StepSaisie";
import StepAnalyse from "@/components/StepAnalyse";
import StepPlans from "@/components/StepPlans";
import StepContexte from "@/components/StepContexte";
import StepReponse from "@/components/StepReponse";
import StepExport from "@/components/StepExport";
import StepApercu from "@/components/StepApercu";
import ConfigPanel from "@/components/ConfigPanel";

const DEFAULT_CONTEXTE: ContexteAO = {
  moyensTechniques: "",
  certificationsPertinentes: "",
  experiencesSimilaires: "",
  notesSpecifiques: "",
};

export default function Home() {
  const [step, setStep] = useState<Step>("saisie");
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ConfigEntreprise>(defaultConfig);
  const [aoText, setAoText] = useState("");
  const [aoData, setAoData] = useState<AOData | null>(null);
  const [analyse, setAnalyse] = useState<AnalyseAO | null>(null);
  const [sections, setSections] = useState<SectionReponse[]>([]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysePlans, setAnalysePlans] = useState<AnalysePlans>({ rapportMarkdown: "", status: "idle" });
  const [contexteAO, setContexteAO] = useState<ContexteAO>(DEFAULT_CONTEXTE);
  const [aiProvider, setAiProvider] = useState<AIProvider>({
    type: 'openrouter',
    model: AI_PROVIDERS.openrouter.defaultModel,
  });

  const handleAnalyser = async () => {
    const textToUse = aoText || exempleAO;
    if (!aoText) setAoText(exempleAO);
    setIsAnalysing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyse-ao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aoText: textToUse, aiProvider }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur lors de l'analyse");
      }

      const result = await response.json();

      const data: AOData = {
        rawText: textToUse,
        reference: result.reference,
        objet: result.objet,
        acheteur: result.acheteur,
        dateLimite: result.dateLimite,
        montantEstime: result.montantEstime,
        lieu: result.lieu,
        lots: result.lots,
        criteresAttribution: result.criteresAttribution,
        documentsExiges: result.documentsExiges,
        contactDestinataire: result.contactDestinataire,
        emailDestinataire: result.emailDestinataire,
      };
      setAoData(data);

      const analyse: AnalyseAO = {
        pointsCles: result.analyse?.pointsCles || [],
        exigencesTechniques: result.analyse?.exigencesTechniques || [],
        delais: result.analyse?.delais || "Non précisé",
        risques: result.analyse?.risques || [],
        recommandations: result.analyse?.recommandations || [],
      };
      setAnalyse(analyse);
      setStep("analyse");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      console.error("Erreur analyse AO:", err);
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleGenererReponse = async () => {
    if (!aoData) return;
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generer-memoire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aoText: aoData.rawText,
          aoData,
          config,
          contexteAO,
          aiProvider,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur lors de la génération");
      }

      const result = await response.json();
      setSections(result.sections);
      setStep("reponse");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      console.error("Erreur génération mémoire:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApercu = () => {
    setStep("apercu");
  };

  const handleExport = () => {
    setStep("export");
  };

  const handleReset = () => {
    setStep("saisie");
    setAoText("");
    setAoData(null);
    setAnalyse(null);
    setSections([]);
    setAnalysePlans({ rapportMarkdown: "", status: "idle" });
    setContexteAO(DEFAULT_CONTEXTE);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header onConfigClick={() => setShowConfig(!showConfig)} config={config} />

      {showConfig ? (
        <ConfigPanel config={config} setConfig={setConfig} aiProvider={aiProvider} setAiProvider={setAiProvider} onClose={() => setShowConfig(false)} />
      ) : (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 overflow-y-auto">
          <Stepper currentStep={step} onStepClick={setStep} canNavigate={{
            saisie: true,
            analyse: !!aoData,
            plans: !!aoData,
            contexte: !!aoData,
            reponse: sections.length > 0,
            apercu: sections.length > 0,
            export: sections.length > 0,
          }} />

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <strong>Erreur :</strong> {error}
              <button onClick={() => setError(null)} className="ml-4 underline text-red-500">Fermer</button>
            </div>
          )}

          <div className="mt-8 fade-in">
            {step === "saisie" && (
              <StepSaisie
                aoText={aoText}
                setAoText={setAoText}
                onAnalyser={handleAnalyser}
                exempleAO={exempleAO}
                isAnalysing={isAnalysing}
              />
            )}
            {step === "analyse" && analyse && aoData && (
              <StepAnalyse
                aoData={aoData}
                analyse={analyse}
                onGenerer={() => setStep("plans")}
                onRetour={() => setStep("saisie")}
              />
            )}
            {step === "plans" && (
              <StepPlans
                analysePlans={analysePlans}
                setAnalysePlans={setAnalysePlans}
                onGenerer={() => setStep("contexte")}
                onRetour={() => setStep("analyse")}
                isGenerating={isGenerating}
              />
            )}
            {step === "contexte" && aoData && (
              <StepContexte
                contexteAO={contexteAO}
                setContexteAO={setContexteAO}
                config={config}
                onSuivant={handleGenererReponse}
                onRetour={() => setStep("plans")}
              />
            )}
            {step === "reponse" && (
              <StepReponse
                sections={sections}
                setSections={setSections}
                onApercu={handleApercu}
                onRetour={() => setStep("contexte")}
              />
            )}
            {step === "apercu" && aoData && (
              <StepApercu
                sections={sections.filter(s => s.included)}
                aoData={aoData}
                config={config}
                onExport={handleExport}
                onRetour={() => setStep("reponse")}
              />
            )}
            {step === "export" && aoData && (
              <StepExport
                sections={sections.filter(s => s.included)}
                aoData={aoData}
                config={config}
                onReset={handleReset}
                onRetour={() => setStep("apercu")}
              />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
