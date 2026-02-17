"use client";

import { Settings, Zap } from "lucide-react";

interface HeaderProps {
  onConfigClick: () => void;
}

export default function Header({ onConfigClick }: HeaderProps) {
  return (
    <header className="bg-primary text-white shadow-lg no-print">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">EcoWatts Centre</h1>
            <p className="text-xs text-white/70">Générateur de Réponses AO</p>
          </div>
        </div>
        <button
          onClick={onConfigClick}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
        >
          <Settings className="w-4 h-4" />
          Paramétrage
        </button>
      </div>
    </header>
  );
}
