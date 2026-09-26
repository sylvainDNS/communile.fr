# Implementation Plan: Polish final de l'epic « page La Sibra »

**Branch**: `001-page-brasserie-polish` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-page-brasserie/issues/66-polish/spec.md`

## Summary

Dernière passe de l'epic. Aucun contenu nouveau : on corrige ce qui est faux (les ratios du contrat de thème,
deux entrées de recherche), ce qui est non conforme (trois défauts a11y du composant de carte partagé, les
combinaisons de couleurs sous les seuils AA) et ce qui déborde (marges négatives à l'accueil). Puis on mesure :
navigateur aux deux largeurs sur les huit pages, Lighthouse mobile comparé, gates sur le dépôt entier.

L'approche tient en une règle : **mesurer avant d'écrire, et ne modifier un composant partagé que si la
correction est neutre au rendu ou vérifiée sur les six pages concernées.** Les dettes dont la correction
régresserait le rendu global sont documentées et renvoyées à un lot de refonte du design system.

## Technical Context

**Language/Version**: TypeScript 5, Astro 5, Node ≥ 21

**Primary Dependencies**: Astro 5, Tailwind CSS 4, Leaflet 1.9.4 (chargé depuis un CDN à l'exécution),
`class-variance-authority`, ESLint config @antfu

**Storage**: N/A — site statique, contenu en dur dans les composants

**Testing**: pas de suite automatisée dans le dépôt. Les gates sont `eslint`, `astro check`, `astro build`.
La vérification fonctionnelle est manuelle, au navigateur, via Chrome DevTools.

**Target Platform**: navigateurs modernes, mobile et desktop ; déploiement Cloudflare

**Project Type**: site vitrine statique multipage

**Performance Goals**: pas de régression Lighthouse mobile de `/la-sibra` face à `/a-la-carte-postale` sur
performance, accessibilité et SEO ; poids de page du même ordre (SC-004 de l'epic)

**Constraints**:

- WCAG 2.1 AA : 4,5:1 en texte courant, 3:1 en grand texte (≥ 24 px, ou ≥ 18,66 px en graisse **700** ;
  la graisse 600 ne qualifie pas).
- Les trois couleurs de la charte sont imposées : on ne retouche jamais `--color-sibra-green|pink|orange`.
- La CI installe en `--frozen-lockfile` : aucune modification de `package.json`/lockfile dans cette passe.
- `eslint .` couvre les blocs de code des fichiers Markdown : les blocs illustratifs des specs sont en
  ```` ```text ````.
- Gate #67 fermé : ni téléphone ni email non confirmés, nulle part.

**Scale/Scope**: 8 pages publiques, 7 sections Sibra, 5 composants partagés dans le rayon d'impact,
2 artefacts de specs à corriger.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Statut | Justification |
|---|---|---|
| I. Contenu d'abord, exactitude obligatoire | **Cœur de la passe** | La correction des ratios faux du contrat et de R5/R7 est une application directe du principe : une donnée publiée dans le dépôt doit être exacte. Le gate #67 reste fermé (FR-022). |
| II. Statique et simple par défaut | ✅ | Aucune dépendance ajoutée, aucun backend, aucun lockfile touché. Les corrections a11y de la carte sont des attributs et une option Leaflet, pas un mécanisme nouveau. |
| III. Performance et SEO non négociables | ✅ vérifié en Phase 1 | T026 mesure Lighthouse avant merge. Aucune des corrections envisagées n'ajoute de JavaScript ni d'octets significatifs. |
| IV. Accessibilité et responsive | **Cœur de la passe** | US1 et US3 sont exactement ce principe. |
| V. Cohérence de la stack | ✅ | Corrections dans les conventions existantes ; gates lancés sur le dépôt entier avant PR. |

**Aucune violation à justifier.** La section Complexity Tracking est donc omise.

