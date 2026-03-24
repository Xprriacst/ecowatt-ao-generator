"use client";

import { Settings, FileText } from "lucide-react";
import { ConfigEntreprise } from "@/lib/types";

interface HeaderProps {
  onConfigClick: () => void;
  config: ConfigEntreprise;
}

export default function Header({ onConfigClick, config }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white shadow-xl no-print relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-300 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <FileText className="w-7 h-7 text-primary-dark" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              {config.nom || "Générateur de Mémoires Techniques"}
            </h1>
            <p className="text-sm text-blue-100 font-medium">Réponses aux Appels d&apos;Offres</p>
          </div>
        </div>
        <button
          onClick={onConfigClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl transition-all text-sm font-semibold border border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl"
        >
          <Settings className="w-4 h-4" />
          Configuration
        </button>
      </div>
    </header>
  );
}
