# DELTA OPPORTUNITIES — Matrice de vérification des 10 fonctionnalités DELTA SKILLS

DELTA SKILLS n'est pas une application séparée : c'est le moteur de compétences intégré (fichier `app.js` côté écran, actions `profile`, `testStart`, `testSubmit`, `recommend`… côté `api/index.js`).

**Légende des statuts**
- **Développé** : le code est écrit et son parcours a été vérifié dans le navigateur avec une API simulée.
- **Non éprouvé sur base réelle** : l'API n'a pas encore tourné sur une vraie base Neon (aucune base n'était disponible pour le test). Chaque fonction doit être essayée après la mise en ligne avant d'être déclarée terminée.
- **Contenu à saisir** : la fonction marche, mais DELTA doit d'abord créer cours et questions (onglet « Contenus pédagogiques » du super administrateur). La base livrée est vide : aucun faux contenu.

| # | Fonctionnalité | Page | Rôle | Données | Fonctionnement réel | Statut |
|---|---|---|---|---|---|---|
| 1 | Profil de compétences | Mon profil | Candidat | `profiles` (diplômes, expériences, langues, qualités), `skills` (compétences techniques et niveau déclaré) | Ajout et retrait de chaque élément, enregistrés dans la base. Alimente le CV, la lettre et la correspondance. | Développé · non éprouvé sur base réelle |
| 2 | Évaluation des compétences | Compétences et tests | Candidat (contenu créé par le super administrateur) | `questions` (QCM par compétence et niveau), `assessments` | Test de 5 à 10 questions tirées au hasard ; la correction se fait côté serveur (les bonnes réponses ne sont jamais envoyées au navigateur). Indisponible sous 5 questions. | Développé · contenu à saisir · non éprouvé sur base réelle |
| 3 | Niveau ou score | Compétences et tests (méthode affichée) | Candidat | `assessments` | Chaque question vaut son niveau (1 à 4 points). Score = points obtenus ÷ points possibles. Moins de 40 % Débutant, 40–64 % Intermédiaire, 65–84 % Avancé, 85 % et plus Validé. | Développé · non éprouvé sur base réelle |
| 4 | Compétences manquantes | Fiche d'une opportunité | Candidat | Exigences de l'annonce (`opportunities.skills`) et profil | Chaque exigence est marquée ✅ acquise, 🟡 partielle ou ❌ absente, avec la source du niveau (test ou déclaré). Exigence de diplôme : recherche dans les diplômes du profil. | Développé · non éprouvé sur base réelle |
| 5 | Recommandation de formations | Fiche d'une opportunité, Mon parcours | Candidat | `modules`, annonces de type « formation » | Pour chaque écart : cours DELTA disponibles et formations publiées par des organisations (recherche par nom de compétence). | Développé · contenu à saisir · non éprouvé sur base réelle |
| 6 | Parcours d'apprentissage personnalisé | Mon parcours | Candidat | `goals`, `modules`, `progress` | « Construire mon parcours » depuis une annonce : pour chaque écart, cours classés par niveau (au-dessus du niveau actuel, jusqu'au niveau requis), puis test. Le score de correspondance est recalculé à chaque visite. | Développé · contenu à saisir · non éprouvé sur base réelle |
| 7 | Cours, exercices et tests | Compétences et tests, Mon parcours | Candidat ; création par le super administrateur | `modules` (cours, exercices avec correction), `questions`, `progress` | Lecture, correction d'exercice à la demande, marquage « terminé », tests. | Développé · contenu à saisir · non éprouvé sur base réelle |
| 8 | Validation progressive | Compétences et tests | Candidat | `assessments` (dernier test de chaque compétence) | Statut Débutant, Intermédiaire, Avancé ou Validé selon le score du dernier test ; une compétence jamais testée reste « déclarée, non testée ». « Validé » exige 85 % à un test. | Développé · non éprouvé sur base réelle |
| 9 | Attestations | Compétences et tests, onglet « Vérifier une attestation » du super administrateur | Candidat ; vérification par le super administrateur | `certificates` (code unique) | Attestation de réussite délivrée automatiquement à partir de 65 %, imprimable, avec code vérifiable par le super administrateur. Mention claire : pas une certification officielle. Pas d'attestation de participation. | Développé · non éprouvé sur base réelle |
| 10 | Correspondance profil / opportunité | Cartes de la recherche, fiche, Candidatures reçues | Candidat ; l'organisation voit celle de ses candidats | Exigences de l'annonce et profil | Score explicable (moyenne des crédits : niveau atteint ÷ niveau requis, plafonné à 100 %), points forts, points à améliorer. Tri possible par meilleure correspondance. Rapprochement par nom de compétence, avec tolérance (« Anglais » ↔ « Anglais professionnel »). | Développé · non éprouvé sur base réelle |

## Parcours de l'exemple « logisticien au Canada »
1 analyse des exigences → 2 comparaison au profil → 3 score explicable → 4 compétences manquantes → 5 cours et exercices → 6 parcours → 7 entraînement → 8 réévaluation (test) → 9 score actualisé automatiquement → 10 préparation de candidature.
Le point 10 (CV, lettre, entretien) est fait par **modèles construits à partir du profil réel, sans IA** : CV imprimable, lettre modifiable, questions d'entretien dérivées des exigences. Rien n'est inventé, mais ce n'est pas un assistant IA.

## Autres fonctionnalités
| Fonction | Statut |
|---|---|
| 14 types d'opportunités, fiches détaillées, statut de vérification | Développé |
| Recherche avancée : mot-clé, type, pays, ville, domaine, modalité, date limite, tri | Développé · non éprouvé sur base réelle |
| Favoris | Développé · non éprouvé sur base réelle |
| Candidatures et suivi (envoyée, en cours d'examen, entretien, retenue, non retenue) | Développé · non éprouvé sur base réelle |
| Notifications dans la plateforme (nouvelle candidature, changement de statut, validation d'organisation) | Développé · non éprouvé sur base réelle |
| Alertes de date limite, nouvelles offres correspondantes, e-mails | Non fait |

## Pas encore fait
Assistant IA, traduction anglaise complète, devises, subdivisions administratives des pays (pays et ville en texte libre), rôles administrateur / mentor / centre de formation / établissement académique, sauvegardes automatisées (activer celles de Neon), limitation des tentatives de connexion, déclaration de présence d'un diplôme par justificatif.
