# Backlog — Générateur de Mémoires Techniques AO (SaaS)

## Vision Produit
Transformer l'outil interne en SaaS commercial avec :
- **Plan Gratuit** : 1 AO/mois
- **Plan Pro** : 90€/mois → 5 AO/mois
- Authentification utilisateurs
- Paiements Stripe
- Tracking d'usage

---

## Stack Technique Recommandée
| Composant | Technologie |
|-----------|------------|
| Frontend | Next.js 16 (existant) |
| Auth | Supabase Auth (email + Google OAuth) |
| Base de données | Supabase PostgreSQL |
| Paiements | Stripe Checkout + Webhooks |
| Hosting | Vercel ou Netlify |
| Emails transactionnels | Resend ou Postmark |

---

## EPIC 1 — Landing Page & Marketing (Priorité: P0)

### 1.1 Landing Page
- [x] Header avec logo + CTA "Commencer gratuitement"
- [ ] Hero section : titre accrocheur, sous-titre, CTA, screenshot de l'app
- [ ] Section "Comment ça marche" : 3 étapes visuelles
- [ ] Section "Fonctionnalités" : 6 cards (analyse IA, multi-provider, export PDF, etc.)
- [ ] Section "Pricing" : 2 plans (Gratuit / Pro 90€/mois)
- [ ] Section "Témoignages" / Social proof
- [ ] Section FAQ
- [ ] Footer avec liens légaux (CGV, CGU, Politique de confidentialité)
- [ ] Responsive mobile
- [ ] SEO meta tags + OpenGraph

