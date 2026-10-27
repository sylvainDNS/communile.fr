# Data Model — Socle technique La Sibra (issue #59)

Cette issue ne manipule pas de données métier (le modèle du lieu — horaires, bières, coordonnées — est décrit dans [`../../data-model.md`](../../data-model.md) et consommé par les issues #60–#66). Les « entités » ci-dessous sont les artefacts structurels que le socle introduit.

## 1. Route du lieu

| Attribut | Valeur | Règle |
|---|---|---|
| Clé symbolique | `LA_SIBRA` | avec article (dérive de l'URL) — R1 |
| Chemin | `/la-sibra` | minuscules, tirets, pas de slash final |
| Emplacement | objet `PATH` de `src/utils/constants.ts` | ajoutée **après** `A_LA_CARTE_POSTALE`, avant les entrées à ancre `/#…` |
| Consommateurs | header, footer, carte d'accueil, sitemap, liens inter-lieux | issues #64/#66 — pas ici |

**Validation** : aucune URL `/la-sibra` écrite en dur ailleurs que dans `PATH` et le nom de fichier de la page.

## 2. Thème `sibra`

Huit couleurs nommées + un mapping sémantique. Valeurs **exactes**, reprises de [`../../contracts/theme.md`](../../contracts/theme.md) :

| Token | Valeur | Rôle |
|---|---|---|
| `--color-sibra-green` | `oklch(0.6214 0.1490 120.95)` | → `--theme-primary` |
| `--color-sibra-green-accent` | `oklch(0.5214 0.1490 120.95)` | → `--theme-primary-accent` |
| `--color-sibra-pink` | `oklch(0.6469 0.1663 1.60)` | → `--theme-secondary` |
| `--color-sibra-pink-accent` | `oklch(0.5469 0.1663 1.60)` | → `--theme-secondary-accent` |
| `--color-sibra-orange` | `oklch(0.7880 0.1707 69.98)` | → `--theme-tertiary` |
| `--color-sibra-orange-accent` | `oklch(0.6880 0.1707 69.98)` | → `--theme-tertiary-accent` |
| `--color-sibra-neutral` | `oklch(0.1292 0.0415 265.15)` | → `--theme-quaternary` |
| `--color-sibra-neutral-accent` | `oklch(0.0501 0.0086 264.05)` | → `--theme-quaternary-accent` |

**Règles de validation** :
- les accents chromatiques sont la **même teinte et le même chroma**, luminance − 0,10 ; le neutre reprend la valeur d'accent commune aux autres thèmes ;
- déclaration dans le bloc `@theme` existant (section commentée `/* La Sibra */`), mapping dans `@layer base` sous `[data-theme='sibra']` ;
- les dérivés `-light` / `-dark` sont produits automatiquement par le bloc `@theme inline` en place → **rien à ajouter** ;
- aucune modification des cinq thèmes existants.

**Règles d'usage (contraste, WCAG 2.1 AA)** — à respecter par toutes les sections à venir :

| Fond | Blanc | `foreground` | Autorisé |
|---|---|---|---|
| primary (vert) | 3,5:1 | 5,1:1 | blanc **grand texte** seulement |
| primary-accent | 5,2:1 | — | blanc en texte courant |
| secondary (rose) | 3,6:1 | 5,0:1 | blanc **grand texte** seulement |
| secondary-accent | 5,4:1 | — | blanc en texte courant |
| tertiary (orange) | **2,0:1 ✗** | 8,9:1 | **jamais** de texte blanc |
| tertiary-accent | 3,0:1 | 7,0:1 | décorations ; blanc en grand texte seulement |

→ `Badge variant="tertiary"` est **proscrit** sur cette page (il rend `bg-tertiary text-white`).

## 3. Valeur de thème du layout

| Attribut | Valeur |
|---|---|
| Emplacement | union `Props['theme']` de `src/layouts/main.astro` |
| Valeur ajoutée | `'sibra'` (sans article — c'est un identifiant de thème, R1) |
| Invariant | l'ordre de l'union suit l'ordre d'ouverture des lieux ; `'sibra'` en dernier |

## 4. Asset image

| Fichier | Source | Traitement | Destination |
|---|---|---|---|
| `sibra-boutique.webp` | `brasserie-assets/1000016867.jpg` | `-auto-orient -resize 1600x -quality 80` | `src/features/sibra/images/` |
| `sibra-brassage.webp` | `brasserie-assets/1000016868.jpg` | idem | `src/features/sibra/images/` |
| `sibra-bouteilles.webp` | `brasserie-assets/1000016869.jpg` | idem | `src/features/sibra/images/` |
| `la-sibra-card.webp` | `brasserie-assets/1000016867.jpg` | `-crop 3472x1111+0+2350 -resize 1280x -quality 80` | `src/features/home/images/` |

**Validation** : chaque fichier < 300 Ko ; ratio de la carte = 3,125:1 exact ; aucune déformation (pas de `resize` avec `!`) ; les sources restent hors dépôt.

## 5. Décoration vectorielle

| Fichier | Motif | Teinte d'usage prévue (sections ultérieures) |
|---|---|---|
| `sibra-hero-decoration.svg` | bulles | `text-secondary-accent` (haut-gauche), `text-primary-accent` (bas-droit, `rotate-180`) |
| `sibra-what-ornament.svg` | trois disques | `text-primary-accent` sur fond `primary` |

**Validation** : remplissages en `currentColor` ; import comme composant Astro fonctionnel ; la classe `text-*-accent` change effectivement la couleur rendue.
