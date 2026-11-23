# Installation du nouveau parcours de création de compte

## 1. Variables Vercel
Dans **Vercel > Project > Settings > Environment Variables**, définir :

- `DATABASE_URL` : URL de connexion Neon PostgreSQL.
- `SESSION_SECRET` : secret aléatoire d'au moins 32 caractères.
- `SUPER_ADMIN_EMAIL` : e-mail du super administrateur.
- `SUPER_ADMIN_PASSWORD` : mot de passe du super administrateur (8 caractères minimum).
- `ORANGE_MONEY_RECEIVER` : numéro marchand DELTA recevant les paiements Orange Money.
- `MTN_MONEY_RECEIVER` : numéro marchand DELTA recevant les paiements MTN Mobile Money.

Redéployer après avoir enregistré les variables. Les tables `account_requests` et la colonne `users.phone` sont créées automatiquement au premier appel API.

## 2. Parcours du demandeur

1. Choisir Candidat ou Organisation / entreprise.
2. Saisir le nom complet, le mot de passe et sa confirmation.
3. Choisir Orange Money ou MTN Mobile Money et saisir le numéro utilisé pour payer. Ce numéro devient l'identifiant de connexion.
4. Prendre le selfie avec la caméra avant (ou utiliser la sélection de photo si la caméra n'est pas disponible).
5. Cliquer sur **Payer 500 FCFA**. Le numéro marchand configuré s'affiche ; le demandeur effectue le transfert dans son application Mobile Money.
6. Confirmer la déclaration du transfert puis cliquer sur **Créer mon compte**.
7. La demande reste bloquée jusqu'à la décision du super administrateur. Le demandeur peut utiliser **Vérifier ma demande** ou tenter de se connecter avec son numéro et son mot de passe pour connaître le statut.

## 3. Parcours du super administrateur

Dans l'onglet **Demandes**, le super administrateur voit le nom, le rôle, le numéro, l'opérateur, le montant et le selfie. Il vérifie le transfert réel dans son compte marchand, puis choisit :

- **Confirmer le paiement et accepter** : le paiement est marqué vérifié et le compte est créé/activé.
- **Refuser la demande** : le demandeur reçoit le statut et peut recommencer une nouvelle demande avec le même numéro.

## 4. Limite du paiement

Le bouton **Payer 500 FCFA** n'effectue pas lui-même un débit : aucune API marchand Orange Money / MTN MoMo n'est fournie dans le projet source. Cette version affiche le numéro marchand et attend une vérification manuelle par le super administrateur. Pour le débit et la confirmation automatiques, il faudra obtenir les accès API marchands du fournisseur choisi et intégrer son API.

## 5. Sécurité et données

Le mot de passe de la demande est haché côté serveur. Le selfie est réduit côté navigateur puis enregistré dans Neon avec la demande. Les demandes ne sont accessibles qu'au super administrateur authentifié. Publier le site uniquement en HTTPS pour permettre l'accès à la caméra.
