"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Edit3, ToggleLeft, ToggleRight, GripVertical } from "lucide-react";
import { SectionReponse } from "@/lib/types";

interface StepReponseProps {
  sections: SectionReponse[];
  setSections: (sections: SectionReponse[]) => void;
  onApercu: () => void;
  onRetour: () => void;
}

export default function StepReponse({ sections, setSections, onApercu, onRetour }: StepReponseProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleInclude = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, included: !s.included } : s));
  };

  const updateContenu = (id: string, contenu: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, contenu } : s));
  };

  const includedCount = sections.filter(s => s.included).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Réponse générée</h2>
          <p className="text-sm text-muted">{includedCount}/{sections.length} sections incluses — Cliquez sur &quot;Modifier&quot; pour éditer une section</p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`bg-surface rounded-xl shadow-sm border transition-all editor-section ${
              section.included ? "border-border" : "border-border opacity-50"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted/40" />
                <h3 className="font-semibold text-sm">{section.titre}</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingId(editingId === section.id ? null : section.id)}
                  className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {editingId === section.id ? "Fermer" : "Modifier"}
                </button>
                <button
                  onClick={() => toggleInclude(section.id)}
                  className="flex items-center gap-1 text-xs font-medium"
                >
                  {section.included ? (
                    <ToggleRight className="w-5 h-5 text-primary" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-muted" />
                  )}
                  <span className={section.included ? "text-primary" : "text-muted"}>
                    {section.included ? "Inclus" : "Exclu"}
                  </span>
                </button>
              </div>
            </div>

            {editingId === section.id ? (
              <div className="p-4">
                <textarea
                  value={section.contenu}
                  onChange={(e) => updateContenu(section.id, e.target.value)}
                  className="w-full min-h-[400px] p-4 border border-border rounded-lg bg-surface-alt text-sm leading-relaxed resize-y font-mono"
                />
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {section.contenu}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onRetour}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;analyse
        </button>
        <button
          onClick={onApercu}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md"
        >
          Aperçu du rapport
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
