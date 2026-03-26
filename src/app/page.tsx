import Link from "next/link";
import {
  FileText,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Check,
  Sparkles,
  Upload,
  Brain,
  Download,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Analyse IA avancée",
    desc: "Extraction automatique des exigences, risques et critères d'attribution de l'appel d'offres.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Multi-provider IA",
    desc: "Choisissez entre OpenRouter, Groq, OpenAI ou Anthropic selon vos besoins.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Mémoire technique complet",
    desc: "Génération de 10+ sections : candidature, méthodologie, moyens, planning, etc.",
  },
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Import multi-format",
    desc: "Importez vos documents AO en TXT, PDF ou DOCX. Collez directement le texte.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Personnalisation entreprise",
    desc: "Vos certifications, références et valeurs intégrées automatiquement dans chaque réponse.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Export & envoi",
    desc: "Aperçu professionnel, export PDF et envoi par email en un clic.",
  },
];

const steps = [
  {
    num: "01",
    title: "Importez l'AO",
    desc: "Collez le texte ou importez les documents de l'appel d'offres.",
  },
  {
    num: "02",
    title: "Analyse IA",
    desc: "L'IA extrait les informations clés et identifie les exigences techniques.",
  },
  {
    num: "03",
    title: "Mémoire généré",
    desc: "Un mémoire technique complet est généré, prêt à personnaliser et exporter.",
  },
];

