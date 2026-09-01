# Implementation Plan: Page « Les Bières de Charlotte »

**Branch**: `001-page-brasserie` | **Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-page-brasserie/spec.md`

## Summary

Créer la page dédiée à la microbrasserie « Les Bières de Charlotte » (`/les-bieres-de-charlotte`) sur le patron éprouvé des 5 pages de lieux existantes : un dossier `src/features/bieres-de-charlotte/` (sections + images), un thème de couleurs propre (ambre/cuivre inspiré des photos) déclaré dans `global.css` et le type `theme` de `main.astro`, une page `src/pages/les-bieres-de-charlotte.astro` avec métadonnées SEO et JSON-LD `Brewery`, et l'intégration aux points de découverte (header, footer, section lieux de l'accueil). Le sitemap, exigé par FR-010 et la constitution mais absent du site, est ajouté sous forme d'endpoint statique. Aucune nouvelle dépendance.

## Technical Context

**Language/Version**: TypeScript 5.9, composants Astro 5 (`.astro`)

**Primary Dependencies**: Astro 5, Tailwind CSS 4 (`@theme` + variables CSS par `data-theme`), animejs (animations header), Leaflet (carte, composant `leaflet-map.astro` existant), adapter `@astrojs/cloudflare`. Aucune dépendance nouvelle.

**Storage**: N/A — contenu rédactionnel codé en dur dans les sections `.astro`, comme les 5 pages existantes. Images dans `src/features/bieres-de-charlotte/images/` (webp).

**Testing**: `pnpm build` (inclut `astro check`) + `pnpm lint` (ESLint @antfu) ; relecture visuelle mobile/desktop (constitution, workflow) ; comparaison Lighthouse avec une page de lieu existante (SC-004).

**Target Platform**: Web (mobile + desktop), déployé sur Cloudflare (`output: 'server'`, rendu à la demande — configuration existante, non modifiée par cette feature).

**Project Type**: Site vitrine Astro multi-pages, architecture par features (`src/features/<lieu>/{sections,images}` + page `src/pages/<lieu>.astro`).

**Performance Goals**: Parité Lighthouse (perf, a11y, SEO) et poids de page avec les pages de lieux existantes ; images servies en webp responsive via `astro:assets` (`widths`/`sizes`).

**Constraints**: WCAG 2.1 AA (contrastes de la nouvelle palette à valider) ; pas de JS ajouté hors composants existants ; photos sources portrait 3472×4624 (~3,5 Mo) à recadrer/convertir ; coordonnées (FR-011) à faire confirmer par la coopérative avant mise en ligne.

**Scale/Scope**: 1 nouvelle page (~6 sections), 1 thème CSS, 3+1 images optimisées, 4 points d'intégration (header, footer, home, constants), 1 endpoint sitemap + robots, ~10 fichiers créés / ~6 modifiés.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Verdict | Notes |
|---|---|---|
| I. Contenu d'abord, exactitude | ✅ PASS (avec garde-fou) | Texte source fourni = source de vérité ; coordonnées issues de l'archive Wayback marquées « à confirmer » — la confirmation par la coopérative est une condition de mise en ligne (tâche dédiée), pas d'invention. Aucun contenu factice (pas de section avis/FAQ vide). |
| II. Statique et simple | ✅ PASS | Aucune dépendance ajoutée, aucun backend, contenu en dur comme les autres pages. Le sitemap est un simple endpoint générant du XML depuis les constantes. (`output: 'server'` est un état existant du dépôt, hors périmètre.) |
| III. Performance et SEO | ✅ PASS | Webp responsive, title/description/OG via layout existant, JSON-LD `Brewery`, ajout du sitemap (comble un manque existant du site, exigé par FR-010 et ce principe). |
| IV. Accessibilité et responsive | ✅ PASS | Patron des pages existantes (HTML sémantique, alt FR) ; contrastes de la palette validés à la conception (recherche) et à l'implémentation. |
| V. Cohérence de la stack | ✅ PASS | Réutilisation des composants (`Section`, `Container`, `Heading`, `Text`, `Badge`, `InfoCard`, `PlaceCard`, `InstagramFeed`, `LeafletMap`) et des conventions (features/, thèmes `data-theme`, Conventional Commits). |

**Gate initial : PASS.** Aucune violation à justifier.

**Re-check post-design (Phase 1) : PASS.** Le design (research.md R1–R9, data-model.md, contracts/) n'introduit ni dépendance, ni backend, ni contenu factice ; le seul ajout transverse (endpoint sitemap + robots.txt) répond directement au principe III. Garde-fou du principe I maintenu : confirmation des coordonnées = condition de mise en ligne (quickstart.md, « Gate avant mise en ligne »).

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── page-et-seo.md   # URL, métadonnées, JSON-LD, sitemap
│   └── theme.md         # Tokens de couleurs du thème brasserie
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── les-bieres-de-charlotte.astro        # NOUVEAU — page du lieu (layout + sections + JSON-LD Brewery)
│   └── sitemap.xml.ts                       # NOUVEAU — endpoint sitemap (toutes les pages publiques)
├── features/
│   ├── bieres-de-charlotte/                 # NOUVEAU — feature du lieu
│   │   ├── images/
│   │   │   ├── bieres-de-charlotte-boutique.webp    # depuis brasserie-assets/1000016867.jpg
│   │   │   ├── bieres-de-charlotte-brassage.webp    # depuis brasserie-assets/1000016868.jpg
│   │   │   └── bieres-de-charlotte-bouteilles.webp  # depuis brasserie-assets/1000016869.jpg
│   │   └── sections/
│   │       ├── bieres-de-charlotte-hero-section.astro
│   │       ├── bieres-de-charlotte-what-section.astro
│   │       ├── bieres-de-charlotte-boutique-section.astro
│   │       ├── bieres-de-charlotte-bieres-section.astro
│   │       ├── bieres-de-charlotte-tireuse-section.astro
│   │       ├── bieres-de-charlotte-infos-section.astro
│   │       └── bieres-de-charlotte-instagram-section.astro
│   └── home/images/
│       └── les-bieres-de-charlotte-card.webp # NOUVEAU — recadrage paysage pour la carte d'accueil
├── layouts/main.astro                        # MODIFIÉ — union `theme` + 'bieres-de-charlotte'
├── styles/global.css                         # MODIFIÉ — couleurs brasserie + [data-theme='bieres-de-charlotte']
├── components/
│   ├── header.astro                          # MODIFIÉ — 7ᵉ lien de navigation
│   └── footer.astro                          # MODIFIÉ — lien dans la colonne des lieux
├── features/home/sections/home-places-section.astro  # MODIFIÉ — 6ᵉ PlaceCard, grille 2×3
└── utils/constants.ts                        # MODIFIÉ — PATH.LES_BIERES_DE_CHARLOTTE

public/
└── robots.txt                                # NOUVEAU — référence le sitemap
```

**Structure Decision**: architecture par features du dépôt reproduite à l'identique : une feature `bieres-de-charlotte` (sections + images), une page dans `src/pages/`, le thème dans `global.css`/`main.astro`, les intégrations dans les composants partagés. Le sitemap est le seul ajout transverse (exigé par FR-010, absent du site à ce jour).

## Complexity Tracking

> Aucune violation constitutionnelle — section vide.
