# Implementation Plan: Découvrir La Sibra — hero, « c'est quoi ? », Instagram (issue #60)

**Branch**: `001-page-brasserie-hero` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-page-brasserie/issues/60-hero/spec.md`

**Parent**: epic [`specs/001-page-brasserie/`](../../plan.md). Les décisions d'architecture, de palette, de nommage et de contenu sont prises **là-bas** et ne sont pas redémontrées ici ; ce plan se contente de dérouler les tâches T008–T012 de `../../tasks.md`.

## Summary

Livrer le premier incrément publiable de `/la-sibra` : trois sections de feature (hero, « c'est quoi ? », Instagram) assemblées dans la page, en remplacement du bloc provisoire de vérification des décorations posé par le socle (#59).

Approche technique : copier les patrons éprouvés de `src/features/la-carte-postale/sections/` (hero à décorations SVG en coin, section « what » `variant="primary"` en deux colonnes, section Instagram), en les adaptant à trois contraintes propres à La Sibra :

1. **pas de logo** → motif des trois disques de la charte en SVG inline, `aria-hidden`, annoté `TODO logo` ;
2. **contrastes de la charte** → le vert `primary` ne porte du blanc qu'en grand texte ; le paragraphe de présentation passe donc en `text-foreground` (5,1:1) là où La Carte Postale utilisait `color="white"` ;
3. **liens internes** → la mention de disponibilité (FR-007 de l'epic) pointe vers les autres lieux via `PATH.*`, jamais d'URL en dur.

Aucune dépendance ajoutée, aucun JavaScript ajouté (hors iframe Instagram déjà utilisée par les cinq autres pages de lieu).

## Technical Context

**Language/Version**: TypeScript 5.9, Astro 5.16, Node ≥ 21

**Primary Dependencies**: Astro 5 (`astro:assets` pour `<Image>`, import de SVG en composant), Tailwind CSS 4, composants partagés `src/components/{section,container,heading,text,link,instagram-feed}.astro`

**Storage**: N/A — site statique

**Testing**: aucun framework de test dans le dépôt. Validation = `astro check` + `astro build` + `eslint` + vérification visuelle 375 px / ≥ 1280 px

**Target Platform**: navigateurs modernes (mobile + desktop), hébergement Cloudflare

**Project Type**: site vitrine statique organisé par features

**Performance Goals**: aucun JS ajouté ; la photo boutique est servie par `<Image>` en `widths` responsives ; les SVG sont inlinés (poids négligeable)

**Constraints**:
- contrat de thème : blanc réservé au grand texte sur `primary`/`secondary`, jamais sur `tertiary` ; `Badge variant="tertiary"` proscrit sur la page ;
- ajustements visuels dans les sections uniquement — interdiction de retoucher les teintes de `src/styles/global.css` ;
- aucune coordonnée (téléphone, email) affichée : gate #67 ;
- périmètre strictement limité à `src/features/sibra/sections/` + `src/pages/la-sibra.astro` : aucune autre page, ni `header`, ni `footer`, ni `constants.ts` ;
- un seul `h1` sur la page, hiérarchie de titres sans saut de niveau.

**Scale/Scope**: 3 fichiers créés, 1 fichier modifié, 0 dépendance ajoutée

## Constitution Check

*GATE: passé avant Phase 0, re-vérifié après Phase 1.*

| Principe | Évaluation | Verdict |
|---|---|---|
| I. Contenu d'abord, exactitude obligatoire | Tous les textes viennent du fichier source du 2026-09-18, repris sans invention ni lorem ipsum ; l'écriture inclusive de la source est conservée. Aucune coordonnée publiée (gate #67). | ✅ |
| II. Statique et simple par défaut | Aucune dépendance, aucun backend, aucun état. Trois composants `.astro` statiques réutilisant les composants partagés existants. | ✅ |
| III. Performance et SEO non négociables | Photo servie via `<Image>` (WebP responsive, `widths`) ; SVG inline ; aucun JS ajouté. Métadonnées SEO définitives déléguées à l'issue #63 — délégation explicite, pas une omission. | ✅ |
| IV. Accessibilité et responsive | Un seul `h1`, `h2` pour les sections, décorations `aria-hidden`, alt FR descriptif sur la photo, contrastes conformes au contrat de thème, décorations masquées sous `md` pour éviter tout chevauchement. | ✅ |
| V. Cohérence de la stack | Patrons `la-carte-postale-*` suivis à l'identique, alias `@/`, `pnpm build` + `pnpm lint` verts avant PR, Conventional Commits, PR vers la branche epic. | ✅ |

**Aucune violation** → section Complexity Tracking sans objet.

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/            # epic — source de vérité
├── spec.md, plan.md, research.md, data-model.md, tasks.md, quickstart.md
├── contracts/{theme.md,page-et-seo.md}
└── issues/
    ├── 59-socle/
    └── 60-hero/                     # cette sous-feature
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
│   ├── container.astro, section.astro, heading.astro, text.astro
│   ├── link.astro, instagram-feed.astro
├── features/sibra/
│   ├── images/                              # INCHANGÉ — livré par #59
│   └── sections/                            # NOUVEAU dossier
│       ├── sibra-hero-section.astro         # NOUVEAU (T008)
│       ├── sibra-what-section.astro         # NOUVEAU (T009)
│       └── sibra-instagram-section.astro    # NOUVEAU (T010)
└── pages/la-sibra.astro                     # MODIFIÉ (T011) — assemblage
```

**Structure Decision**: le dossier `sections/` de la feature `sibra` est créé ici, à l'identique des cinq autres lieux (`src/features/<lieu>/sections/<prefixe>-<nom>-section.astro`). Préfixe `sibra-` **sans article** (convention R1 de l'epic) ; seule la page `la-sibra.astro`, dérivée de l'URL, garde l'article.

## Phase 0 — Research

Voir [research.md](./research.md). Les décisions structurantes (composition des sections, palette, décorations, texte source) sont **déjà tranchées dans l'epic** ; la recherche propre à cette issue porte sur trois points d'adaptation : construction du motif « trois disques » en SVG inline, arbitrage de la couleur des textes sur fond vert, et forme des liens internes de la mention de disponibilité.

## Phase 1 — Design & Contracts

- [data-model.md](./data-model.md) : contenus portés par chaque section (constantes locales et texte rédigé), avec leur origine dans le texte source.
- [contracts/sections.md](./contracts/sections.md) : contrat des trois composants de section (nom de fichier, props, structure DOM attendue, classes de thème, invariants d'accessibilité). Les contrats de thème et de route/SEO restent ceux de l'epic : [`../../contracts/theme.md`](../../contracts/theme.md), [`../../contracts/page-et-seo.md`](../../contracts/page-et-seo.md).
- [quickstart.md](./quickstart.md) : comment vérifier l'incrément de bout en bout (build, lint, relecture visuelle aux deux largeurs, contrôles d'accessibilité).

## Post-Design Constitution Re-check

Re-vérifié après rédaction des artefacts de Phase 1 : aucun principe mis en tension. Le seul écart au patron copié (texte courant en `foreground` plutôt qu'en blanc) est une **conséquence** du principe IV, pas une dérogation. ✅

## Complexity Tracking

Sans objet — aucune violation de la constitution à justifier.
