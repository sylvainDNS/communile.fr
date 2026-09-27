# Implementation Plan: Réserver une tireuse à La Sibra (issue #65)

**Branch**: `001-page-brasserie-tireuse` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-page-brasserie/issues/65-tireuse/spec.md`

**Parent**: epic [`specs/001-page-brasserie/`](../../plan.md). Les décisions d'architecture, de palette, de nommage et de contenu sont prises **là-bas** et ne sont pas redémontrées ici ; ce plan déroule la tâche T023 de `../../tasks.md`.

## Summary

Livrer la story P4 de `/la-sibra` : une section « Prêt de tireuse » qui énonce le principe (tireuse prêtée pour l'achat d'un fût), illustre les trois occasions du texte source et met en avant le mode de réservation (appeler la brasserie).

Approche technique : un composant de section autonome, sans prop, sur `Section variant="secondary"` (rose de la charte), reprenant le patron typographique validé en #60 sur la section « c'est quoi ? » (titre et phrase forte en blanc grand texte, texte courant en `foreground`), et une liste de trois cartes claires `Card bg-background` (icône décorative + libellé) pour les occasions.

**Écart assumé avec T023** : le CTA prévu en lien `tel:+33633015663` est livré **sans numéro et sans lien**. Le numéro est non confirmé et gelé par le gate #67 ; la constitution (principe I) interdit de publier une coordonnée non vérifiée, et l'issue #64 applique déjà cette règle. Détail et alternatives : [research.md § R65-1](./research.md). **À valider par l'humain.**

Aucune dépendance ajoutée, aucun JavaScript ajouté, aucun asset ajouté, aucun composant partagé créé ou modifié.

## Technical Context

**Language/Version**: TypeScript 5.9, Astro 5.16, Node ≥ 21

**Primary Dependencies**: Astro 5, Tailwind CSS 4, composants partagés `src/components/{section,container,heading,text,card,icon}.astro`

**Storage**: N/A — site statique

**Testing**: aucun framework de test dans le dépôt. Validation = `astro check` + `astro build` + `eslint` + vérification visuelle 375 px / ≥ 1280 px (cf. [quickstart.md](./quickstart.md))

**Target Platform**: navigateurs modernes (mobile + desktop), hébergement Cloudflare

**Project Type**: site vitrine statique organisé par features

**Performance Goals**: aucun JS ajouté, aucune image ajoutée ; l'ornement SVG est inliné par Astro et déjà présent dans la feature

**Constraints**:
- contrat de thème : sur fond `secondary`, blanc réservé au grand texte (≥ 24 px ou ≥ 18,66 px en graisse 700) — `weight="semibold"` ne qualifie pas ; jamais de blanc sur `tertiary` ; `Badge variant="tertiary"` proscrit sur la page ;
- ajustements visuels dans la section uniquement — interdiction de retoucher les teintes de `src/styles/global.css` ;
- aucune coordonnée (téléphone, email) : gate #67 ;
- aucun élément interactif sans destination (pas de faux bouton) ;
- périmètre strictement limité à `src/features/sibra/sections/sibra-tireuse-section.astro` + `src/pages/la-sibra.astro` : aucun composant partagé, aucun autre fichier de la feature, ni `constants.ts` ;
- un seul `h1` sur la page ; la section ajoute exactement un `h2`.

**Scale/Scope**: 1 fichier créé, 1 fichier modifié, 0 dépendance ajoutée, 0 asset ajouté

## Constitution Check

*GATE: passé avant Phase 0, re-vérifié après Phase 1.*

| Principe | Évaluation | Verdict |
|---|---|---|
| I. Contenu d'abord, exactitude obligatoire | Tous les textes viennent du bloc « Prêt de tireuses » du fichier source du 2026-09-18, sans invention de condition commerciale. Le numéro non confirmé n'est pas publié (gate #67) — c'est une application directe du principe, pas une omission. | ✅ |
| II. Statique et simple par défaut | Aucune dépendance, aucun backend, aucun état, aucun JS. Un composant `.astro` statique réutilisant les composants partagés ; contenus en constante locale. | ✅ |
| III. Performance et SEO non négociables | Aucune image, aucun script ajoutés. Métadonnées et données structurées déléguées à #63 — délégation explicite. | ✅ |
| IV. Accessibilité et responsive | `h2` unique pour la section, occasions en `<ul>/<li>`, icônes décoratives masquées aux lecteurs d'écran, contrastes conformes au contrat de thème (blanc en grand texte uniquement sur le rose), aucun élément interactif factice, vérification aux deux largeurs. | ✅ |
| V. Cohérence de la stack | Patron des sections existantes de la page suivi, alias `@/`, imports triés, build + lint verts avant PR, Conventional Commits, PR vers la branche epic. | ✅ |

**Aucune violation** → section Complexity Tracking sans objet. L'écart à T023 (pas de `tel:`) est une **application** du principe I, et non une dérogation à la constitution ; il est documenté en spec et en research, et signalé pour validation humaine.

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/            # epic — source de vérité
├── spec.md, plan.md, research.md, data-model.md, tasks.md, quickstart.md
├── contracts/{theme.md,page-et-seo.md}
└── issues/
    ├── 59-socle/
    ├── 60-hero/
    ├── 64-bieres/
    └── 65-tireuse/                  # cette sous-feature
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
├── components/                               # INCHANGÉ — réutilisé tel quel
│   ├── section.astro, container.astro, heading.astro, text.astro
│   ├── card.astro, icon.astro
├── features/sibra/
│   ├── images/sibra-what-ornament.svg         # INCHANGÉ — réutilisé (livré par #60)
│   └── sections/
│       ├── sibra-hero-section.astro           # INCHANGÉ — #60
│       ├── sibra-what-section.astro           # INCHANGÉ — #60
│       ├── sibra-bieres-section.astro         # INCHANGÉ — #64
│       ├── sibra-instagram-section.astro      # INCHANGÉ — #60
│       └── sibra-tireuse-section.astro        # NOUVEAU (T023)
└── pages/la-sibra.astro                       # MODIFIÉ (T023) — assemblage
```

