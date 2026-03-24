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

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  preview?: string;
}

export interface AnalysePlans {
  rapportMarkdown: string;
  status: 'idle' | 'loading' | 'done' | 'error';
  error?: string;
}

export type Step = 'saisie' | 'analyse' | 'plans' | 'reponse' | 'apercu' | 'export';

export type AIProviderType = 'openrouter' | 'groq' | 'openai' | 'anthropic';

export interface AIProvider {
  type: AIProviderType;
  apiKey: string;
  model: string;
}

export const AI_PROVIDERS: Record<AIProviderType, { label: string; baseUrl: string; defaultModel: string; models: { id: string; label: string }[] }> = {
  openrouter: {
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-sonnet-4',
    models: [
      { id: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
      { id: 'openai/gpt-4o', label: 'GPT-4o' },
      { id: 'google/gemini-2.5-flash-preview', label: 'Gemini 2.5 Flash' },
      { id: 'mistralai/mistral-large-latest', label: 'Mistral Large' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
    ],
  },
  groq: {
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (rapide)' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
      { id: 'gemma2-9b-it', label: 'Gemma 2 9B' },
    ],
  },
  openai: {
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (économique)' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    ],
  },
  anthropic: {
    label: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-sonnet-4-20250514',
    models: [
      { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (rapide)' },
    ],
  },
};
