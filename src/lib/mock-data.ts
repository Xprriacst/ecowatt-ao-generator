import { ConfigEntreprise, AOData, AnalyseAO, SectionReponse } from './types';

export const defaultConfig: ConfigEntreprise = {
  nom: "EcoWatts Centre",
  adresse: "Région Centre-Val de Loire",
  telephone: "",
  email: "contact@ecowattscentre.fr",
  siret: "",
  codeAPE: "4321A - Travaux d'installation électrique",
  certifications: [
    "Habilitations électriques B1V, B2V, BR, BC, H0V",
    "Qualifications IRVE (Infrastructure de Recharge pour Véhicules Électriques)",
  ],
  assurances: [
    "Responsabilité Civile Professionnelle",
    "Garantie Décennale",
  ],
  effectif: "3 collaborateurs (2 techniciens terrain + 1 gestion administrative)",
  chiffreAffaires: "",
  domainesIntervention: [
    "Électricité industrielle (courant fort / courant faible)",
    "Électricité tertiaire",
    "Électricité pour les collectivités (éclairage public, bâtiments municipaux)",
    "Alarme, domotique, vidéosurveillance",
    "Dépannage et maintenance électrique",
    "Économies d'énergie",
  ],
  zoneGeographique: "Région Centre-Val de Loire",
  valeurs: ["Qualité", "Proximité", "Réactivité"],
  references: [
    { client: "Collectivité locale", projet: "Rénovation éclairage public", montant: "", annee: "2025" },
    { client: "Site industriel", projet: "Mise en conformité installations électriques", montant: "", annee: "2025" },
  ],
};

export const exempleAO = `AVIS D'APPEL PUBLIC À LA CONCURRENCE

Pouvoir adjudicateur : Mairie de Châteauroux
Objet du marché : Travaux de rénovation et mise en conformité des installations électriques du groupe scolaire Jean Moulin
Référence : MARCHE-2025-ELEC-042

Type de marché : Travaux
Procédure : Procédure adaptée (MAPA) - Article L2123-1 du Code de la commande publique

Description des travaux :
- Remplacement complet du tableau général basse tension (TGBT)
- Mise en conformité de l'ensemble du réseau électrique selon la norme NF C 15-100
- Installation d'un éclairage LED dans l'ensemble des salles de classe (12 salles), couloirs et espaces communs
- Mise en place d'un système de gestion technique centralisée (GTC) pour le pilotage de l'éclairage
- Installation de détecteurs de présence dans les sanitaires et couloirs
- Remplacement des prises et interrupteurs vétustes
- Mise en place d'un système d'alarme incendie conforme aux normes ERP
- Vérification et mise à jour du réseau de terre

Lieu d'exécution : Groupe scolaire Jean Moulin, 15 rue de la République, 36000 Châteauroux

Montant estimé : Entre 80 000 € et 120 000 € HT

Délai d'exécution : 8 semaines à compter de l'ordre de service, travaux à réaliser pendant les vacances scolaires d'été 2025

Critères d'attribution :
1. Valeur technique de l'offre (mémoire technique) : 50%
   - Méthodologie et organisation du chantier : 20%
   - Qualifications et expérience de l'équipe : 15%
   - Démarche environnementale et économies d'énergie : 15%
2. Prix des prestations : 40%
3. Délai d'exécution : 10%

Documents à fournir :
- DC1 (Lettre de candidature)
- DC2 (Déclaration du candidat)
- Mémoire technique détaillé
- Bordereau des Prix Unitaires (BPU)
- Détail Quantitatif Estimatif (DQE)
- Planning prévisionnel d'exécution
- Attestations de qualifications et certifications
- Attestation d'assurance RC et décennale
- Références de travaux similaires (3 dernières années)
- KBIS de moins de 3 mois

Date limite de réception des offres : 15 mars 2025 à 12h00

Contact : Service des marchés publics
Email : marches@ville-chateauroux.fr
Adresse : Mairie de Châteauroux, Place de la République, 36000 Châteauroux

Plateforme de dématérialisation : https://marchespublics.fr`;