**Structure Decision**: fichier `sibra-tireuse-section.astro` dans le dossier `sections/` de la feature. Préfixe `sibra-` **sans article** (convention R1 de l'epic) ; l'article reste réservé à ce qui dérive de l'URL.

## Phase 0 — Research

Voir [research.md](./research.md) : sept points d'adaptation — traitement du CTA téléphone (R65-1), fond de section (R65-2), typographie du titre et de l'appel à l'action (R65-3), rendu des occasions et choix des icônes (R65-4), ornement plutôt que photo (R65-5), emplacement dans la page (R65-6), défauts connus des composants partagés laissés en l'état (R65-7).

## Phase 1 — Design & Contracts

- [data-model.md](./data-model.md) : contenus portés par la section (constante locale `occasions`), avec leur origine mot à mot dans le texte source, et les invariants de contenu.
- [contracts/sections.md](./contracts/sections.md) : contrat du composant (nom de fichier, absence de props, structure DOM attendue, invariants d'accessibilité, de contraste, de contenu et de périmètre). Les contrats de thème et de route/SEO restent ceux de l'epic.
- [quickstart.md](./quickstart.md) : validation de bout en bout (gates, fidélité au texte source, absence de coordonnée et d'interactif, relecture visuelle aux deux largeurs, accessibilité, périmètre du diff).

## Post-Design Constitution Re-check

Re-vérifié après rédaction des artefacts de Phase 1 : aucun principe mis en tension. Les deux écarts au plan littéral de T023 — pas de lien `tel:`, et donc pas de CTA interactif — découlent des principes I et IV. ✅

## Complexity Tracking

Sans objet — aucune violation de la constitution à justifier.
