"use client";

import { X, Building2, Shield, Award, MapPin, Users, Plus, Trash2 } from "lucide-react";
import { ConfigEntreprise } from "@/lib/types";

interface ConfigPanelProps {
  config: ConfigEntreprise;
  setConfig: (config: ConfigEntreprise) => void;
  onClose: () => void;
}

export default function ConfigPanel({ config, setConfig, onClose }: ConfigPanelProps) {
  const updateField = (field: keyof ConfigEntreprise, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const updateArrayField = (field: keyof ConfigEntreprise, index: number, value: string) => {
    const arr = [...(config[field] as string[])];
    arr[index] = value;
    setConfig({ ...config, [field]: arr });
  };

  const addToArray = (field: keyof ConfigEntreprise) => {
    const arr = [...(config[field] as string[]), ""];
    setConfig({ ...config, [field]: arr });
  };

  const removeFromArray = (field: keyof ConfigEntreprise, index: number) => {
    const arr = (config[field] as string[]).filter((_, i) => i !== index);
    setConfig({ ...config, [field]: arr });
  };

  const addReference = () => {
    setConfig({
      ...config,
      references: [...config.references, { client: "", projet: "", montant: "", annee: "" }],
    });
  };

  const updateReference = (index: number, field: string, value: string) => {
    const refs = [...config.references];
    refs[index] = { ...refs[index], [field]: value };
    setConfig({ ...config, references: refs });
  };

  const removeReference = (index: number) => {
    setConfig({ ...config, references: config.references.filter((_, i) => i !== index) });
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Paramétrage de l&apos;entreprise</h2>
          <p className="text-sm text-muted">Ces informations seront utilisées pour pré-remplir vos réponses aux AO</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
        >
          <X className="w-4 h-4" />
          Fermer
        </button>
      </div>

      <div className="space-y-6">
        {/* Identité */}
        <section className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Identité de l&apos;entreprise</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Raison sociale", field: "nom" as const, value: config.nom },
              { label: "Adresse", field: "adresse" as const, value: config.adresse },
              { label: "Téléphone", field: "telephone" as const, value: config.telephone },
              { label: "Email", field: "email" as const, value: config.email },
              { label: "SIRET", field: "siret" as const, value: config.siret },
              { label: "Code APE", field: "codeAPE" as const, value: config.codeAPE },
              { label: "Effectif", field: "effectif" as const, value: config.effectif },
              { label: "Chiffre d'affaires", field: "chiffreAffaires" as const, value: config.chiffreAffaires },
            ].map((item) => (
              <div key={item.field}>
                <label className="text-xs font-medium text-muted uppercase tracking-wide">{item.label}</label>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateField(item.field, e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm"
                  placeholder={`Saisir ${item.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Zone géographique */}
        <section className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Zone d&apos;intervention</h3>
          </div>
          <input
            type="text"
            value={config.zoneGeographique}
            onChange={(e) => updateField("zoneGeographique", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm"
          />
        </section>

        {/* Domaines d'intervention */}
        <section className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Domaines d&apos;intervention</h3>
            </div>
            <button
              onClick={() => addToArray("domainesIntervention")}
              className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {config.domainesIntervention.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={d}
                  onChange={(e) => updateArrayField("domainesIntervention", i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm"
                />
                <button onClick={() => removeFromArray("domainesIntervention", i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Certifications & Qualifications</h3>
            </div>
            <button
              onClick={() => addToArray("certifications")}
              className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {config.certifications.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={c}
                  onChange={(e) => updateArrayField("certifications", i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm"
                />
                <button onClick={() => removeFromArray("certifications", i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Assurances */}
        <section className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Assurances</h3>
            </div>
            <button
              onClick={() => addToArray("assurances")}
              className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {config.assurances.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={a}
                  onChange={(e) => updateArrayField("assurances", i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface-alt text-sm"
                />
                <button onClick={() => removeFromArray("assurances", i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Valeurs */}
        <section className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Valeurs de l&apos;entreprise</h3>
            <button
              onClick={() => addToArray("valeurs")}
              className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.valeurs.map((v, i) => (
              <div key={i} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm">
                <input
                  type="text"
                  value={v}
                  onChange={(e) => updateArrayField("valeurs", i, e.target.value)}
                  className="bg-transparent border-none text-sm w-24 text-center"
                />
                <button onClick={() => removeFromArray("valeurs", i)} className="text-primary/50 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Références */}
        <section className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Références clients</h3>
            <button
              onClick={addReference}
              className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter une référence
            </button>
          </div>
          <div className="space-y-3">
            {config.references.map((ref, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center bg-surface-alt rounded-lg p-3">
                <input
                  type="text"
                  value={ref.client}
                  onChange={(e) => updateReference(i, "client", e.target.value)}
                  placeholder="Client"
                  className="px-2 py-1.5 border border-border rounded text-sm bg-surface"
                />
                <input
                  type="text"
                  value={ref.projet}
                  onChange={(e) => updateReference(i, "projet", e.target.value)}
                  placeholder="Projet"
                  className="px-2 py-1.5 border border-border rounded text-sm bg-surface"
                />
                <input
                  type="text"
                  value={ref.montant}
                  onChange={(e) => updateReference(i, "montant", e.target.value)}
                  placeholder="Montant"
                  className="px-2 py-1.5 border border-border rounded text-sm bg-surface"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ref.annee}
                    onChange={(e) => updateReference(i, "annee", e.target.value)}
                    placeholder="Année"
                    className="flex-1 px-2 py-1.5 border border-border rounded text-sm bg-surface"
                  />
                  <button onClick={() => removeReference(i)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md"
        >
          Enregistrer et fermer
        </button>
      </div>
    </main>
  );
}
