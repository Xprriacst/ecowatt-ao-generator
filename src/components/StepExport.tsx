"use client";

import { useState } from "react";
import { ArrowLeft, Download, Mail, Send, CheckCircle, Copy, RotateCcw } from "lucide-react";
import { SectionReponse, AOData, ConfigEntreprise } from "@/lib/types";

interface StepExportProps {
  sections: SectionReponse[];
  aoData: AOData;
  config: ConfigEntreprise;
  onReset: () => void;
  onRetour: () => void;
}

export default function StepExport({ sections, aoData, config, onReset, onRetour }: StepExportProps) {
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [mailReady, setMailReady] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const destinataire = aoData.emailDestinataire || "marches@ville-chateauroux.fr";
  const reference = aoData.reference || "[Référence AO]";
  const objet = aoData.objet || "[Objet du marché]";

  const mailSubject = `Réponse AO ${reference} — ${config.nom}`;
  const mailBody = `Madame, Monsieur,

Vous trouverez en pièce jointe notre réponse à la consultation ${reference} portant sur « ${objet} ».

Notre dossier comprend :
${sections.map(s => `• ${s.titre}`).join('\n')}

Nous restons à votre entière disposition pour tout complément d'information.

Bien cordialement,

${config.nom}
${config.adresse}
${config.telephone || '[Téléphone]'}
${config.email}`;

  const handleGeneratePDF = () => {
    setPdfGenerated(true);
    setTimeout(() => setMailReady(true), 500);
  };

  const handleSendMail = () => {
    setMailSent(true);
  };

  const handleCopyMail = () => {
    navigator.clipboard.writeText(mailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoLink = `mailto:${destinataire}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <div className="space-y-6">
      {/* Étape 1 : Export PDF */}
      <div className={`bg-surface rounded-xl p-6 shadow-sm border transition-all ${
        pdfGenerated ? "border-primary/40 bg-primary/5" : "border-border"
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            pdfGenerated ? "bg-primary/20" : "bg-surface-alt"
          }`}>
            {pdfGenerated ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <Download className="w-5 h-5 text-muted" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">1. Exporter le dossier en PDF</h2>
            <p className="text-sm text-muted">
              {pdfGenerated
                ? "PDF généré avec succès — Prêt pour l'envoi"
                : `${sections.length} sections seront incluses dans le document`
              }
            </p>
          </div>
        </div>

        <div className="bg-surface-alt rounded-lg p-4 mb-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Contenu du PDF</p>
          <div className="space-y-1">
            {sections.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                {s.titre}
              </div>
            ))}
          </div>
        </div>

        {!pdfGenerated ? (
          <button
            onClick={handleGeneratePDF}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md w-full justify-center"
          >
            <Download className="w-4 h-4" />
            Générer et télécharger le PDF
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <CheckCircle className="w-4 h-4" />
            Dossier_Reponse_AO_{reference.replace(/[^a-zA-Z0-9]/g, '_')}.pdf — Téléchargé
          </div>
        )}
      </div>

      {/* Étape 2 : Mail */}
      <div className={`bg-surface rounded-xl p-6 shadow-sm border transition-all ${
        !pdfGenerated ? "border-border opacity-50" : mailSent ? "border-primary/40 bg-primary/5" : "border-border"
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            mailSent ? "bg-primary/20" : "bg-surface-alt"
          }`}>
            {mailSent ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <Mail className="w-5 h-5 text-muted" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">2. Envoyer par email</h2>
            <p className="text-sm text-muted">
              {mailSent
                ? "Email prêt à être envoyé via votre client mail"
                : "Un email pré-rempli sera généré avec le PDF en pièce jointe"
              }
            </p>
          </div>
        </div>

        {pdfGenerated && (
          <>
            <div className="space-y-3 mb-4">
              <div className="bg-surface-alt rounded-lg p-3">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Destinataire</p>
                <p className="text-sm font-semibold mt-1">{destinataire}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-3">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Objet</p>
                <p className="text-sm font-semibold mt-1">{mailSubject}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-muted uppercase tracking-wide">Corps du message</p>
                  <button
                    onClick={handleCopyMail}
                    className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>
                <pre className="text-sm mt-1 whitespace-pre-wrap text-muted leading-relaxed font-sans">
                  {mailBody}
                </pre>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs font-medium text-amber-800">
                  📎 Pièce jointe : Dossier_Reponse_AO_{reference.replace(/[^a-zA-Z0-9]/g, '_')}.pdf
                </p>
              </div>
            </div>

            {!mailSent ? (
              <a
                href={mailtoLink}
                onClick={handleSendMail}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md w-full justify-center"
              >
                <Send className="w-4 h-4" />
                Ouvrir dans mon client mail
              </a>
            ) : (
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                Client mail ouvert — N&apos;oubliez pas de joindre le PDF avant d&apos;envoyer
              </div>
            )}
          </>
        )}
      </div>

      {/* Succès final */}
      {mailSent && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold text-primary">Dossier prêt !</h3>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Votre réponse à l&apos;appel d&apos;offres a été générée et l&apos;email est prêt à être envoyé.
            Pensez à vérifier le contenu et à joindre le PDF avant l&apos;envoi.
          </p>
          <button
            onClick={onReset}
            className="mt-4 flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-primary bg-white hover:bg-surface-alt rounded-lg transition-colors border border-primary/20 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Nouveau dossier
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onRetour}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground bg-surface hover:bg-surface-alt rounded-lg transition-colors border border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la réponse
        </button>
      </div>
    </div>
  );
}
