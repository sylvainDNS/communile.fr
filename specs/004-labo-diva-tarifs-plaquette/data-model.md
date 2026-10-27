# Data Model: Tarifs et plaquette du Labo Diva

Pas de données persistées. Le « modèle » se limite au contenu statique de la section « Privatisation et location ».

## Badges de la carte « Location d'une salle au Labo »

Liste ordonnée de libellés (tableau `badgesLocation`).

| # | Avant | Après |
|---|---|---|
| 1–7 | Salle de 45m2, Vidéo-projecteur, Paperboard, Wifi, Petit déjeuner, Collation, Déjeuner | inchangé |
| 8 | À partir de >20€ HT/heure | **À partir de 20€ HT / heure** |
| 9 | À partir de 75€ HT/ demi-journée | *supprimé* |
| 10 | À partir de 140€ HT/ journée | *supprimé* |

Règles :
- 8 badges exactement, dont 1 seul tarifaire (FR-001, FR-002) ;
- les badges de la carte « Privatisation du Labo Diva » (`badgesPrivatisation`) ne changent pas (FR-003).

## Lien de la plaquette

| Attribut | Avant | Après |
|---|---|---|
| href | `https://r2.communile.fr/downloads/LABO_DIVA_2026_06_11.pdf` | `https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf` |
| libellé | Télécharger notre plaquette détaillée ! | inchangé |
| `download`, `target="_blank"`, classes | présents | inchangés |

## Description de la carte « Location d'une salle au Labo »

Suppression du fragment dupliqué (voir [research.md R2](./research.md#r2--correction-de-la-phrase-en-double)).
