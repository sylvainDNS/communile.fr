# Data Model: Page « Les Bières de Charlotte »

Pas de base de données (constitution, principe II) : les « entités » sont du contenu structuré porté par les sections `.astro` (constantes locales, comme dans les pages existantes) et par les fichiers partagés (`constants.ts`, `global.css`). Ce document fixe les valeurs et leur emplacement.

## Entité : Lieu (la brasserie)

| Champ | Valeur | Emplacement | Règles |
|---|---|---|---|
| Nom | Les Bières de Charlotte | header, footer, home card, `<h1>` hero, title SEO, JSON-LD `name` | Nom propre conservé (rachat) ; orthographe exacte partout |
| Slug / URL | `/les-bieres-de-charlotte` | `PATH.LES_BIERES_DE_CHARLOTTE` (`src/utils/constants.ts`) | Stable, dérivé du nom (FR-001) ; unique source des liens internes |
| Thème | `bieres-de-charlotte` | union `theme` de `main.astro`, `[data-theme]` dans `global.css` | Palette distincte des 5 autres (FR-002, SC-005), contrastes AA |
| Description courte | quartier St-Clément, microbrasserie artisanale de la coopérative, horaires | `description` de la page (SEO + JSON-LD) | ≤ 160 caractères utiles, faits du texte source uniquement |
| Adresse | 121 rue du Général Buat, 44000 Nantes | section infos pratiques, JSON-LD `address` | ⚠️ à confirmer par la coopérative avant mise en ligne (FR-011) |
| Repères | entre les églises Saint-Clément et Saint-Donatien ; Chronobus C1 arrêt « Chanzy » | section infos pratiques | idem ⚠️ |
| Géolocalisation | lat/lng géocodées de l'adresse | `LeafletMap` (center + marker), JSON-LD `geo` | Vérifiée visuellement sur la carte ; jamais approximée à la louche |
| Téléphone | 06 33 01 56 63 (`tel:+33633015663`) | infos pratiques, section tireuse (CTA), JSON-LD `telephone` | idem ⚠️ |
| Email | bce.brasserie@gmail.com | infos pratiques, JSON-LD `email` | idem ⚠️ |
| Instagram | https://www.instagram.com/bieresdecharlotte/ | section Instagram (`username="bieresdecharlotte"`), JSON-LD `sameAs` | FR-013 |
| Photos | boutique, salle de brassage, bouteilles | `src/features/bieres-de-charlotte/images/*.webp` + card home | webp optimisé, alt FR descriptif (FR-008) |

### Horaires de la boutique (source de vérité : `brasserie-assets/Texte site internet.md`)

| Jour | Ouverture | Fermeture |
|---|---|---|
| Vendredi | 16:00 | 20:00 |
| Samedi | 11:00 | 20:00 |

Affichés dans : section boutique (proéminents, SC-002), hover de la `PlaceCard` d'accueil, JSON-LD `openingHoursSpecification`. Les horaires de l'archive Wayback (mer–ven 17 h 30–19 h 30) sont périmés et NE DOIVENT PAS être utilisés (spec, Assumptions).

## Entité : Gamme de bières

Constantes locales de `bieres-de-charlotte-bieres-section.astro` (patron `infoCards` de `landes-find-section.astro:19-31`).

| Champ | Type | Notes |
|---|---|---|
| nom | string | Blonde, Ambrée, Triple, Blanche, Carlota |
| description | string | Depuis le texte source uniquement |
| caractère | permanente \| éphémère | Deux blocs distincts (US3) |

Contenus :
- **Gamme permanente** : Blonde, Ambrée, Triple, Blanche — « de la blonde de soif à l'emblématique Carlota » ; mise en avant Carlota : recette héritée de Charlotte, inchangée depuis 15 ans.
- **Brassins éphémères** : créations saisonnières du brasseur Simon — « inédites, surprenantes mais toujours délicieuses ».

## Entité : Service (prêt de tireuse)

Contenu de `bieres-de-charlotte-tireuse-section.astro` :

| Champ | Valeur |
|---|---|
| Principe | prêt de tireuse pour l'achat d'un fût |
| Occasions | anniversaire, séminaire d'entreprise, week-end entre copaines |
| Réservation | appeler la brasserie (lien `tel:+33633015663`) |

## Relations / points d'intégration

```text
constants.ts (PATH.LES_BIERES_DE_CHARLOTTE)
  ├── header.astro (links[])            — nav desktop + mobile (FR-009)
  ├── footer.astro (colonne lieux)      — FR-009
  ├── home-places-section.astro (PlaceCard) — FR-009, horaires au hover
  ├── what-section (liens vers les autres lieux) — FR-007
  └── sitemap.xml.ts                    — FR-010
global.css ([data-theme='bieres-de-charlotte']) ← main.astro (Props.theme)
```

## Transitions d'état

Contenu statique — pas d'état. Seul jalon : **coordonnées non confirmées → confirmées par la coopérative** (condition de mise en production, SC-006).
