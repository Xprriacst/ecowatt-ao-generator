"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Lightbulb, Save, Copy, Loader2 } from "lucide-react";
import { ContexteAO, ConfigEntreprise } from "@/lib/types";

const DEFAULT_CONtexte: ContexteAO = {
  moyensTechniques: "",
  certificationsPertinentes: "",
  experiencesSimilaires: "",
  notesSpecifiques: "",
};

const STORAGE_KEY = "ecowatt_contexte_ao";

interface StepContexteProps {
  contexteAO: ContexteAO;
  setContexteAO: (c: ContexteAO) => void;
  onSuivant: () => void;
  onRetour: () => void;
  config?: ConfigEntreprise;
}

export default function StepContexte({ contexteAO, setContexteAO, onSuivant, onRetour, config }: StepContexteProps) {
  const [loading, setLoading] = useState(false);
  const [fromConfig, setFromConfig] = useState(false);

  // Auto-fill depuis localStorage au premier chargement
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && !contexteAO.moyensTechniques) {
      try {
        const parsed = JSON.parse(saved) as ContexteAO;
        setContexteAO(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  // Auto-fill depuis la config entreprise (ConfigPanel)
  const autoFillFromConfig = () => {
    if (!config) return;
    setFromConfig(true);
    setContexteAO({
      moyensTechniques: [
        config.nom,
        config.domainesIntervention.join(", "),
        config.zoneGeographique ? `Zone: ${config.zoneGeographique}` : "",
        config.effectif ? `Effectif: ${config.effectif}` : "",
        config.certifications.length > 0 ? `Certifications: ${config.certifications.join(", ")}` : "",
      ].filter(Boolean).join("\n"),
      certificationsPertinentes: config.certifications.join("\n"),
      experiencesSimilaires: config.references
        .map(r => `${r.client} — ${r.projet} (${r.annee}) — Montant: ${r.montant}`)
        .join("\n"),
      notesSpecifiques: [
        config.valeurs.length > 0 ? `Valeurs: ${config.valeurs.join(", ")}` : "",
        config.assurances.length > 0 ? `Assurances: ${config.assurances.join(", ")}` : "",
      ].filter(Boolean).join("\n"),
    });
    setTimeout(() => setFromConfig(false), 1000);
  };

  const handleChange = (field: keyof ContexteAO, value: string) => {
    setContexteAO({ ...contexteAO, [field]: value });
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contexteAO));
  };

  const handleSuivant = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contexteAO));
    onSuivant();
  };

  const isValid = contexteAO.moyensTechniques.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Contexte entreprise pour cette réponse</h2>
          <p className="text-sm text-muted">
            Précisez les éléments qui permettront de personnaliser le mémoire technique pour cet AO
          </p>
        </div>
        {config && (
          <button
            type="button"
            onClick={autoFillFromConfig}
            disabled={fromConfig}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
          >
            {fromConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            Auto-remplir depuis ma config
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moyens techniques */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Moyens techniques mobilisés <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-muted mb-2">
            Équipements, ressources humaines, approche méthodologique pour cet AO
          </p>
          <textarea
            value={contexteAO.moyensTechniques}
            onChange={(e) => handleChange("moyensTechniques", e.target.value)}
            placeholder="Ex: Équipe de 5 techniciens certifiés, matériel de mesure Calibré, flota de 3 véhicules..."
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm resize-y"
          />
        </div>

        {/* Certifications pertinentes */}
        <div>
          <label className="block text-sm font-medium mb-2">Certifications pertinentes</label>
          <p className="text-xs text-muted mb-2">
            Certifications nécessaires ou valorisantes pour cet AO
          </p>
          <textarea
            value={contexteAO.certificationsPertinentes}
            onChange={(e) => handleChange("certificationsPertinentes", e.target.value)}
            placeholder="Ex: Qualibat 5311, IRVE, Habilitation électrique..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm resize-y"
          />
        </div>

        {/* Expériences similaires */}
        <div>
          <label className="block text-sm font-medium mb-2">Expériences similaires <span className="text-xs text-muted font-normal">(optionnel)</span></label>
          <p className="text-xs text-muted mb-2">
            Références d&apos;AO similaires déjà traités avec succès
          </p>
          <textarea
            value={contexteAO.experiencesSimilaires}
            onChange={(e) => handleChange("experiencesSimilaires", e.target.value)}
            placeholder="Ex: Lycée Louis Pasteur — Rénovation électrique (2024) — 120k€"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm resize-y"
          />
        </div>

        {/* Notes spécifiques */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-2">Notes spécifiques à cet AO <span className="text-xs text-muted font-normal">(optionnel)</span></label>
          <p className="text-xs text-muted mb-2">
            Points importants, contraintes particulières, éléments de différenciation
          </p>
          <textarea
            value={contexteAO.notesSpecifiques}
            onChange={(e) => handleChange("notesSpecifiques", e.target.value)}
            placeholder="Ex: Démarche qualité ISO 9001 en cours, engagement RSE, délai serré accepté..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm resize-y"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
        >
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRetour}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <button
            type="button"
            onClick={handleSuivant}
            disabled={!isValid}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isValid && (
        <p className="text-xs text-amber-600 text-center">
          ⚠️ Les moyens techniques sont requis pour générer la réponse
        </p>
      )}
    </div>
  );
}
