# Implementation Plan: Tarifs et plaquette du Labo Diva

**Branch**: `004-labo-diva-tarifs-plaquette` | **Date**: 2026-10-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-labo-diva-tarifs-plaquette/spec.md`

## Summary

Changement de contenu sur la page `/le-labo-diva`, dans la section « Privatisation et location ». Il porte sur un seul composant : on garde un seul badge tarifaire (« À partir de 20€ HT / heure »), le lien de la plaquette pointe vers `LABO_DIVA_2026_10_27.pdf` (déjà en ligne et vérifié) et la phrase en double de la description disparaît. Aucun nouveau composant, aucune dépendance, aucun changement de structure.

## Technical Context

**Language/Version**: TypeScript, Astro 7.3 (composants `.astro`)

**Primary Dependencies**: aucune nouvelle ; on réutilise les composants `Badge`, `InfoCard` et `Text`

**Storage**: N/A. La plaquette est hébergée hors dépôt (`r2.communile.fr/downloads/`), déjà publiée

**Testing**: pas de suite de tests automatisés dans le dépôt. Validation par `pnpm build` (inclut `astro check`), `pnpm lint`, contrôles `grep` sur le HTML construit, `curl` sur le PDF et relecture visuelle mobile/desktop (voir [quickstart.md](./quickstart.md))

**Target Platform**: site statique prérendu, servi par Cloudflare Workers (static assets)

**Project Type**: site vitrine statique (single project)

**Performance Goals**: aucune régression ; le poids de la page baisse légèrement (deux badges en moins)

**Constraints**: le libellé et les attributs du lien (`download`, `target="_blank"`) sont conservés (FR-007), tout comme les autres badges (FR-003)

**Scale/Scope**: 1 fichier source, environ 5 lignes modifiées

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Statut | Note |
|---|---|---|
| I. Contenu d'abord, exactitude | ✅ | Le changement corrige des tarifs périmés, un `>` parasite et une phrase en double. Le PDF est vérifié par empreinte MD5. La cohérence des tarifs internes au PDF reste à contrôler à l'œil (hypothèse de la spec) |
| II. Statique et simple | ✅ | Contenu statique, aucune dépendance |
| III. Performance et SEO | ✅ | Pas d'image ni de JS ajoutés ; métadonnées et sitemap intacts |
| IV. Accessibilité et responsive | ✅ | Relecture visuelle mobile/desktop prévue (SC-004) ; le lien garde son libellé explicite |
| V. Cohérence de la stack | ✅ | Édition d'un composant existant ; `pnpm build` et `pnpm lint` exigés |
| Contraintes : assets dans le dépôt | ⚠️ existant | Le PDF est sur `r2.communile.fr`, hors dépôt. C'est une pratique antérieure (plaquettes Labo Diva et Carte Postale) que cette feature n'introduit pas, sur un domaine propre à la coopérative (pas un CDN tiers). Voir research R3 |

**Gate** : passe. Aucune violation introduite.

**Re-check post-design** : inchangé, passe.

## Project Structure

### Documentation (this feature)

```text
specs/004-labo-diva-tarifs-plaquette/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── public-surface.md
├── checklists/
│   └── requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/features/le-labo-diva/sections/
└── le-labo-diva-location.astro   # badgesLocation, href de la plaquette, texte de la carte « Location d'une salle au Labo »
```

**Structure Decision**: un seul fichier est modifié. La page `src/pages/le-labo-diva.astro` n'est pas modifiée.

## Complexity Tracking

Aucune violation à justifier.
