# DELTA OPPORTUNITIES — version production (Vercel + Neon)

One World. Millions of Opportunities. One Platform.

Plateforme unique : opportunités (emplois, stages, bourses, formations) et compétences (DELTA SKILLS), avec comptes réels et base de données Neon. Il n'y a plus de mode démonstration : le site s'ouvre directement en production.

## Fichiers
- `index.html` + `prod.js` : application (page d'accueil `/`).
- `api/index.js` : API serveur (Vercel) reliée à Neon PostgreSQL ; les tables se créent automatiquement au premier appel.
- `sw.js`, `manifest.webmanifest`, `assets/` : application installable (PWA) et logos.
- `vercel.json`, `package.json`, `.env.example` : configuration. `/production` redirige vers `/`.
- `INSTALLATION-INSCRIPTION.md` : parcours de création de compte et vérification du paiement.

## Comptes
Trois espaces : super administrateur (identifiants définis par les variables d'environnement), organisation, candidat. Les demandes de compte (nom, numéro, selfie, paiement déclaré de 500 FCFA) sont validées par le super administrateur.

## Mise en ligne
Voir `DEPLOIEMENT.md`.
