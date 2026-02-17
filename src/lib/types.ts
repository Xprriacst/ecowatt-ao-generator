export interface AOData {
  rawText: string;
  reference?: string;
  objet?: string;
  acheteur?: string;
  dateLimite?: string;
  montantEstime?: string;
  lieu?: string;
  lots?: string[];
  criteresAttribution?: { critere: string; ponderation: string }[];
  documentsExiges?: string[];
  contactDestinataire?: string;
  emailDestinataire?: string;
}

export interface AnalyseAO {
  pointsCles: string[];
  exigencesTechniques: string[];
  delais: string;
  risques: string[];
  recommandations: string[];
}

export interface SectionReponse {
  id: string;
  titre: string;
  contenu: string;
  editable: boolean;
  included: boolean;
}

export interface ReponseAO {
  sections: SectionReponse[];
  dateGeneration: string;
  reference: string;
}

export interface ConfigEntreprise {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siret: string;
  codeAPE: string;
  certifications: string[];
  assurances: string[];
  effectif: string;
  chiffreAffaires: string;
  domainesIntervention: string[];
  zoneGeographique: string;
  valeurs: string[];
  references: { client: string; projet: string; montant: string; annee: string }[];
}

export type Step = 'saisie' | 'analyse' | 'reponse' | 'apercu' | 'export';