const faqs = [
  {
    q: "Quels types d'appels d'offres sont supportés ?",
    a: "Tous les marchés publics de travaux, principalement dans le BTP, l'électricité, le CVC et le génie civil. L'outil s'adapte à tout CCTP.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui. Vos documents et clés API ne sont jamais stockés sur nos serveurs. Le traitement se fait en temps réel via l'API IA de votre choix.",
  },
  {
    q: "Puis-je modifier le mémoire généré ?",
    a: "Absolument. Chaque section est éditable. Vous pouvez inclure/exclure des sections et personnaliser le contenu avant l'export.",
  },
  {
    q: "Quelle est la différence entre les providers IA ?",
    a: "OpenRouter donne accès à tous les modèles. Groq est le plus rapide et gratuit. OpenAI et Anthropic offrent des modèles premium.",
  },
  {
    q: "Puis-je résilier à tout moment ?",
    a: "Oui, sans engagement. Vous pouvez résilier votre abonnement Pro à tout moment depuis votre espace facturation.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#c5c5d3]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] rounded-lg flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-[var(--font-headline)] font-extrabold text-lg text-[#00236f]">
              MémoireAO
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#444651]">
            <a href="#fonctionnalites" className="hover:text-[#00236f] transition-colors">Fonctionnalités</a>
            <a href="#comment-ca-marche" className="hover:text-[#00236f] transition-colors">Comment ça marche</a>
            <a href="#tarifs" className="hover:text-[#00236f] transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-[#00236f] transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm font-medium text-[#444651] hover:text-[#00236f] transition-colors px-4 py-2">
              Connexion
            </Link>
            <Link
              href="/app"
              className="bg-gradient-to-r from-[#00236f] to-[#1e3a8a] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-[#00236f]/20 hover:opacity-90 transition-opacity"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00236f]/5 via-transparent to-[#1e3a8a]/5" />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d0d8ff]/40 rounded-full text-[#00236f] text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4" />
              Propulsé par l&apos;IA générative
            </div>
            <h1 className="font-[var(--font-headline)] text-5xl md:text-6xl font-extrabold text-[#00236f] leading-tight mb-6">
              Générez vos mémoires techniques
              <span className="bg-gradient-to-r from-[#00236f] to-[#4059aa] bg-clip-text text-transparent"> en quelques minutes</span>
            </h1>
            <p className="text-lg text-[#444651] leading-relaxed mb-10 max-w-2xl mx-auto">
              Importez votre appel d&apos;offres, laissez l&apos;IA analyser les exigences et générer
              un mémoire technique complet, personnalisé avec les données de votre entreprise.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/app"
                className="bg-gradient-to-r from-[#00236f] to-[#1e3a8a] text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-[#00236f]/25 hover:opacity-90 transition-all flex items-center gap-3 text-lg"
              >
                Essayer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#comment-ca-marche"
                className="text-[#555d7e] font-semibold px-6 py-4 rounded-xl hover:bg-white transition-colors"
              >
                Voir la démo
              </a>
            </div>
            <p className="text-sm text-[#757682] mt-4">
              1 AO gratuit par mois · Aucune carte bancaire requise
            </p>
          </div>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section id="fonctionnalites" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#00236f] mb-4">
              Tout ce qu&apos;il faut pour répondre aux AO
            </h2>
            <p className="text-[#444651] text-lg max-w-2xl mx-auto">
              Un outil complet qui automatise la rédaction de vos mémoires techniques, de l&apos;analyse à l&apos;export.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#f7f9fb] rounded-xl p-8 hover:shadow-lg hover:shadow-[#00236f]/5 transition-all group"
              >
                <div className="w-12 h-12 bg-[#d0d8ff]/40 rounded-xl flex items-center justify-center text-[#00236f] mb-5 group-hover:bg-[#00236f] group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-[var(--font-headline)] font-bold text-lg text-[#191c1e] mb-2">{f.title}</h3>
                <p className="text-[#444651] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="comment-ca-marche" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#00236f] mb-4">
              Simple comme 1, 2, 3
            </h2>
            <p className="text-[#444651] text-lg">
              De l&apos;appel d&apos;offres au mémoire technique en 3 étapes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] rounded-2xl flex items-center justify-center text-white font-[var(--font-headline)] font-extrabold text-xl mx-auto mb-6 shadow-lg shadow-[#00236f]/20">
                  {s.num}
                </div>
                <h3 className="font-[var(--font-headline)] font-bold text-xl text-[#191c1e] mb-3">{s.title}</h3>
                <p className="text-[#444651] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="tarifs" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#00236f] mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-[#444651] text-lg">
              Commencez gratuitement. Passez au Pro quand vous êtes prêt.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#f7f9fb] rounded-2xl p-10 border border-[#c5c5d3]/30">
              <h3 className="font-[var(--font-headline)] font-bold text-xl text-[#191c1e] mb-2">Gratuit</h3>
              <p className="text-[#444651] text-sm mb-6">Pour découvrir l&apos;outil</p>
              <div className="mb-8">
                <span className="font-[var(--font-headline)] text-5xl font-extrabold text-[#191c1e]">0€</span>
                <span className="text-[#757682] text-sm ml-1">/mois</span>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  "1 analyse AO par mois",
                  "Tous les providers IA",
                  "Export aperçu",
                  "Configuration entreprise",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#444651]">
                    <Check className="w-5 h-5 text-[#00236f] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/app"
                className="block text-center w-full py-3.5 rounded-xl border-2 border-[#00236f] text-[#00236f] font-semibold hover:bg-[#00236f]/5 transition-colors"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro Plan — Coming Soon */}
            <div className="bg-gradient-to-br from-[#00236f]/60 to-[#1e3a8a]/60 rounded-2xl p-10 text-white relative overflow-hidden shadow-2xl shadow-[#00236f]/10 opacity-75">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                Bientôt disponible
              </div>
              <h3 className="font-[var(--font-headline)] font-bold text-xl mb-2">Pro</h3>
              <p className="text-white/70 text-sm mb-6">Pour les professionnels du BTP</p>
              <div className="mb-8">
                <span className="font-[var(--font-headline)] text-5xl font-extrabold">90€</span>
                <span className="text-white/60 text-sm ml-1">/mois</span>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  "5 analyses AO par mois",
                  "Tous les providers IA",
                  "Export PDF complet",
                  "Configuration entreprise",
                  "Historique des AO",
                  "Support prioritaire",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                    <Check className="w-5 h-5 text-[#b6c4ff] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <span
                className="block text-center w-full py-3.5 rounded-xl bg-white/50 text-[#00236f]/60 font-bold cursor-not-allowed"
              >
                Bientôt disponible
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#00236f] mb-4">
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="group bg-white rounded-xl border border-[#c5c5d3]/20 overflow-hidden">
                <summary className="flex items-center justify-between px-8 py-5 cursor-pointer list-none font-semibold text-[#191c1e] hover:bg-[#f7f9fb] transition-colors">
                  {f.q}
                  <ChevronDown className="w-5 h-5 text-[#757682] group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-8 pb-5 text-[#444651] text-sm leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-24 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold mb-6">
            Prêt à gagner du temps sur vos AO ?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez les professionnels du BTP qui automatisent leurs mémoires techniques.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 bg-white text-[#00236f] font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-white/90 transition-all text-lg"
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#191c1e] text-white/60 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] rounded-lg flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-[var(--font-headline)] font-bold text-white">MémoireAO</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">CGV</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} MémoireAO
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
