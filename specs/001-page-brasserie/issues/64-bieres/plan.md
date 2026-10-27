# Implementation Plan: Découvrir les bières de La Sibra (issue #64)

**Branch**: `001-page-brasserie-bieres` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-page-brasserie/issues/64-bieres/spec.md`

**Parent**: epic [`specs/001-page-brasserie/`](../../plan.md). Les décisions d'architecture, de palette, de nommage et de contenu sont prises **là-bas** et ne sont pas redémontrées ici ; ce plan se contente de dérouler la tâche T022 de `../../tasks.md`.

## Summary

Livrer la story P3 de `/la-sibra` : une section « Nos bières » qui distingue la gamme permanente des brassins éphémères, illustrée par la photo de la salle de brassage, et close par le bloc « Où retrouver nos bières ? ».

Approche technique : copier le patron `src/features/landes-fertiles/sections/landes-find-section.astro` (deux `InfoCard` en colonne + photo en colonne adjacente, contenus portés par une constante locale `infoCards`), en l'adaptant à trois contraintes propres à La Sibra :

1. **titre de section** → `Heading as="h2"` comme les autres sections de la page, et non le patron `HeadingBadges` du modèle copié, dont la pastille `Badge variant="tertiary"` rendrait du blanc sur l'orange (2,0:1), proscrit par le contrat de thème ;
2. **photos portrait** → les trois photos du socle sont en 1600×2131 ; la colonne image est bornée en hauteur et recadrée (`object-cover`) pour ne pas dépasser la colonne texte, contrairement à ce qui s'est produit en #60 ;
3. **lieux revendeurs** → une liste HTML de `Tag`, dont un seul (Le Wattignies) est enveloppé dans un `Link` vers `PATH.LE_WATTIGNIES` ; les trois lieux tiers restent des `span` sans lien, conformément à la décision du 2026-09-18.

Aucune dépendance ajoutée, aucun JavaScript ajouté, aucun composant partagé créé ou modifié.

## Technical Context

**Language/Version**: TypeScript 5.9, Astro 5.16, Node ≥ 21

**Primary Dependencies**: Astro 5 (`astro:assets` pour `<Image>`), Tailwind CSS 4, composants partagés `src/components/{section,container,heading,text,info-card,icon,tag,link}.astro`

**Storage**: N/A — site statique

**Testing**: aucun framework de test dans le dépôt. Validation = `astro check` + `astro build` + `eslint` + vérification visuelle 375 px / ≥ 1280 px

**Target Platform**: navigateurs modernes (mobile + desktop), hébergement Cloudflare

**Project Type**: site vitrine statique organisé par features

**Performance Goals**: aucun JS ajouté ; la photo de brassage est servie par `<Image>` en `widths` responsives et `loading="lazy"` (section sous la ligne de flottaison)

**Constraints**:
- contrat de thème : blanc réservé au grand texte sur `primary`/`secondary`, jamais sur `tertiary` ; `Badge variant="tertiary"` proscrit sur la page ;
- ajustements visuels dans la section uniquement — interdiction de retoucher les teintes de `src/styles/global.css` ;
- aucune coordonnée (téléphone, email) affichée : gate #67 ;
- aucun lien externe : les lieux tiers sont nommés sans URL ;
- périmètre strictement limité à `src/features/sibra/sections/sibra-bieres-section.astro` + `src/pages/la-sibra.astro` : aucun composant partagé, aucun autre fichier de la feature, ni `constants.ts` ;
- un seul `h1` sur la page ; la section ajoute exactement un `h2`.

**Scale/Scope**: 1 fichier créé, 1 fichier modifié, 0 dépendance ajoutée, 0 asset ajouté

## Constitution Check

*GATE: passé avant Phase 0, re-vérifié après Phase 1.*

| Principe | Évaluation | Verdict |
|---|---|---|
| I. Contenu d'abord, exactitude obligatoire | Tous les textes (bières, lieux) viennent du fichier source du 2026-09-18, repris sans invention. Aucun lieu ajouté, aucune URL de lieu tiers fabriquée. Aucune coordonnée publiée (gate #67). | ✅ |
| II. Statique et simple par défaut | Aucune dépendance, aucun backend, aucun état. Un composant `.astro` statique réutilisant les composants partagés existants ; contenus en constantes locales. | ✅ |
| III. Performance et SEO non négociables | Photo servie via `<Image>` (WebP responsive, `widths`, `loading="lazy"`) ; aucun JS ajouté. Données structurées et métadonnées déléguées à l'issue #63 — délégation explicite, pas une omission. | ✅ |
| IV. Accessibilité et responsive | `h2` unique pour la section, alt FR descriptif sur la photo, lieux exposés en `<ul>/<li>`, contrastes conformes au contrat de thème, colonne image bornée pour éviter tout débordement à 375 px. | ✅ |
| V. Cohérence de la stack | Patron `landes-find-section.astro` suivi, alias `@/`, build + lint verts avant PR, Conventional Commits, PR vers la branche epic. | ✅ |

**Aucune violation** → section Complexity Tracking sans objet.

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/            # epic — source de vérité
├── spec.md, plan.md, research.md, data-model.md, tasks.md, quickstart.md
├── contracts/{theme.md,page-et-seo.md}
└── issues/
    ├── 59-socle/
    ├── 60-hero/
    └── 64-bieres/                   # cette sous-feature
        ├── spec.md
        ├── plan.md                  # ce fichier
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        ├── contracts/sections.md
        ├── checklists/requirements.md
        └── tasks.md                 # produit par /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── components/                              # INCHANGÉ — réutilisé tel quel
│   ├── section.astro, container.astro, heading.astro, text.astro
│   ├── info-card.astro, icon.astro, tag.astro, link.astro
├── features/sibra/
│   ├── images/sibra-brassage.webp            # INCHANGÉ — livré par #59
│   └── sections/
│       ├── sibra-hero-section.astro          # INCHANGÉ — livré par #60
│       ├── sibra-what-section.astro          # INCHANGÉ — livré par #60
│       ├── sibra-instagram-section.astro     # INCHANGÉ — livré par #60
│       └── sibra-bieres-section.astro        # NOUVEAU (T022)
└── pages/la-sibra.astro                      # MODIFIÉ (T022) — assemblage
```

