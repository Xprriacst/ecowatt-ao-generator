"use client";

import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, Lightbulb, Target, Clock } from "lucide-react";
import { AOData, AnalyseAO } from "@/lib/types";

interface StepAnalyseProps {
  aoData: AOData;
  analyse: AnalyseAO;
  onGenerer: () => void;
  onRetour: () => void;
}

export default function StepAnalyse({ aoData, analyse, onGenerer, onRetour }: StepAnalyseProps) {
  return (
    <div className="space-y-6">
      {/* Recap AO */}
      <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Récapitulatif de l&apos;appel d&apos;offres</h2>
            <p className="text-sm text-muted">Informations clés extraites automatiquement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Référence", value: aoData.reference },
            { label: "Objet", value: aoData.objet },
            { label: "Acheteur", value: aoData.acheteur },
            { label: "Montant estimé", value: aoData.montantEstime },
            { label: "Date limite", value: aoData.dateLimite },
            { label: "Lieu d'exécution", value: aoData.lieu },
          ].map((item) => (
            <div key={item.label} className="bg-surface-alt rounded-lg p-3">
              <p className="text-xs font-medium text-muted uppercase tracking-wide">{item.label}</p>
              <p className="text-sm font-semibold mt-1">{item.value || "Non détecté"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Points clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exigences techniques */}
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Exigences techniques</h3>
          </div>
          <ul className="space-y-2">
            {analyse.exigencesTechniques.map((ex, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {ex}
              </li>
            ))}
          </ul>
        </div>

        {/* Risques identifiés */}
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold">Risques identifiés</h3>
          </div>
          <ul className="space-y-2">
            {analyse.risques.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Délai */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center gap-4">
        <Clock className="w-6 h-6 text-blue-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Délai d&apos;exécution</p>
          <p className="text-sm text-blue-700">{analyse.delais}</p>
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-primary">Recommandations pour la réponse</h3>
        </div>
        <ul className="space-y-2">
          {analyse.recommandations.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary font-bold">→</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={onRetour}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          Modifier l&apos;AO
        </button>
        <button
          onClick={onGenerer}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md"
        >
          Générer la réponse
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
