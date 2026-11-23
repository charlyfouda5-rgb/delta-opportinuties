# Mise en ligne : GitHub → Neon → Vercel

Le contenu de ce dossier va **à la racine** du dépôt GitHub. Ne publiez jamais de fichier `.env` : les secrets se saisissent dans Vercel.

## 1. GitHub
Créez un dépôt (privé recommandé) sur github.com et envoyez-y tous les fichiers (Add file → Upload files, ou `git push`).

## 2. Neon
1. Sur neon.tech, créez un projet.
2. Copiez la chaîne de connexion (avec `sslmode=require`) : ce sera `DATABASE_URL`.
Les tables sont créées automatiquement au premier appel de l'API.

## 3. Vercel
1. Add New → Project → importez le dépôt. Framework : « Other », sans commande de build.
2. Settings → Environment Variables, ajoutez :
   - `DATABASE_URL` : chaîne Neon
   - `SESSION_SECRET` : 32 caractères aléatoires minimum
   - `SUPER_ADMIN_EMAIL` et `SUPER_ADMIN_PASSWORD` : 8 caractères minimum
   - `ORANGE_MONEY_RECEIVER` et `MTN_MONEY_RECEIVER` : numéros marchands qui reçoivent les frais
3. Deploy. Après toute modification de variable : Redeploy.

## 4. Vérification
Ouvrez l'adresse Vercel (`/`) et connectez-vous avec `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD`. Utilisez HTTPS (la caméra du selfie l'exige ; Vercel le fournit).

## Limites
- Le paiement n'est pas automatique : le super administrateur vérifie le transfert dans son compte marchand avant d'accepter.
- Les rappels d'abonnement, le module « Développement de l'organisation » et la libération de numéros existaient seulement dans la démonstration retirée ; ils ne sont pas dans cette version.