export function analyserAO(ao: AOData): AnalyseAO {
  return {
    pointsCles: [
      `Objet : ${ao.objet || 'Travaux de rénovation électrique'}`,
      `Acheteur : ${ao.acheteur || 'Collectivité publique'}`,
      `Montant estimé : ${ao.montantEstime || 'Non précisé'}`,
      `Date limite : ${ao.dateLimite || 'Non précisée'}`,
      `Lieu : ${ao.lieu || 'Non précisé'}`,
      `Procédure : MAPA (Marché à Procédure Adaptée)`,
    ],
    exigencesTechniques: [
      "Remplacement TGBT et mise en conformité NF C 15-100",
      "Installation éclairage LED + GTC",
      "Détecteurs de présence",
      "Système alarme incendie ERP",
      "Vérification réseau de terre",
    ],
    delais: "8 semaines — travaux pendant vacances scolaires été 2025",
    risques: [
      "Délai contraint (vacances scolaires uniquement)",
      "Bâtiment ERP : contraintes réglementaires strictes",
      "Coordination avec autres corps de métier potentiels",
      "Découverte d'amiante ou de plomb possible (bâtiment ancien)",
    ],
    recommandations: [
      "Mettre en avant l'expertise en milieu ERP et collectivités",
      "Insister sur la démarche économies d'énergie (15% du critère technique)",
      "Proposer un planning détaillé semaine par semaine",
      "Valoriser la proximité géographique (réactivité)",
      "Préparer des fiches techniques LED et GTC détaillées",
    ],
  };
}

export function extraireInfosAO(texte: string): AOData {
  const refMatch = texte.match(/[Rr]éférence\s*:\s*(.+)/);
  const objetMatch = texte.match(/[Oo]bjet(?:\s+du\s+marché)?\s*:\s*(.+)/);
  const acheteurMatch = texte.match(/[Pp]ouvoir\s+adjudicateur\s*:\s*(.+)/);
  const dateMatch = texte.match(/[Dd]ate\s+limite.*?:\s*(.+)/);
  const montantMatch = texte.match(/[Mm]ontant\s+estimé\s*:\s*(.+)/);
  const lieuMatch = texte.match(/[Ll]ieu\s+d['']exécution\s*:\s*(.+)/);
  const emailMatch = texte.match(/[Ee]mail\s*:\s*(\S+@\S+)/);
  const contactMatch = texte.match(/[Cc]ontact\s*:\s*(.+)/);

  return {
    rawText: texte,
    reference: refMatch?.[1]?.trim(),
    objet: objetMatch?.[1]?.trim(),
    acheteur: acheteurMatch?.[1]?.trim(),
    dateLimite: dateMatch?.[1]?.trim(),
    montantEstime: montantMatch?.[1]?.trim(),
    lieu: lieuMatch?.[1]?.trim(),
    emailDestinataire: emailMatch?.[1]?.trim(),
    contactDestinataire: contactMatch?.[1]?.trim(),
  };
}

