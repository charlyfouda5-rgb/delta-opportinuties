# DELTA OPPORTUNITIES (+ DELTA SKILLS) — v3

Une seule plateforme : opportunités + compétences, avec **DEMO MODE — TEST COMPLET** (sans serveur) et un mode **PRODUCTION** (Neon + Vercel).

## Démarrage immédiat (sans serveur)
- Ouvrir `DEMO-un-seul-fichier.html` (double-clic) **ou** `index.html`, puis toucher **ACCÉDER À LA DÉMONSTRATION**.
- Aucun mot de passe, aucun réseau, aucune base distante. Les données restent dans le navigateur ; « Réinitialiser les données fictives » sur l'accueil remet tout à zéro.

## Trois comptes principaux (englobant les 10 rôles)
| Compte | Identifiant de démonstration | Espaces (rôles) à l'intérieur |
|---|---|---|
| **Super administrateur** | superadmin@delta.demo | Super administrateur, Administrateur |
| **Organisations et autres** | organisation@delta.demo | Entreprise, Recruteur, Formateur, Organisme de formation, Mentor, Partenaire institutionnel |
| **Visiteur** | visiteur@delta.demo | Candidat, Apprenant |

Le sélecteur « Espace » dans l'en-tête permet de passer d'un espace à l'autre **à l'intérieur du même compte** uniquement (un compte Organisations ne peut pas ouvrir l'espace Super administrateur ni Visiteur). Les permissions restent celles de chaque espace. Un compte créé par inscription libre (Visiteur ou Organisation/autre) a un seul espace. Les anciens identifiants par rôle (entreprise@, recruteur@, candidat@…) restent acceptés dans le champ de connexion.
Le mode production a déjà trois comptes (super administrateur, organisation, candidat/visiteur) : la correspondance est directe.

## Interface
Icônes emoji sur l'écran des comptes (🔱 Super administrateur, 🏫 Organisations et autres, 🎓 Visiteur, et une icône par espace) et icônes SVG intégrées pour les onglets, indicateurs et graphiques ; interface adaptée au téléphone.

## Création de compte : validation obligatoire par le super administrateur
Dans le mode DEMO, aucun utilisateur ne peut créer directement un compte. Le parcours est le suivant :
1. L'utilisateur choisit son espace (candidat, apprenant, entreprise, recruteur, formateur, organisme de formation, mentor ou partenaire institutionnel).
2. Il saisit son nom complet, son mot de passe et sa confirmation.
3. Il prend un selfie avec la caméra avant. La photo est jointe à la demande et visible dans l'espace du super administrateur.
4. Il choisit Orange Money ou MTN Mobile Money, saisit le numéro correspondant et clique sur **Payer 500 FCFA**.
5. Il clique sur **Créer mon compte** : la demande est transmise à l'onglet **Demandes** du super administrateur. Le compte n'est pas accessible pendant l'attente.
6. Le super administrateur examine le nom, le selfie, le moyen et le numéro de paiement, puis clique sur **Autoriser** ou **Refuser**. Le demandeur voit le résultat à l'écran lorsqu'il se reconnecte avec son numéro et son mot de passe.
7. En cas de refus, le bouton **Reprendre ma création de compte** rouvre le formulaire. L'utilisateur doit reprendre le selfie, saisir/confirmer son mot de passe et refaire l'étape de paiement avant de renvoyer une nouvelle demande.
8. En cas d'acceptation, le demandeur voit un message de félicitations, confirme la notification, puis finalise la création de son compte.

**Important :** le paiement de 500 FCFA est simulé dans le mode DEMO ; aucun argent n'est débité et aucun transfert Orange Money / MTN MoMo n'est exécuté. Le selfie et les demandes de la démonstration restent dans le stockage local du navigateur et ne sont pas envoyés sur Internet. En PRODUCTION (Vercel + Neon), les demandes sont enregistrées dans `account_requests` avec le selfie, le rôle, le numéro, l'opérateur, le statut et un mot de passe haché. Le super administrateur dispose d'un onglet **Demandes** avec les boutons **Confirmer le paiement et accepter** ou **Refuser**. Après refus, le même numéro peut déposer une nouvelle demande ; le demandeur peut vérifier le statut avec son numéro et son mot de passe. Après acceptation, le compte est créé et le numéro sert d'identifiant de connexion.

**Paiement en production :** le bouton affiche le numéro marchand configuré et recueille une déclaration de paiement ; il ne débite pas automatiquement. Le super administrateur doit vérifier le transfert réel de 500 FCFA dans son compte marchand avant de cliquer sur « Confirmer le paiement et accepter ». Renseigner `ORANGE_MONEY_RECEIVER` et `MTN_MONEY_RECEIVER` dans Vercel. Une intégration automatique nécessitera ensuite un contrat/API de paiement Orange Money ou MTN MoMo et ses identifiants marchands. Le selfie est redimensionné dans le navigateur puis stocké dans Neon avec la demande.

## Contenu de la démonstration (toutes données FICTIVES)
150 opportunités (50 emplois, 30 stages, 20 bourses, 15 concours, 20 appels à projets, 15 incubations), 25 formations, 15 évaluations, 57 comptes (10 entreprises, 10 organismes, 30 candidats), 121 candidatures, 10 portfolios, 60 résultats d'évaluation, 40+ inscriptions, abonnements simulés.

## Fonctionnalités opérationnelles
Connexion, inscription fictive, 3 comptes / 10 espaces, publication-modification-suppression d'offres, recherche et filtres (type, pays, secteur, niveau, modalité, compétence, expérience, date limite, rémunération, tri), favoris, candidature, changement de statut (le candidat est notifié), entretiens, recherche de candidats, CV et portfolio, compétences, correspondance profil/offre (ex. 6/10 avec manques, formations et évaluations recommandées), formations (création, modules, inscription, progression, attestation fictive), évaluations (création, passage, score/niveau), mentorat, suspension/activation, changement de rôle (super administrateur), abonnements simulés, export JSON, photo/logo/CV (250 Ko max, gardés dans le navigateur), référentiels pays/langues/secteurs gérés par le super administrateur, FR/EN.
**Tableaux de bord** : chaque espace a ses indicateurs, histogrammes, courbes, camemberts, jauges, entonnoirs et tableaux. Le super administrateur a 8 tableaux : vue d'ensemble, performance, recrutement, formation et compétences, utilisateurs, abonnements et revenus (simulés), qualité et modération, géographie.

## Architecture
- `core.js` : couche de services `S.*` (données, rôles, permissions, règles). Seul fichier qui touche au stockage (`localStorage`, clé `do_demo_v1`).
- `ui.js` : interface ; n'appelle que `S.*`. Aucun `fetch`.
- `production.html` + `prod.js` + `api/index.js` : mode PRODUCTION, jeton et données distincts de la démonstration.
- `tests.js` : `node tests.js` lance 14 scénarios sur une copie temporaire (aussi dans l'appli : Super administrateur → Tests automatiques).

## Production (Vercel + Neon)
Variables : `DATABASE_URL`, `SESSION_SECRET` (32+ caractères), `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `ORANGE_MONEY_RECEIVER`, `MTN_MONEY_RECEIVER`. Les deux numéros marchands de paiement sont à configurer avant d'ouvrir les inscriptions. Déposer le dossier à la racine du dépôt, importer dans Vercel, puis redéployer ; les tables `users` et `account_requests` ainsi que les autres tables se créent au premier appel.
Connexion future des espaces à la base : réécrire `core.js` en gardant les signatures `S.*` (appels vers `/api`) ; l'interface ne change pas.

## Nécessite encore un serveur / API
Persistance réelle des 10 espaces (la production n'en couvre que 3 pour l'instant), authentification sécurisée, paiements réels, e-mails et notifications externes, stockage réel des fichiers, vidéos de cours, IA, devises, certification officielle (attestations fictives). Limites : messages d'erreur du cœur et noms de compétences en français ; une langue ajoutée au référentiel n'a pas de traduction d'interface tant qu'elle n'est pas écrite ; les tendances sur 30 jours (visites, inscriptions) sont simulées.

## V4 — Espace professionnel permanent (extension, `growth.js`)
La V3 est intégralement conservée (comptes, inscription validée par le super administrateur, identité visuelle, tableaux de bord). `growth.js` s'y ajoute (chargé par `index.html` et inclus dans `DEMO-un-seul-fichier.html`) ; données dans une clé séparée `do_growth_v1`, effacée par « Réinitialiser » et incluse dans l'export JSON (`developpement`).

| Espace | Nouveaux onglets |
|---|---|
| Candidat, Apprenant | Ma carrière (objectifs, parcours, plan de compétences, réalisations, bilans), Réseau (contacts avec date de suivi, recommandations), Veille et alertes (compte en direct des offres correspondantes), Mon espace de valeur, Événements et communauté |
| Entreprise, Organisme, Partenaire | **Développement de l'organisation** (santé de l'organisation ; OKR ; partenaires ; fournisseurs ; appels d'offres ; financements ; clients/prospects ; équipe et intégration après recrutement ; plan de formation interne ; visibilité), Mon espace de valeur, Événements et communauté |
| Recruteur | Mon espace de valeur, Événements et communauté |
| Formateur, Mentor | Réseau, Mon espace de valeur, Événements et communauté |

Fidélisation : rappels d'échéances sur le tableau de bord, série de jours d'activité, niveaux (reconnaissance interne), bilan de valeur téléchargeable (actions réalisées, abonnement ÷ actions).
Limites : mode DEMO seulement (le mode production reste en V3) ; événements et communautés = catalogue FICTIF ; pas de réseau entre utilisateurs réels, de messagerie, d'annuaire partagé de fournisseurs ni de paiement réel sans serveur.

### Rappels de fin d'abonnement (V4.1)
- Chaque utilisateur (hors super administrateur et administrateur) a une date de fin d'abonnement. Dans la démonstration, les dates sont simulées (étalées autour d'aujourd'hui) ; un compte créé par inscription reçoit 30 jours.
- Rappel automatique : bandeau visible sur tous les onglets à 30 jours, rouge à 7 jours, « dernier jour » et « expiré », avec bouton « Renouveler (simulation) » (+30 jours, aucun paiement). L'onglet Notifications affiche l'historique.
- Super administrateur : onglet **Échéances d'abonnement** (compteurs expirés / ≤ 7 j / ≤ 30 j / actifs, répartition, recherche et filtre par état, export CSV), boutons Rappeler, Rappel groupé, +30 j / +90 j / +1 an, date libre. Un bandeau lui signale aussi les échéances proches.
- Limite : sans serveur, aucun e-mail ni SMS n'est envoyé ; le rappel s'affiche à l'ouverture de l'application. En production, les dates viendraient des paiements réels et l'envoi e-mail/SMS demande un service externe.

### Libération d'un numéro accepté (V4.2)
Super administrateur → **Demandes** → section **Numéros enregistrés** : chaque numéro (téléphone et paiement) retenu lors d'une demande de création de compte est listé avec le nom, l'espace et le statut. Le bouton **Libérer ces numéros** (avec confirmation) le rend à nouveau disponible pour une nouvelle inscription. Si un compte a déjà été créé avec ce numéro, il est suspendu et détaché du numéro (il n'est pas supprimé) ; une demande acceptée mais non finalisée est annulée. L'action est inscrite au journal. Un test automatique (scénario 10) couvre le cas. Cette libération s'ajoute à la réinitialisation des numéros signalés comme doublons, qui reste inchangée.