### 1.2 Pages légales
- [ ] CGV (Conditions Générales de Vente)
- [ ] CGU (Conditions Générales d'Utilisation)
- [ ] Politique de confidentialité (RGPD)
- [ ] Mentions légales

---

## EPIC 2 — Authentification (Priorité: P0)

### 2.1 Setup Supabase
- [x] Créer le projet Supabase
- [x] Configurer les variables d'environnement (SUPABASE_URL, SUPABASE_ANON_KEY)
- [x] Installer `@supabase/supabase-js` et `@supabase/ssr`

### 2.2 Pages Auth
- [x] Page `/login` : email + mot de passe + Google OAuth
- [x] Page `/signup` : inscription avec email
- [ ] Page `/forgot-password` : réinitialisation mot de passe
- [ ] Email de confirmation d'inscription
- [x] Middleware Next.js pour protéger les routes `/app/*`

### 2.3 Gestion utilisateur
- [ ] Page `/app/account` : profil, changement de mot de passe
- [x] Bouton déconnexion dans le header
- [ ] Stocker la config entreprise par utilisateur (pas en localStorage)

---

## EPIC 3 — Base de Données & Modèle de Données (Priorité: P0)

### 3.1 Tables Supabase

```sql
-- Profils utilisateurs
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  nom_entreprise TEXT,
  config_entreprise JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Abonnements
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'canceled' | 'past_due'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Usage mensuel
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  month TEXT NOT NULL, -- '2026-03'
  ao_count INT DEFAULT 0,
  ao_limit INT DEFAULT 1, -- 1 pour free, 5 pour pro
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Historique des AO générés
CREATE TABLE ao_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  titre TEXT,
  ao_text TEXT,
  analyse JSONB,
  reponse JSONB,
  status TEXT DEFAULT 'draft', -- 'draft' | 'completed' | 'exported'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2 Row Level Security (RLS)
- [x] Chaque user ne voit que ses propres données
- [x] Policies sur toutes les tables

### 3.3 Gestion des Clés API Admin (Priorité: P0)
- [x] Table `admin_config` — stockage des clés API par provider
- [x] Colonne `role` dans `profiles` (`admin` | `user`)
- [x] RLS sur `admin_config` — seul l'admin peut lire/écrire
- [x] Page `/app/admin` — configuration des clés par provider
- [x] API routes IA (`/api/analyse-ao`, `/api/generer-memoire`) — clés depuis `admin_config` (server-side)
- [x] `ConfigPanel` épuré — les users ne saisissent plus de clé API manuellement
- [x] `AIProvider.apiKey` retiré du type client

---

## EPIC 4 — Stripe & Paiements (Priorité: P0)

### 4.1 Configuration Stripe
- [ ] Créer le compte Stripe
- [ ] Créer le produit "Plan Pro" à 90€/mois (récurrent)
- [ ] Configurer les webhooks Stripe → `/api/webhooks/stripe`
- [ ] Variables d'environnement : STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID

### 4.2 API Routes
- [ ] `POST /api/stripe/create-checkout-session` : créer une session Stripe Checkout
- [ ] `POST /api/stripe/create-portal-session` : accès au portail client Stripe (gestion abo)
- [ ] `POST /api/webhooks/stripe` : recevoir les événements Stripe
  - `checkout.session.completed` → activer l'abonnement
  - `customer.subscription.updated` → mettre à jour le statut
  - `customer.subscription.deleted` → résilier
  - `invoice.payment_failed` → marquer past_due

### 4.3 UI Paiement
- [ ] Bouton "Passer au Pro" dans l'app → redirige vers Stripe Checkout
- [ ] Page `/app/billing` : état de l'abonnement, bouton gérer/résilier
- [ ] Afficher le compteur d'usage (X/1 AO ce mois ou X/5 AO)
- [ ] Modal "Limite atteinte" quand le quota est dépassé → CTA upgrade

---

## EPIC 5 — Contrôle d'Usage (Priorité: P1)

### 5.1 Middleware de quotas
- [ ] Avant chaque analyse AO, vérifier le quota mensuel
- [ ] Incrémenter le compteur après une analyse réussie
- [ ] Reset automatique le 1er de chaque mois (ou via Stripe billing period)
- [ ] API Route `GET /api/usage` : retourne l'usage courant

### 5.2 UI Usage
- [ ] Badge dans le header : "2/5 AO ce mois"
- [ ] Barre de progression dans le dashboard
- [ ] Notification quand il reste 1 AO
- [ ] Blocage avec message clair quand quota atteint

---

## EPIC 6 — Restructuration App (Priorité: P1)

### 6.1 Routing
```
/                    → Landing page (publique)
/login               → Connexion
/signup              → Inscription
/app                 → Dashboard (protégé)
/app/nouveau         → Nouvelle analyse AO (workflow actuel)
/app/historique      → Liste des AO passées
/app/compte          → Profil & config entreprise
/app/facturation     → Abonnement & factures
```

### 6.2 Dashboard
- [ ] Liste des AO récentes avec statut
- [ ] Compteur d'usage du mois
- [ ] Bouton "Nouvelle analyse AO"
- [ ] Accès rapide à la config entreprise

### 6.3 Historique AO
- [ ] Sauvegarder chaque AO en BDD (pas juste en state)
- [ ] Pouvoir reprendre un AO en cours
- [ ] Export PDF de l'historique

### 6.4 Saisie du contexte entreprise pour réponse AO
- [x] Nouvelle step StepContexte (entre Plans et Réponse)
- [x] Champs : moyens techniques, certifications pertinentes, expériences similaires, notes spécifiques
- [x] Auto-fill depuis ConfigPanel (localStorage + bouton)
- [x] Transmission du contexte à /api/generer-memoire
- [ ] Optionnel : stockage BDD du contexte par AO

---

## EPIC 7 — Déploiement & DevOps (Priorité: P1)

### 7.1 Déploiement
- [ ] Configurer Vercel (ou Netlify)
- [ ] Variables d'environnement en production
- [ ] Domaine personnalisé
- [ ] SSL automatique

### 7.2 Monitoring
- [ ] Sentry pour le tracking d'erreurs
- [ ] Vercel Analytics pour le trafic
- [ ] Alertes Stripe (paiements échoués)

---

## EPIC 8 — Améliorations futures (Priorité: P2)

- [ ] Plan Enterprise (illimité, support dédié)
- [ ] Export PDF natif (pas juste aperçu)
- [ ] Analyse de plans techniques (OCR/Vision)
- [ ] Templates de réponses par secteur
- [ ] Collaboration multi-utilisateurs
- [ ] API publique pour intégrations
- [ ] Mode sombre
- [ ] App mobile (PWA)

---

## Ordre de Développement Recommandé

```
Sprint 1 (1-2 semaines) :
  → EPIC 1 (Landing Page)
  → EPIC 2 (Auth Supabase)
  → EPIC 3 (Base de données)

Sprint 2 (1-2 semaines) :
  → EPIC 4 (Stripe)
  → EPIC 5 (Quotas)
  → EPIC 6.1 (Routing)

Sprint 3 (1 semaine) :
  → EPIC 6.2-6.3 (Dashboard, Historique)
  → EPIC 7 (Déploiement)

Sprint 4 (continu) :
  → EPIC 8 (Améliorations)
```

---

## Variables d'Environnement Requises

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=

# App
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```
