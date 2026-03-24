"use client";

import { Step } from "@/lib/types";

const steps: { key: Step; label: string }[] = [
  { key: "saisie", label: "Saisie AO" },
  { key: "analyse", label: "Analyse" },
  { key: "plans", label: "Plans" },
  { key: "reponse", label: "Réponse" },
  { key: "apercu", label: "Aperçu" },
  { key: "export", label: "Export" },
];

interface StepperProps {
  currentStep: Step;
  onStepClick: (step: Step) => void;
  canNavigate: Record<Step, boolean>;
}

export default function Stepper({ currentStep, onStepClick, canNavigate }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <nav className="mb-8">
      <div className="flex items-end gap-3">
        {steps.map((s, i) => {
          const isActive = s.key === currentStep;
          const isDone = i < currentIndex;
          const canClick = canNavigate[s.key];
          const num = String(i + 1).padStart(2, "0");

          return (
            <button
              key={s.key}
              onClick={() => canClick && onStepClick(s.key)}
              disabled={!canClick}
              className="flex-1 group"
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span className={`font-[var(--font-body)] text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? "font-bold text-primary"
                    : isDone
                    ? "font-semibold text-primary/70"
                    : canClick
                    ? "font-medium text-muted/60 group-hover:text-muted"
                    : "font-medium text-muted/30"
                }`}>
                  {num}. {s.label}
                </span>
              </div>
              <div className={`rounded-full transition-all ${
                isActive
                  ? "h-1.5 bg-gradient-to-r from-primary to-primary-light"
                  : isDone
                  ? "h-1.5 bg-primary/40"
                  : "h-1 bg-surface-dim"
              }`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
