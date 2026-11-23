# Mise en ligne : GitHub → Neon → Vercel

## Contenu à publier
Tout le contenu de ce dossier va **à la racine** du dépôt GitHub (pas dans un sous-dossier). Ne jamais publier de fichier `.env` : les secrets se saisissent dans Vercel.

| Adresse après déploiement | Mode | Contenu |
|---|---|---|
| `/` (index.html) | DÉMONSTRATION | V3 + V4 complètes (développement continu, rappels d'abonnement, libération de numéros). Données fictives dans le navigateur, sans base. |
| `/production` | PRODUCTION | V3 : comptes réels via Neon (super administrateur, organisation, candidat). Les modules V4 n'y sont pas encore. |

## 1. GitHub
1. Créez un dépôt (privé recommandé) sur github.com.
2. Envoyez-y tous les fichiers de ce dossier (Add file → Upload files, ou `git push`).

## 2. Neon (base de données, nécessaire seulement pour /production)
1. Sur neon.tech, créez un projet (région proche de vos utilisateurs).
2. Copiez la chaîne de connexion (Connection string, avec `sslmode=require`) : ce sera `DATABASE_URL`.
3. Les tables se créent automatiquement au premier appel de l'API.

## 3. Vercel
1. Sur vercel.com : Add New → Project → importez le dépôt GitHub. Framework : « Other », aucune commande de build.
2. Avant de déployer, dans Settings → Environment Variables, ajoutez :
   - `DATABASE_URL` (chaîne Neon)
   - `SESSION_SECRET` (32 caractères aléatoires minimum)
   - `SUPER_ADMIN_EMAIL` et `SUPER_ADMIN_PASSWORD` (8 caractères minimum)
   - `ORANGE_MONEY_RECEIVER` et `MTN_MONEY_RECEIVER` (numéros marchands recevant les frais)
3. Cliquez sur Deploy. Après toute modification de variable : Redeploy.

## 4. Vérifications
- Ouvrez `/` : la démonstration doit s'ouvrir ; testez l'onglet « Échéances d'abonnement » (compte super administrateur) et la section « Numéros enregistrés » dans « Demandes ».
- Ouvrez `/production` : connectez-vous avec `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD`.
- Utilisez toujours HTTPS (la caméra du selfie l'exige ; Vercel le fournit).

## Limites à connaître
- Le paiement n'est pas automatique : le super administrateur vérifie le transfert dans son compte marchand avant d'accepter.
- Les modules V4 (carrière, développement de l'organisation, rappels d'abonnement, libération de numéros) fonctionnent dans la démonstration ; les porter en production demande de les relier à Neon (tables + API) : étape suivante possible.
- Les rappels d'abonnement ne sont pas envoyés par e-mail ou SMS (affichage dans l'application seulement).