Re-check après Phase 1 : inchangé. Les décisions de recherche (R66-1 à R66-8) ne créent ni dépendance, ni
abstraction, ni complexité nouvelle ; deux d'entre elles (R66-5, R66-6) choisissent explicitement de **ne pas**
corriger pour éviter une régression, ce qui va dans le sens des principes III et V.

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/issues/66-polish/
├── spec.md              # Phase -1 (/speckit-specify)
├── plan.md              # Ce fichier
├── research.md          # Phase 0 — mesures et arbitrages des dettes
├── data-model.md        # Phase 0 — inventaire des dettes et de leur rayon d'impact
├── quickstart.md        # Phase 1 — protocole de vérification navigateur
├── contracts/
│   └── contrastes.md    # Phase 1 — tableau de contrastes recalculé, source du correctif
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

Fichiers dans le rayon d'impact de cette passe :

```text
src/
├── components/
│   ├── leaflet-map.astro          # 3 défauts a11y — partagé par les 6 pages de lieux + /contact
│   ├── tag.astro                  # contraste de la variante primary — partagé
│   ├── text.astro                 # size="base" émet deux tailles concurrentes — partagé
│   ├── card.astro                 # bg-white sans bordure, <article> systématique — partagé
│   └── info-card.astro
├── features/
│   ├── sibra/sections/            # 7 sections — revue design + a11y
│   └── home/sections/             # débordement horizontal à 1280 px
├── utils/constants.ts             # SITE_NAME en apostrophe ASCII
└── styles/global.css              # source de vérité des tokens (lecture seule ici)

specs/001-page-brasserie/
├── contracts/theme.md             # 4 ratios faux + 2 règles manquantes
└── research.md                    # R5 et R7 factuellement faux
```

**Structure Decision**: aucune structure nouvelle. La passe modifie des fichiers existants et n'ajoute que
les artefacts de specs de l'issue. Les corrections de composants partagés sont regroupées en un lot vérifié
séparément sur les six pages de lieux (cf. tasks.md), pour que la revue de la PR puisse les isoler.

## Séquencement

L'ordre est contraint par une dépendance logique : **on ne corrige pas un contraste avant d'avoir un tableau
de ratios fiable**. D'où :

1. **Phase A — mesurer** : recalcul de tous les ratios depuis `global.css` ; audit statique (titres, alt,
   marges négatives, usages de `Tag`) ; mesure au navigateur du débordement des huit pages. Rien n'est écrit.
2. **Phase B — documenter la vérité** : `contracts/contrastes.md` de l'issue, puis correction de
   `specs/001-page-brasserie/contracts/theme.md` et de R5/R7 dans `research.md`. C'est la référence dont
   dépend la phase C.
3. **Phase C — corriger le rendu** : composants partagés d'abord (rayon d'impact large, donc à vérifier tôt),
   puis sections Sibra, puis débordement de l'accueil.
4. **Phase D — vérifier** : navigateur aux deux largeurs sur les huit pages, Lighthouse comparé, gates,
   quickstart de l'epic.

Phases B et C sont séparées volontairement : si la passe devait s'arrêter en cours, la correction
documentaire seule a déjà de la valeur (elle empêche la prochaine erreur), alors qu'une correction de rendu
sans contrat à jour la reproduirait.

## Risques

| Risque | Parade |
|---|---|
| Une correction de composant partagé régresse une des cinq autres pages de lieux | Toute modification de `leaflet-map`, `Tag`, `Text` est suivie d'une vérification navigateur des six pages, pas seulement de `/la-sibra`. |
| « Corriger » `Text size="base"` change la taille du texte courant des huit pages | La correction retenue est **neutre au rendu** (cf. R66-4) : on supprime la classe perdante, pas la gagnante. |
| Le lint des blocs Markdown des specs casse la CI (précédent : 6 erreurs sur #62) | Tous les blocs illustratifs des artefacts de cette issue sont en ```` ```text ````, et `eslint` est lancé sur le dépôt entier, jamais restreint. |
| Le périmètre s'étend à une refonte du design system | Les dettes structurelles sont listées dans `data-model.md` avec une décision écrite « documentée, non corrigée » et la raison. |
| Une mesure de contraste faite « à l'œil » réintroduit une valeur fausse | Chaque ratio publié est produit par calcul reproductible depuis les tokens `oklch`, méthode consignée dans `contracts/contrastes.md`. |