**Structure Decision**: fichier `sibra-bieres-section.astro` dans le dossier `sections/` déjà créé par #60. Préfixe `sibra-` **sans article** (convention R1 de l'epic) ; le nom `bieres` est sans accent ni majuscule, comme tous les noms de fichiers du dépôt.

## Phase 0 — Research

Voir [research.md](./research.md). Les décisions structurantes (palette, texte source, patron de section, décision « pas de lien vers les lieux tiers ») sont **déjà tranchées dans l'epic** ; la recherche propre à cette issue porte sur cinq points d'adaptation : titre de section, `Tag` cliquable, lisibilité du `Tag` neutre selon le fond de section, cadrage de la photo portrait, et choix des icônes des deux blocs.

## Phase 1 — Design & Contracts

- [data-model.md](./data-model.md) : contenus portés par la section (constantes locales `infoCards` et `revendeurs`), avec leur origine mot à mot dans le texte source.
- [contracts/sections.md](./contracts/sections.md) : contrat du composant de section (nom de fichier, absence de props, structure DOM attendue, classes de thème, invariants d'accessibilité). Les contrats de thème et de route/SEO restent ceux de l'epic : [`../../contracts/theme.md`](../../contracts/theme.md), [`../../contracts/page-et-seo.md`](../../contracts/page-et-seo.md).
- [quickstart.md](./quickstart.md) : comment vérifier l'incrément de bout en bout (build, lint, relecture visuelle aux deux largeurs, contrôles d'accessibilité et de fidélité au texte source).

## Post-Design Constitution Re-check

Re-vérifié après rédaction des artefacts de Phase 1 : aucun principe mis en tension. Les deux écarts au patron copié (titre en `Heading` plutôt qu'en `HeadingBadges`, colonne image bornée) sont des **conséquences** des principes I et IV, pas des dérogations. ✅

## Complexity Tracking

Sans objet — aucune violation de la constitution à justifier.
