# Implementation Plan: Socle technique La Sibra (issue #59)

**Branch**: `001-page-brasserie-socle` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-page-brasserie/issues/59-socle/spec.md`

**Parent**: epic [`specs/001-page-brasserie/`](../../plan.md). Les décisions d'architecture, de palette, de nommage et de contenu sont prises **là-bas** et ne sont pas redémontrées ici ; ce plan se contente de dérouler les tâches T001–T007 de `../../tasks.md`.

## Summary

Poser la fondation bloquante de la page `/la-sibra` : quatre images dérivées des photos fournies par la coopérative, deux décorations SVG versionnées, une constante de route, un thème de couleurs conforme à la charte (vert / rose / orange + neutre, huit tokens), l'ouverture du typage du layout et une page squelette qui rend en 200 avec son thème. Aucune section de contenu n'est produite ici.

Approche technique : suivre à l'identique les mécanismes déjà en place dans le dépôt (bloc `@theme` + mapping `[data-theme='…']` dans `src/styles/global.css`, feature folder `src/features/<lieu>/{images,sections}/`, page `src/pages/<url>.astro` enveloppée par `src/layouts/main.astro`). Les images sont converties hors build avec ImageMagick, puis servies par le pipeline `astro:assets` comme les autres photos du site.

## Technical Context

**Language/Version**: TypeScript 5.9, Astro 5.16, Node ≥ 21

**Primary Dependencies**: Astro 5 (`astro:assets` pour l'optimisation d'images), Tailwind CSS 4 (`@tailwindcss/vite`), adapter `@astrojs/cloudflare`

**Storage**: N/A — site statique, aucun stockage applicatif

**Testing**: aucun framework de test dans le dépôt. Validation = `pnpm build` (inclut `astro check`) + `pnpm lint` + vérification visuelle mobile/desktop

**Target Platform**: navigateurs modernes (desktop + mobile), hébergement Cloudflare

**Project Type**: site vitrine statique, organisé par features

**Performance Goals**: page légère (principe III) — images < 300 Ko pièce, pas de JS ajouté par ce socle

**Constraints**:
- valeurs de la charte **non altérables** (contrat de thème) ; les contrastes se gèrent par des règles d'usage, pas en corrigeant les teintes ;
- interdiction de modifier les cinq thèmes existants de `global.css` ;
- les photos sources (`brasserie-assets/`) et les SVG proposés (`specs/001-page-brasserie/assets/`) restent hors versionnement ; seuls les dérivés entrent dans `src/` ;
- `sharp` n'est pas résolvable en CLI hors du pipeline Astro → conversion via ImageMagick / `cwebp`, présents localement.

**Scale/Scope**: 1 route, 1 thème, 4 images, 2 SVG, 3 fichiers existants touchés

## Constitution Check

*GATE: passé avant Phase 0, re-vérifié après Phase 1.*

| Principe | Évaluation | Verdict |
|---|---|---|
| I. Contenu d'abord, exactitude obligatoire | La description de page est **provisoire et factuelle** (pas de lorem ipsum, pas de coordonnées inventées) ; aucune donnée de contact n'est publiée à ce stade — le gate #67 reste devant. | ✅ |
| II. Statique et simple par défaut | Aucune dépendance ajoutée, aucun backend, aucun JS. Conversion d'images faite hors build avec un outil déjà installé sur le poste. | ✅ |
| III. Performance et SEO non négociables | Images converties en WebP ~1600 px q80 ; page indexable avec title + description. SEO définitif (OG, JSON-LD, sitemap) explicitement délégué aux issues #64/#66 — pas une omission. | ✅ |
| IV. Accessibilité et responsive | Contrastes traités en amont : le contrat de thème fixe des règles d'usage (pas de blanc courant sur fonds bruts, jamais de blanc sur orange) que les sections suivantes devront respecter. Décorations `aria-hidden` côté sections. | ✅ |
| V. Cohérence de la stack | Mêmes mécanismes que les cinq thèmes existants, même arborescence de feature, `pnpm build` + `pnpm lint` verts avant PR, Conventional Commits. | ✅ |

**Aucune violation** → section Complexity Tracking sans objet.

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/            # epic — source de vérité
├── spec.md, plan.md, research.md, data-model.md, tasks.md, quickstart.md
├── contracts/{theme.md,page-et-seo.md}
└── issues/
    └── 59-socle/                    # cette sous-feature
        ├── spec.md
        ├── plan.md                  # ce fichier
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        ├── contracts/assets.md
        ├── checklists/requirements.md
        └── tasks.md                 # produit par /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── features/
│   ├── home/images/
│   │   └── la-sibra-card.webp          # NOUVEAU (T002)
│   └── sibra/                          # NOUVEAU dossier de feature
│       └── images/
│           ├── sibra-boutique.webp     # NOUVEAU (T001)
│           ├── sibra-brassage.webp     # NOUVEAU (T001)
│           ├── sibra-bouteilles.webp   # NOUVEAU (T001)
│           ├── sibra-hero-decoration.svg  # NOUVEAU (T007)
│           └── sibra-what-ornament.svg    # NOUVEAU (T007)
├── layouts/main.astro                  # MODIFIÉ (T005) — union Props['theme']
├── pages/la-sibra.astro                # NOUVEAU (T006)
├── styles/global.css                   # MODIFIÉ (T004) — 8 tokens + mapping
└── utils/constants.ts                  # MODIFIÉ (T003) — PATH.LA_SIBRA
```

**Structure Decision**: organisation par feature déjà en place dans le dépôt (`src/features/{wattignies,landes-fertiles,le-labo-diva,bar-ile,la-carte-postale,home}`). La feature du lieu s'appelle `sibra` (sans article, convention R1), la page `la-sibra.astro` (dérivée de l'URL). L'image de carte d'accueil vit dans `src/features/home/images/` parce qu'elle appartient à l'écran d'accueil, pas à la page du lieu — cohérent avec les cinq cartes existantes.

## Phase 0 — Research

Voir [research.md](./research.md). Les décisions structurantes (nommage R1, palette R2, décorations R3-bis, optimisation d'images R6) sont **déjà tranchées dans l'epic** ; la recherche propre à cette issue se limite à l'outillage de conversion et à la stratégie de recadrage paysage.

## Phase 1 — Design & Contracts

- [data-model.md](./data-model.md) : les quatre « entités » manipulées ici (route, thème, asset image, décoration vectorielle) avec leurs attributs et règles de validation.
- [contracts/assets.md](./contracts/assets.md) : contrat de livraison des fichiers images/SVG (noms, dimensions, poids, invariants). Les contrats de thème et de route/SEO restent ceux de l'epic : [`../../contracts/theme.md`](../../contracts/theme.md), [`../../contracts/page-et-seo.md`](../../contracts/page-et-seo.md).
- [quickstart.md](./quickstart.md) : comment vérifier le socle de bout en bout.

## Post-Design Constitution Re-check

Re-vérifié après rédaction des artefacts de Phase 1 : aucun principe n'est mis en tension par la conception retenue (pas de dépendance nouvelle, pas de contenu factice, budget image respecté, mécanismes existants réutilisés). ✅

## Complexity Tracking

Sans objet — aucune violation de la constitution à justifier.
