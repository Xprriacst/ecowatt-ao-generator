"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Save, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AI_PROVIDERS, AIProviderType } from "@/lib/types";

interface ProviderConfig {
  enabled: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // State par provider
  const [configs, setConfigs] = useState<Record<string, { apiKey: string; enabled: boolean }>>({
    openrouter: { apiKey: "", enabled: true },
    groq: { apiKey: "", enabled: true },
    openai: { apiKey: "", enabled: true },
    anthropic: { apiKey: "", enabled: true },
  });

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // Vérifier admin + charger config au mount
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/admin/config");
        if (res.status === 403) {
          setIsAdmin(false);
          setError("Accès réservé aux administrateurs.");
        } else if (!res.ok) {
          throw new Error("Erreur lors du chargement de la config");
        } else {
          const data = await res.json();
          setIsAdmin(true);
          // Merger avec les configs existantes
          setConfigs((prev) => {
            const next = { ...prev };
            for (const [provider, cfg] of Object.entries(data) as [string, ProviderConfig][]) {
              if (next[provider]) {
                next[provider] = { ...next[provider], enabled: cfg.enabled };
              }
            }
            return next;
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const updateConfig = (provider: string, field: "apiKey" | "enabled", value: string | boolean) => {
    setConfigs((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], [field]: value },
    }));
  };

  const handleSave = async (provider: string) => {
    setSaving(provider);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: configs[provider].apiKey,
          enabled: configs[provider].enabled,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      setSuccess(`Configuration ${provider} sauvegardée !`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="text-[#444651]">Chargement...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-red-200 max-w-md w-full mx-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-[#00236f] mb-2">Accès refusé</h1>
          <p className="text-[#444651] mb-6">{error || "Vous n'avez pas les droits administrateur."}</p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00236f] text-white rounded-lg hover:bg-[#003399] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'app
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Header */}
      <header className="bg-white border-b border-[#c5c5d3]/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/app" className="text-[#444651] hover:text-[#00236f] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] rounded-lg flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-[#00236f]">Administration</h1>
              <p className="text-xs text-[#444651]">Configuration des clés API</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#c5c5d3]/20 overflow-hidden">
          <div className="p-6 border-b border-[#c5c5d3]/20 bg-[#f7f9fb]">
            <h2 className="font-semibold text-[#00236f]">Clés API des Providers IA</h2>
            <p className="text-sm text-[#444651] mt-1">
              Ces clés sont utilisées par tous les utilisateurs. Elles ne sont jamais exposées côté client.
            </p>
          </div>

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div className="divide-y divide-[#c5c5d3]/20">
            {(Object.entries(AI_PROVIDERS) as [AIProviderType, typeof AI_PROVIDERS[AIProviderType]][]).map(([key, provider]) => (
              <div key={key} className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-[#00236f]">{provider.label}</h3>
                    <p className="text-xs text-[#444651] mt-0.5">{provider.baseUrl}</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-[#444651]">Activé</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={configs[key]?.enabled}
                      onClick={() => updateConfig(key, "enabled", !configs[key]?.enabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        configs[key]?.enabled ? "bg-[#00236f]" : "bg-[#c5c5d3]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          configs[key]?.enabled ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </label>
                </div>

                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type={showKeys[key] ? "text" : "password"}
                      value={configs[key]?.apiKey || ""}
                      onChange={(e) => updateConfig(key, "apiKey", e.target.value)}
                      placeholder={`Clé API ${provider.label}`}
                      className="w-full px-3 py-2 pr-10 border border-[#c5c5d3] rounded-lg bg-white text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(key)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#444651] hover:text-[#00236f]"
                    >
                      {showKeys[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave(key)}
                    disabled={saving === key || !configs[key]?.apiKey}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00236f] text-white text-sm font-medium rounded-lg hover:bg-[#003399] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saving === key ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
