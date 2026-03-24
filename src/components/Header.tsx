"use client";

import { Settings, FileText } from "lucide-react";
import { ConfigEntreprise } from "@/lib/types";

interface HeaderProps {
  onConfigClick: () => void;
  config: ConfigEntreprise;
}

export default function Header({ onConfigClick, config }: HeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-50 no-print border-b border-border/20">
      <div className="flex justify-between items-center px-8 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-primary font-[var(--font-headline)] font-extrabold text-xl tracking-tight">
            {config.nom || "Générateur de Mémoires Techniques"}
          </h1>
        </div>
        <button
          onClick={onConfigClick}
          className="flex items-center gap-2 px-4 py-2 text-muted font-medium hover:bg-surface-alt transition-colors rounded-lg text-sm"
        >
          <Settings className="w-4 h-4" />
          Configuration
        </button>
      </div>
    </header>
  );
}
