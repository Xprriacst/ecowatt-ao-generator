"use client";

import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { SectionReponse, AOData, ConfigEntreprise } from "@/lib/types";

interface StepApercuProps {
  sections: SectionReponse[];
  aoData: AOData;
  config: ConfigEntreprise;
  onExport: () => void;
  onRetour: () => void;
}

export default function StepApercu({ sections, aoData, config, onExport, onRetour }: StepApercuProps) {
  const includedSections = sections.filter(s => s.included);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-lg font-semibold">Aperçu du rapport</h2>
          <p className="text-sm text-muted">
            Visualisation du dossier mis en forme — {includedSections.length} sections
          </p>
        </div>
      </div>

      {/* Document mis en forme */}
      <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
        {/* En-tête du document */}
        <div className="bg-primary px-10 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{config.nom}</h1>
                <p className="text-sm text-white/70 mt-0.5">{config.codeAPE}</p>
                <p className="text-sm text-white/70">{config.adresse} • {config.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bandeau titre */}
        <div className="bg-primary-dark px-10 py-5 text-white">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Dossier de réponse à l&apos;appel d&apos;offres</p>
          <h2 className="text-lg font-bold leading-snug">
            {aoData.objet || '[Objet du marché]'}
          </h2>
          <div className="flex gap-6 mt-3 text-sm text-white/70">
            {aoData.reference && <span>Réf. : <strong className="text-white">{aoData.reference}</strong></span>}
            {aoData.acheteur && <span>Acheteur : <strong className="text-white">{aoData.acheteur}</strong></span>}
            {aoData.dateLimite && <span>Date limite : <strong className="text-white">{aoData.dateLimite}</strong></span>}
          </div>
        </div>

        {/* Table des matières */}
        <div className="px-10 py-8 border-b border-border bg-surface-alt">
          <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-4">Sommaire</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {includedSections.map((section, i) => (
              <a
                key={section.id}
                href={`#section-${section.id}`}
                className="flex items-center gap-3 text-sm py-1.5 hover:text-primary transition-colors group"
              >
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                  {i + 1}
                </span>
                <span className="text-foreground/80 group-hover:text-primary">{section.titre}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Sections du document */}
        <div className="px-10 py-8 space-y-10">
          {includedSections.map((section, index) => (
            <div key={section.id} id={`section-${section.id}`} className="scroll-mt-4">
              {/* Séparateur entre sections (sauf la première) */}
              {index > 0 && (
                <div className="border-t border-border mb-8" />
              )}

              {/* Titre de section */}
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold shrink-0">
                  {index + 1}
                </span>
                <h2 className="text-lg font-bold text-primary">
                  {section.titre}
                </h2>
              </div>

              {/* Contenu de section avec mise en forme */}
              <div className="text-sm leading-7 text-foreground/85 whitespace-pre-wrap pl-11">
                {section.contenu.split('\n').map((line, lineIdx) => {
                  const trimmed = line.trim();

                  // Sous-titres (ex: "3.1 Contexte", "Phase 1 —")
                  if (/^\d+\.\d+\s/.test(trimmed) || /^Phase\s\d/i.test(trimmed)) {
                    return (
                      <p key={lineIdx} className="font-semibold text-foreground mt-5 mb-2 text-[0.9rem]">
                        {trimmed}
                      </p>
                    );
                  }

                  // Sous-sous-titres (ex: "Outillage électrique :", "Enjeux de sécurité :")
                  if (/^[A-ZÉÈÊÀÂÔÎÏÙÛÜ]/.test(trimmed) && trimmed.endsWith(':') && trimmed.length < 80) {
                    return (
                      <p key={lineIdx} className="font-semibold text-foreground/90 mt-4 mb-1.5">
                        {trimmed}
                      </p>
                    );
                  }

                  // Bullet points
                  if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                    const isSubBullet = line.startsWith('  ') && (trimmed.startsWith('-') || trimmed.startsWith('•'));
                    return (
                      <div key={lineIdx} className={`flex items-start gap-2 ${isSubBullet ? 'ml-5' : ''} my-0.5`}>
                        <span className={`mt-2 shrink-0 rounded-full ${isSubBullet ? 'w-1 h-1 bg-muted' : 'w-1.5 h-1.5 bg-primary'}`} />
                        <span>{trimmed.replace(/^[•\-]\s*/, '')}</span>
                      </div>
                    );
                  }

                  // Lignes vides
                  if (trimmed === '') {
                    return <div key={lineIdx} className="h-2" />;
                  }

                  // Texte normal
                  return <p key={lineIdx} className="my-0.5">{trimmed}</p>;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pied de page */}
        <div className="bg-surface-alt border-t border-border px-10 py-6">
          <div className="flex items-center justify-between text-xs text-muted">
            <div>
              <span className="font-semibold text-primary">{config.nom}</span> — Dossier de réponse AO {aoData.reference || ''}
            </div>
            <div>
              Document généré le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between no-print">
        <button
          onClick={onRetour}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;édition
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md"
        >
          Exporter & Envoyer
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
