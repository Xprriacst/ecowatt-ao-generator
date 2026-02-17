"use client";

import { ClipboardPaste, Search, FileText, Eye, Send } from "lucide-react";
import { Step } from "@/lib/types";

const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "saisie", label: "Saisie AO", icon: <ClipboardPaste className="w-5 h-5" /> },
  { key: "analyse", label: "Analyse", icon: <Search className="w-5 h-5" /> },
  { key: "reponse", label: "Réponse", icon: <FileText className="w-5 h-5" /> },
  { key: "apercu", label: "Aperçu", icon: <Eye className="w-5 h-5" /> },
  { key: "export", label: "Export & Envoi", icon: <Send className="w-5 h-5" /> },
];

interface StepperProps {
  currentStep: Step;
  onStepClick: (step: Step) => void;
  canNavigate: Record<Step, boolean>;
}

export default function Stepper({ currentStep, onStepClick, canNavigate }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-between bg-surface rounded-xl p-4 shadow-sm border border-border">
      {steps.map((s, i) => {
        const isActive = s.key === currentStep;
        const isDone = i < currentIndex;
        const canClick = canNavigate[s.key];

        return (
          <div key={s.key} className="flex items-center flex-1">
            <button
              onClick={() => canClick && onStepClick(s.key)}
              disabled={!canClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium step-indicator ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : isDone
                  ? "bg-primary-light/10 text-primary cursor-pointer hover:bg-primary-light/20"
                  : canClick
                  ? "text-muted hover:bg-surface-alt cursor-pointer"
                  : "text-muted/40 cursor-not-allowed"
              }`}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                isActive ? "bg-white/20" : isDone ? "bg-primary/10" : "bg-surface-alt"
              }`}>
                {s.icon}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded ${
                i < currentIndex ? "bg-primary-light" : "bg-border"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
