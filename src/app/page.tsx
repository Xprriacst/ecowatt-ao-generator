"use client";

import { useState } from "react";
import { Step, AOData, AnalyseAO, SectionReponse, ConfigEntreprise } from "@/lib/types";
import { defaultConfig, exempleAO, extraireInfosAO, analyserAO, genererReponse } from "@/lib/mock-data";
import Header from "@/components/Header";
import Stepper from "@/components/Stepper";
import StepSaisie from "@/components/StepSaisie";
import StepAnalyse from "@/components/StepAnalyse";
import StepReponse from "@/components/StepReponse";
import StepExport from "@/components/StepExport";
import StepApercu from "@/components/StepApercu";
import ConfigPanel from "@/components/ConfigPanel";

export default function Home() {
  const [step, setStep] = useState<Step>("saisie");
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ConfigEntreprise>(defaultConfig);
  const [aoText, setAoText] = useState("");
  const [aoData, setAoData] = useState<AOData | null>(null);
  const [analyse, setAnalyse] = useState<AnalyseAO | null>(null);
  const [sections, setSections] = useState<SectionReponse[]>([]);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const handleAnalyser = () => {
    const textToUse = aoText || exempleAO;
    if (!aoText) setAoText(exempleAO);
    setIsAnalysing(true);
    setTimeout(() => {
      const data = extraireInfosAO(textToUse);
      setAoData(data);
      const result = analyserAO(data);
      setAnalyse(result);
      setIsAnalysing(false);
      setStep("analyse");
    }, 2200);
  };

  const handleGenererReponse = () => {
    if (!aoData) return;
    const rep = genererReponse(aoData, config);
    setSections(rep);
    setStep("reponse");
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onConfigClick={() => setShowConfig(!showConfig)} />

      {showConfig ? (
        <ConfigPanel config={config} setConfig={setConfig} onClose={() => setShowConfig(false)} />
      ) : (
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          <Stepper currentStep={step} onStepClick={setStep} canNavigate={{
            saisie: true,
            analyse: !!aoData,
            reponse: sections.length > 0,
            apercu: sections.length > 0,
            export: sections.length > 0,
          }} />

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
                onGenerer={handleGenererReponse}
                onRetour={() => setStep("saisie")}
              />
            )}
            {step === "reponse" && (
              <StepReponse
                sections={sections}
                setSections={setSections}
                onApercu={handleApercu}
                onRetour={() => setStep("analyse")}
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