export function genererReponse(ao: AOData, config: ConfigEntreprise): SectionReponse[] {
  return [
    {
      id: 'lettre',
      titre: '1. Lettre de candidature',
      contenu: `Madame, Monsieur,

En réponse à votre appel d'offres référencé ${ao.reference || '[Référence]'} portant sur « ${ao.objet || '[Objet du marché]'} », nous avons l'honneur de vous présenter notre candidature et notre offre technique et financière.

${config.nom}, entreprise spécialisée en électricité industrielle, tertiaire et pour les collectivités, intervient en ${config.zoneGeographique}. Fondée par trois professionnels passionnés et complémentaires, notre société met à votre disposition une expertise technique éprouvée et un engagement fort en matière de qualité, proximité et réactivité.

Notre structure à taille humaine nous permet d'offrir une grande souplesse d'intervention et une réactivité optimale. Nous avons pris connaissance de l'ensemble des pièces du dossier de consultation et nous nous engageons à respecter l'intégralité des clauses techniques et administratives du marché.

Nous restons à votre entière disposition pour tout complément d'information ou pour organiser une visite technique préalable si nécessaire.

Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

${config.nom}
${config.adresse}
${config.email}
${config.telephone || '[Téléphone]'}`,
      editable: true,
      included: true,
    },
    {
      id: 'presentation',
      titre: '2. Présentation de l\'entreprise',
      contenu: `2.1 Identité de l'entreprise

Raison sociale : ${config.nom}
Forme juridique : SAS
SIRET : ${config.siret || '[À compléter]'}
Code APE / NAF : ${config.codeAPE}
Adresse du siège social : ${config.adresse}
Téléphone : ${config.telephone || '[À compléter]'}
Email : ${config.email}
Site internet : https://ecowattscentre.fr
Effectif : ${config.effectif}
Chiffre d'affaires : ${config.chiffreAffaires || '[À compléter]'}
Date de création : Janvier 2025

2.2 Présentation générale

${config.nom} est une entreprise d'électricité fondée en janvier 2025 par trois professionnels passionnés et complémentaires du secteur électrique. Notre société est née de la volonté de proposer des prestations de haute qualité en alliant expertise technique de terrain et rigueur administrative.

Notre équipe est composée de :
• Deux techniciens terrain expérimentés, disposant d'une solide expérience en électricité industrielle, tertiaire et collectivités. Ils interviennent directement sur les chantiers et assurent la qualité d'exécution des travaux.
• Un responsable administratif et gestion de projet, garant du suivi rigoureux de chaque affaire, de la réponse aux appels d'offres jusqu'à la réception des travaux et la remise du DOE.

2.3 Domaines d'intervention

${config.domainesIntervention.map(d => `• ${d}`).join('\n')}

Nous intervenons aussi bien sur des projets neufs que sur des opérations de rénovation, de mise en conformité ou de maintenance. Notre polyvalence nous permet de répondre à des besoins variés, du remplacement d'un tableau électrique à la conception complète d'une installation en milieu industriel.

2.4 Valeurs fondamentales

${config.valeurs.map(v => `• ${v} : ${{
  'Qualité': 'Nous nous engageons à offrir un travail irréprochable en respectant les normes les plus strictes de sécurité et d\'efficacité. Chaque intervention fait l\'objet d\'un autocontrôle rigoureux.',
  'Proximité': 'Nous valorisons la relation de confiance avec nos clients en offrant un service personnalisé et réactif. Nous restons disponibles et accessibles à chaque étape du projet.',
  'Réactivité': 'Nous mettons un point d\'honneur à intervenir rapidement et efficacement. Notre structure légère nous permet de mobiliser nos équipes dans des délais très courts.',
}[v] || 'Valeur essentielle de notre entreprise.'}`).join('\n')}

2.5 Certifications et qualifications professionnelles

${config.certifications.map(c => `• ${c}`).join('\n')}
• Connaissance approfondie des normes NF C 15-100, NF C 14-100, NF C 13-100 et NF C 13-200
• Maîtrise de la réglementation ERP (Établissements Recevant du Public)
• Formation continue des équipes aux évolutions normatives

2.6 Assurances et garanties

${config.assurances.map(a => `• ${a}`).join('\n')}
• Garantie de parfait achèvement (1 an)
• Garantie biennale sur les équipements (2 ans)

Les attestations d'assurance en cours de validité sont jointes au présent dossier.

2.7 Zone d'intervention

${config.nom} intervient principalement en ${config.zoneGeographique}. Notre implantation locale nous permet d'assurer une grande réactivité et de limiter les temps de déplacement, contribuant ainsi à la maîtrise des coûts et des délais.`,
      editable: true,
      included: true,
    },
    {
      id: 'comprehension',
      titre: '3. Compréhension du besoin et analyse technique',
      contenu: `3.1 Contexte du projet

Le présent marché porte sur « ${ao.objet || '[objet du marché]'} ». Il s'inscrit dans une démarche de mise en sécurité et de modernisation des installations électriques d'un établissement recevant du public (ERP), avec un objectif fort de performance énergétique.

Le bâtiment concerné est le groupe scolaire Jean Moulin, situé à Châteauroux (36000). Il s'agit d'un ERP de type R (établissement d'enseignement) soumis à des contraintes réglementaires strictes en matière de sécurité électrique et de protection contre l'incendie.

3.2 Enjeux identifiés

Après analyse approfondie du dossier de consultation, nous avons identifié les enjeux majeurs suivants :

Enjeux de sécurité :
• Mise en conformité intégrale des installations électriques selon la norme NF C 15-100 en vigueur
• Remplacement du TGBT vétuste pour garantir la protection des personnes et des biens
• Installation d'un système d'alarme incendie conforme à la réglementation ERP type R
• Vérification et remise aux normes du réseau de terre

Enjeux de performance énergétique :
• Réduction significative de la consommation électrique par le passage en technologie LED (économie estimée de 60 à 70%)
• Optimisation de l'usage grâce aux détecteurs de présence (suppression des consommations inutiles)
• Pilotage intelligent via la GTC permettant un suivi en temps réel et une programmation horaire

Enjeux opérationnels :
• Respect impératif du calendrier : travaux à réaliser intégralement pendant les vacances scolaires d'été 2025
• Continuité de service : aucune perturbation de l'activité scolaire
• Coordination avec le maître d'ouvrage et les éventuels autres corps de métier

3.3 Points de vigilance

• Bâtiment ancien : risque de présence d'amiante ou de plomb dans les gaines et conduits existants. Nous recommandons un diagnostic avant travaux si celui-ci n'a pas été réalisé.
• Accessibilité : certaines zones peuvent présenter des contraintes d'accès (faux plafonds, combles, gaines techniques). Une visite préalable détaillée est indispensable.
• Compatibilité des équipements : vérification de la compatibilité du nouveau TGBT avec le réseau de distribution existant en amont (branchement ENEDIS).
• Coordination SSI : l'installation du système d'alarme incendie devra être coordonnée avec le système de sécurité incendie (SSI) existant du bâtiment.`,
      editable: true,
      included: true,
    },
    {
      id: 'methodologie',
      titre: '4. Méthodologie et organisation du chantier',
      contenu: `4.1 Approche générale

Notre méthodologie repose sur une approche structurée en 4 phases distinctes, permettant de garantir la qualité d'exécution, le respect des délais et la sécurité sur le chantier. Chaque phase fait l'objet d'un jalon de validation avec le maître d'ouvrage.

4.2 Phase 1 — Préparation et études (Semaine 1)

Cette phase est déterminante pour la réussite du chantier :

• Réunion de lancement avec le maître d'ouvrage et le maître d'œuvre
  - Validation du planning détaillé
  - Définition des modalités de communication (interlocuteurs, fréquence des réunions)
  - Identification des contraintes d'accès et de stationnement

• Visite technique approfondie du site
  - Relevé exhaustif des installations existantes (tableaux, câblages, chemins de câbles, prises, éclairages)
  - Repérage des réseaux et identification des circuits
  - Prise de cotes et photographies de l'existant
  - Identification des points de vigilance (amiante, plomb, accessibilité)

• Études d'exécution
  - Réalisation des plans d'exécution et schémas unifilaires
  - Dimensionnement des protections et des câbles
  - Choix définitif des équipements et validation avec le maître d'ouvrage
  - Établissement de la liste de matériel et commandes fournisseurs

• Préparation logistique
  - Commande et approvisionnement des matériaux (TGBT, luminaires LED, câbles, appareillage)
  - Organisation de la zone de stockage sur site
  - Mise en place des protections et balisages

4.3 Phase 2 — Dépose et préparation des réseaux (Semaines 2-3)

• Consignation et mise hors tension des installations existantes
  - Procédure de consignation conforme à la norme NF C 18-510
  - Vérification d'absence de tension (VAT) systématique
  - Mise en place de condamnations et signalétique

• Dépose soignée des équipements existants
  - Démontage du TGBT existant et des tableaux divisionnaires
  - Dépose des luminaires, prises et interrupteurs vétustes
  - Retrait des câbles hors service
  - Tri sélectif des déchets : DEEE, câbles cuivre, ferraille, déchets banals

• Préparation des nouveaux cheminements
  - Pose ou adaptation des chemins de câbles et goulottes
  - Percements et rebouchages nécessaires
  - Préparation des emplacements pour le nouveau TGBT et les tableaux divisionnaires

4.4 Phase 3 — Installation et câblage (Semaines 3-6)

• Installation du nouveau TGBT
  - Pose et fixation du coffret / armoire
  - Câblage des protections (disjoncteurs, différentiels, parafoudre)
  - Raccordement au réseau de distribution amont
  - Repérage et étiquetage de l'ensemble des circuits

• Tirage de câbles et raccordements
  - Pose des câbles de puissance et de commande selon les plans d'exécution
  - Raccordement des tableaux divisionnaires
  - Câblage des circuits d'éclairage, prises et équipements spécifiques

• Installation de l'éclairage LED
  - Salle de classe 1 à 12 : dalles LED encastrées 600x600, 4000K, IRC>80, gradables
  - Couloirs et circulations : réglettes LED étanches avec détecteurs intégrés
  - Espaces communs (cantine, préau, hall) : luminaires LED adaptés à chaque usage
  - Sanitaires : hublots LED avec détecteurs de présence intégrés

• Installation des détecteurs de présence
  - Sanitaires : détecteurs infrarouges passifs (IRP) avec temporisation réglable
  - Couloirs : détecteurs bi-technologie (IRP + hyperfréquence) pour une détection fiable
  - Paramétrage des seuils de luminosité et des temporisations

• Installation du système de GTC (Gestion Technique Centralisée)
  - Pose du contrôleur central et des modules d'entrées/sorties
  - Câblage du bus de communication
  - Paramétrage des scénarios d'éclairage (mode cours, mode nettoyage, mode vacances)
  - Installation de l'interface de supervision (écran tactile ou accès web)

• Installation du système d'alarme incendie
  - Pose de la centrale d'alarme conforme NF S 61-936
  - Installation des détecteurs de fumée dans les locaux à risque
  - Pose des déclencheurs manuels aux issues de secours
  - Installation des diffuseurs sonores et lumineux
  - Câblage en boucle rebouclée (catégorie C)

• Remplacement de l'appareillage
  - Prises de courant 2P+T conformes NF C 15-100 (hauteur réglementaire)
  - Interrupteurs et va-et-vient
  - Prises RJ45 pour le réseau informatique (si prévu au CCTP)

4.5 Phase 4 — Mise en service, essais et réception (Semaines 7-8)

• Autocontrôles et vérifications internes
  - Contrôle visuel de l'ensemble des installations
  - Vérification du serrage des connexions (contrôle au couple)
  - Test de continuité des conducteurs de protection
  - Mesure des résistances d'isolement
  - Mesure de la résistance de la prise de terre

• Essais fonctionnels
  - Test de chaque circuit d'éclairage et de prises
  - Vérification du fonctionnement des détecteurs de présence
  - Test de la GTC : scénarios, programmation horaire, supervision
  - Essai du système d'alarme incendie : détection, signalisation, évacuation
  - Vérification du déclenchement des protections différentielles

• Contrôle par organisme agréé
  - Passage du bureau de contrôle (Consuel ou organisme accrédité)
  - Levée des éventuelles réserves

• Réception des travaux
  - Réunion de réception avec le maître d'ouvrage
  - Démonstration du fonctionnement des installations
  - Formation du personnel d'entretien à l'utilisation de la GTC et du SSI
  - Remise du DOE (Dossier des Ouvrages Exécutés) comprenant :
    - Plans de récolement
    - Schémas unifilaires mis à jour
    - Notices techniques des équipements
    - PV d'essais et de contrôle
    - Attestation de conformité
    - Certificats de garantie`,
      editable: true,
      included: true,
    },
    {
      id: 'moyens_humains',
      titre: '5. Moyens humains',
      contenu: `5.1 Équipe dédiée au chantier

L'équipe mobilisée pour ce marché est composée de professionnels qualifiés et expérimentés :

Responsable de chantier / Chargé d'affaires
• Rôle : Pilotage global du chantier, interface avec le maître d'ouvrage, suivi du planning et du budget
• Qualifications : Habilitations électriques B2V, BR, BC, H0V
• Missions : Coordination des interventions, animation des réunions de chantier, validation technique, contrôle qualité
• Présence sur site : quotidienne pendant toute la durée du chantier

Électricien qualifié n°1
• Rôle : Exécution des travaux d'installation, câblage et raccordement
• Qualifications : Habilitations électriques B1V, BR, BC
• Spécialités : TGBT, distribution électrique, éclairage, courant fort
• Présence sur site : temps plein pendant les 8 semaines

Électricien qualifié n°2 (renfort)
• Rôle : Renfort sur les phases critiques d'installation (semaines 3 à 6)
• Qualifications : Habilitations électriques B1V, BR
• Spécialités : Courant faible, alarme incendie, GTC, détection
• Présence sur site : semaines 3 à 6 (phases d'installation intensive)

5.2 Organigramme de projet

Maître d'ouvrage (Mairie de Châteauroux)
    ↓
Responsable de chantier (EcoWatts Centre)
    ↓
├── Électricien n°1 (courant fort)
├── Électricien n°2 (courant faible / GTC)
└── Sous-traitants éventuels (si nécessaire)

5.3 Gestion des compétences

• L'ensemble du personnel intervenant dispose des habilitations électriques en cours de validité
• Formation continue assurée sur les évolutions normatives (NF C 15-100, réglementation ERP)
• Chaque intervenant est équipé de ses EPI (Équipements de Protection Individuelle) personnels
• Un livret d'accueil sécurité sera remis à chaque intervenant avant le début du chantier

5.4 Sous-traitance

Pour ce marché, ${config.nom} prévoit de réaliser l'intégralité des travaux en moyens propres. En cas de besoin ponctuel de renfort, nous ferons appel à des sous-traitants qualifiés et déclarés, après accord préalable du maître d'ouvrage, conformément aux dispositions du CCAG Travaux.`,
      editable: true,
      included: true,
    },
    {
      id: 'moyens_techniques',
      titre: '6. Moyens techniques et matériels',
      contenu: `6.1 Outillage et équipements de chantier

${config.nom} dispose de l'ensemble de l'outillage professionnel nécessaire à la réalisation des travaux :

Outillage électrique :
• Perceuses, visseuses, perforateurs (Hilti, Bosch Professional)
• Rainureuse pour saignées dans maçonnerie
• Sertisseuse hydraulique pour cosses et embouts
• Pince à dénuder automatique et outillage de câblage
• Aiguilles et tire-câbles pour passage dans gaines et chemins de câbles

Appareils de mesure et contrôle :
• Multimètre numérique professionnel (Fluke 179)
• Contrôleur d'installation multifonction (Chauvin Arnoux C.A 6117)
  - Mesure de résistance d'isolement
  - Mesure de résistance de terre
  - Test de continuité
  - Mesure d'impédance de boucle
  - Test de déclenchement des différentiels
• Détecteur de tension sans contact (VAT)
• Pince ampèremétrique
• Luxmètre pour vérification des niveaux d'éclairement
• Testeur de réseau (pour câblage RJ45 si applicable)

Matériel de levage et accès en hauteur :
• Échafaudage roulant aluminium (hauteur de travail jusqu'à 6m)
• Escabeaux et échelles sécurisées
• Nacelle élévatrice (location si nécessaire pour les zones à grande hauteur)

Véhicules :
• 2 véhicules utilitaires équipés et aménagés pour le transport du matériel
• Capacité de stockage embarquée pour l'outillage et les consommables courants

6.2 Matériaux et équipements prévus

Les équipements proposés sont sélectionnés pour leur qualité, leur fiabilité et leur conformité aux normes en vigueur :

TGBT (Tableau Général Basse Tension) :
• Armoire Schneider Electric Prisma ou équivalent
• Disjoncteur général avec protection différentielle
• Disjoncteurs divisionnaires calibrés selon les circuits
• Parafoudre type 2
• Compteur d'énergie modulaire pour suivi des consommations
• Repérage et étiquetage complet

Éclairage LED :
• Dalles LED 600x600 encastrées — Marque Sylvania, Philips ou équivalent
  - Puissance : 36W (équivalent 4x18W fluorescent)
  - Flux lumineux : 3600 lm
  - Température de couleur : 4000K (blanc neutre, adapté aux salles de classe)
  - IRC > 80 (rendu des couleurs fidèle)
  - Durée de vie : 50 000 heures (L80B10)
  - Driver DALI pour gradation et pilotage GTC
• Réglettes LED étanches IP65 pour couloirs — 1500mm, 50W, 6000 lm
• Hublots LED avec détecteur intégré pour sanitaires — 18W, IP44, IK10

Détecteurs de présence :
• Détecteurs infrarouges passifs (IRP) pour sanitaires — Theben ou équivalent
• Détecteurs bi-technologie (IRP + HF) pour couloirs — portée 360°, réglage de sensibilité et temporisation

GTC (Gestion Technique Centralisée) :
• Contrôleur programmable avec interface web intégrée
• Modules d'entrées/sorties pour pilotage des circuits d'éclairage
• Interface utilisateur : écran tactile 10" en loge gardien + accès web sécurisé
• Protocole DALI pour communication avec les drivers LED
• Fonctionnalités : programmation horaire, scénarios, suivi des consommations, alertes

Alarme incendie :
• Centrale d'alarme type 4 conforme NF S 61-936 — Nugelec, Esser ou équivalent
• Détecteurs optiques de fumée certifiés NF
• Déclencheurs manuels à membrane déformable (couleur rouge, hauteur 1,30m)
• Diffuseurs sonores et lumineux (DSNA) conformes NF C 48-150

Câblage :
• Câbles U1000 R2V pour circuits de puissance
• Câbles CR1-C1 résistants au feu pour circuits de sécurité (alarme incendie)
• Câbles blindés pour bus de communication GTC
• Chemins de câbles en tôle galvanisée, goulottes PVC

6.3 Fiches techniques

Les fiches techniques détaillées de l'ensemble des équipements proposés seront jointes en annexe du présent mémoire technique.`,
      editable: true,
      included: true,
    },
    {
      id: 'planning',
      titre: '7. Planning prévisionnel d\'exécution',
      contenu: `7.1 Planning général

Durée totale des travaux : 8 semaines
Période d'exécution : Vacances scolaires d'été 2025 (juillet-août)
Date prévisionnelle de démarrage : Lundi 7 juillet 2025 (sous réserve de l'ordre de service)
Date prévisionnelle de fin : Vendredi 29 août 2025

Semaine 1 (7-11 juillet) — PRÉPARATION
• Réunion de lancement et visite technique détaillée
• Relevés sur site, prises de cotes, repérage des réseaux
• Validation des plans d'exécution avec le maître d'ouvrage
• Réception et stockage des matériaux sur site
• Installation de la base vie et des protections

Semaine 2 (14-18 juillet) — DÉPOSE
• Consignation des installations existantes
• Dépose du TGBT et des tableaux divisionnaires
• Dépose des luminaires, prises et interrupteurs vétustes
• Évacuation et tri des déchets (benne DEEE + benne cuivre)

Semaine 3 (21-25 juillet) — PRÉPARATION RÉSEAUX + DÉBUT INSTALLATION
• Fin de dépose et nettoyage
• Pose des chemins de câbles et goulottes
• Début du tirage de câbles
• Pose du nouveau TGBT (coffret vide)

Semaine 4 (28 juillet - 1er août) — INSTALLATION COURANT FORT
• Câblage complet du TGBT (protections, raccordements)
• Tirage de câbles de puissance
• Installation éclairage LED — Salles de classe 1 à 6
• Remplacement des prises et interrupteurs (zone 1)

Semaine 5 (4-8 août) — INSTALLATION COURANT FORT (suite)
• Installation éclairage LED — Salles de classe 7 à 12
• Installation éclairage LED — Couloirs et espaces communs
• Remplacement des prises et interrupteurs (zone 2)
• Installation des détecteurs de présence

Semaine 6 (11-15 août) — INSTALLATION COURANT FAIBLE
• Installation du système de GTC (contrôleur, modules, bus)
• Paramétrage de la GTC (scénarios, programmation)
• Installation du système d'alarme incendie (centrale, détecteurs, DM, DSNA)
• Câblage des circuits de sécurité (câbles CR1-C1)

Semaine 7 (18-22 août) — MISE EN SERVICE ET ESSAIS
• Mise sous tension progressive des installations
• Tests et essais de chaque circuit
• Vérification du réseau de terre (mesure de résistance)
• Essais fonctionnels GTC et alarme incendie
• Autocontrôles et levée des points en suspens
• Passage du bureau de contrôle

Semaine 8 (25-29 août) — RÉCEPTION
• Levée des éventuelles réserves du bureau de contrôle
• Nettoyage et remise en état du site
• Formation du personnel (GTC + alarme incendie)
• Réunion de réception des travaux
• Remise du DOE complet

7.2 Jalons clés

• J+0 : Ordre de service → Démarrage du chantier
• Fin S1 : Validation des plans d'exécution → Point d'arrêt n°1
• Fin S3 : TGBT posé, câblage en cours → Point d'avancement
• Fin S6 : Installations terminées → Point d'arrêt n°2
• S7 : Passage bureau de contrôle → Validation conformité
• Fin S8 : Réception des travaux → Remise du DOE

7.3 Réunions de chantier

• Réunion de lancement : S1
• Réunions d'avancement hebdomadaires : chaque lundi matin (9h00)
• Compte-rendu écrit transmis sous 48h
• Rapport photographique d'avancement joint à chaque compte-rendu

7.4 Gestion des aléas

En cas d'aléa (découverte d'amiante, retard de livraison, intempéries), nous informerons immédiatement le maître d'ouvrage et proposerons des solutions alternatives pour maintenir le planning. Notre structure légère nous permet une grande réactivité dans la réorganisation des interventions.`,
      editable: true,
      included: true,
    },
    {
      id: 'qualite_securite',
      titre: '8. Démarche qualité, sécurité et environnement',
      contenu: `8.1 Démarche qualité

Notre démarche qualité repose sur les principes suivants :

Avant les travaux :
• Analyse détaillée du dossier de consultation et du CCTP
• Visite technique préalable systématique
• Validation des plans d'exécution et des choix techniques avec le maître d'ouvrage
• Vérification de la conformité des matériaux à réception

Pendant les travaux :
• Autocontrôle systématique à chaque phase d'installation
• Fiches d'autocontrôle renseignées pour chaque circuit (continuité, isolement, serrage)
• Rapport photographique hebdomadaire
• Réunions de chantier régulières avec compte-rendu écrit

Après les travaux :
• Essais fonctionnels complets avant passage du bureau de contrôle
• Levée des réserves dans les meilleurs délais
• Remise d'un DOE complet et exploitable
• Suivi post-réception pendant la période de garantie de parfait achèvement (1 an)

8.2 Démarche sécurité

La sécurité des personnes est notre priorité absolue :

Plan Particulier de Sécurité et de Protection de la Santé (PPSPS) :
• Un PPSPS sera établi et transmis au coordonnateur SPS avant le début des travaux
• Il détaillera les risques identifiés et les mesures de prévention associées

Risques identifiés et mesures de prévention :
• Risque électrique : consignation systématique, VAT, port des EPI (gants isolants, écran facial), respect de la norme NF C 18-510
• Travail en hauteur : utilisation d'échafaudages conformes, escabeaux sécurisés, port du harnais si nécessaire
• Manutention : formation gestes et postures, utilisation d'aides à la manutention
• Risque chimique : port de masque FFP2 en cas de perçage dans des matériaux suspects (amiante, plomb)
• Co-activité : coordination avec les autres intervenants éventuels, balisage des zones de travail

Équipements de Protection Individuelle (EPI) :
• Casque de chantier
• Chaussures de sécurité
• Gants isolants (classe 00 minimum)
• Lunettes de protection
• Écran facial pour travaux sous tension
• Gilet haute visibilité

Accueil sécurité :
• Chaque intervenant recevra un livret d'accueil sécurité spécifique au chantier
• Une causerie sécurité de 15 minutes sera organisée chaque lundi matin

8.3 Démarche environnementale

Économies d'énergie générées par les travaux :
• Éclairage LED : réduction de 60 à 70% de la consommation d'éclairage
  - Estimation : passage de 15 000 kWh/an à environ 5 000 kWh/an
  - Économie annuelle estimée : ~1 500 € HT (base 0,15 €/kWh)
• Détecteurs de présence : réduction supplémentaire de 20 à 30% sur les zones équipées
• GTC : optimisation globale par programmation horaire et suivi des dérives

Gestion des déchets de chantier :
• Tri sélectif obligatoire sur le chantier (3 bennes minimum)
  - Benne DEEE (Déchets d'Équipements Électriques et Électroniques) : luminaires, appareillage
  - Benne métaux (cuivre, aluminium) : câbles, chemins de câbles
  - Benne DIB (Déchets Industriels Banals) : emballages, cartons, plastiques
• Bordereau de suivi des déchets (BSD) fourni au maître d'ouvrage
• Recyclage des câbles cuivre par un prestataire agréé

Choix des matériaux :
• Luminaires LED sans mercure (contrairement aux tubes fluorescents)
• Câbles conformes au règlement REACH
• Emballages recyclables
• Privilégier les fournisseurs locaux pour limiter l'empreinte carbone du transport`,
      editable: true,
      included: true,
    },
    {
      id: 'references',
      titre: '9. Références et expérience',
      contenu: `9.1 Références de travaux similaires

${config.nom} a réalisé les opérations suivantes, démontrant notre capacité à mener à bien des projets de nature similaire :

${config.references.map((r, i) => `Référence ${i + 1} :
• Client : ${r.client}
• Projet : ${r.projet}
• Année : ${r.annee}
${r.montant ? `• Montant : ${r.montant}` : '• Montant : [À compléter]'}
• Prestations réalisées : Installation électrique complète, mise en conformité, essais et réception
• Résultat : Travaux réalisés dans les délais, réception sans réserve`).join('\n\n')}

9.2 Compétences mobilisables

Notre expertise couvre l'ensemble des besoins identifiés dans le présent marché :
• Électricité en milieu industriel : tableaux de distribution, câblage de puissance, automatismes
• Électricité tertiaire : éclairage, prises, réseaux VDI, domotique
• Installations pour les collectivités : éclairage public, bâtiments municipaux, équipements sportifs
• Systèmes de sécurité : alarme incendie, alarme intrusion, vidéosurveillance, contrôle d'accès
• Gestion technique : GTC, GTB, supervision, pilotage énergétique
• Maintenance et dépannage : contrats de maintenance préventive et curative, astreinte

9.3 Attestations

Les attestations de bonne exécution des marchés référencés ci-dessus sont disponibles sur demande. Les coordonnées des maîtres d'ouvrage peuvent être communiquées pour vérification.`,
      editable: true,
      included: true,
    },
    {
      id: 'prix',
      titre: '10. Offre financière',
      contenu: `10.1 Présentation de l'offre de prix

Le détail de notre offre financière est présenté dans les documents suivants, joints au présent dossier :
• Bordereau des Prix Unitaires (BPU)
• Détail Quantitatif Estimatif (DQE)

Montant global de l'offre : [À compléter] € HT
TVA (20%) : [À compléter] €
Montant TTC : [À compléter] €

10.2 Décomposition par lots fonctionnels

Lot 1 — TGBT et distribution électrique
• Fourniture et pose du TGBT complet
• Câblage de distribution vers tableaux divisionnaires
• Sous-total : [À compléter] € HT

Lot 2 — Éclairage LED
• Fourniture et pose des luminaires LED (salles, couloirs, sanitaires, communs)
• Détecteurs de présence
• Sous-total : [À compléter] € HT

Lot 3 — GTC (Gestion Technique Centralisée)
• Fourniture et pose du système de GTC
• Paramétrage et mise en service
• Formation utilisateur
• Sous-total : [À compléter] € HT

Lot 4 — Alarme incendie
• Fourniture et pose du SSI (centrale, détecteurs, DM, DSNA)
• Mise en service et essais
• Sous-total : [À compléter] € HT

Lot 5 — Appareillage et divers
• Remplacement prises, interrupteurs
• Vérification réseau de terre
• DOE et plans de récolement
• Sous-total : [À compléter] € HT

10.3 Ce prix comprend

• L'ensemble des fournitures et équipements décrits dans le mémoire technique
• La main d'œuvre pour l'installation, le raccordement et la mise en service
• Les études d'exécution et plans de récolement
• Les essais, mesures et autocontrôles
• Le passage du bureau de contrôle
• La formation du personnel (GTC + alarme incendie)
• Le Dossier des Ouvrages Exécutés (DOE) complet
• La garantie de parfait achèvement (1 an)
• L'évacuation et le traitement des déchets de chantier
• Le nettoyage et la remise en état du site

10.4 Options proposées

Option A — Contrat de maintenance préventive annuel
• 2 visites de maintenance par an (vérification, nettoyage, resserrage, tests)
• Rapport de maintenance avec préconisations
• Montant annuel : [À compléter] € HT/an

Option B — Extension de la GTC
• Extension du système de GTC à d'autres bâtiments de la commune
• Forfait par bâtiment supplémentaire : [À compléter] € HT

10.5 Conditions de règlement

Conformément au CCAG Travaux, le règlement s'effectuera par mandat administratif dans un délai de 30 jours à compter de la réception de la facture. Des acomptes mensuels pourront être demandés sur la base de situations de travaux validées par le maître d'œuvre.`,
      editable: true,
      included: true,
    },
  ];
}
