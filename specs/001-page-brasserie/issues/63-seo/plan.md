# Implementation Plan: Découvrabilité moteurs de La Sibra (JSON-LD, sitemap, robots.txt)

**Branch**: `001-page-brasserie-seo` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-page-brasserie/issues/63-seo/spec.md` · Issue [#63](https://github.com/sylvainDNS/communile.fr/issues/63) (T019–T021 de l'epic)

## Summary

Trois livrables indépendants, tous en métadonnées — aucun changement de rendu visuel :

1. **`src/pages/la-sibra.astro`** : description définitive (≤ 160 car., ancien nom + horaires boutique), image OG = `sibra-boutique.webp`, et JSON-LD `@type: 'Brewery'` passé via `content.jsonLd` (le layout sait déjà le sérialiser). Téléphone et e-mail **omis** (gate #67).
2. **`src/pages/sitemap.xml.ts`** : endpoint `GET` qui dérive les 8 URLs publiques des constantes `PATH` (filtre des entrées à ancre) et répond en `application/xml`. Ajout de `CONTACT: '/contact'` à `PATH` pour que la liste soit intégralement dérivée de la source de vérité.
3. **`public/robots.txt`** : `User-agent: *` / `Allow: /` + `Sitemap: https://communile.fr/sitemap.xml`.

## Technical Context

**Language/Version**: TypeScript 5.9, Astro 5.16

**Primary Dependencies**: `astro` (endpoints `APIRoute`, `astro:assets`), aucune dépendance nouvelle

**Storage**: N/A (contenu en dur dans les sources, comme le reste du site)

**Testing**: pas de framework de test dans le dépôt — validation par `astro check`, `eslint`, build, et vérification manuelle des réponses HTTP + validateur schema.org (cf. `quickstart.md`)

**Target Platform**: Cloudflare Workers (`@astrojs/cloudflare`, `output: 'server'`)

**Project Type**: site vitrine Astro, structure `src/pages` + `src/features/<lieu>`

**Performance Goals**: aucun JS client ajouté ; endpoint sitemap en O(nombre de routes), réponse < 1 Ko

**Constraints**: aucune information non vérifiée publiée (constitution I) ; pas de modification du mode de rendu ni de la config de build ; ne pas toucher `header.astro`, `footer.astro`, `home-places-section.astro`, `la-carte-postale-what-section.astro` (issue #62 en cours en parallèle)

**Scale/Scope**: 3 fichiers créés/modifiés + 1 constante ajoutée ; 8 URLs publiques

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Évaluation | Verdict |
|---|---|---|
| **I. Contenu d'abord, exactitude obligatoire** | Toutes les données publiées sont vérifiées : adresse (#61), geo Base Adresse Nationale `44109_3556_00121`, horaires affichés sur la page, Instagram déjà utilisé par la page. Téléphone et e-mail issus d'une archive Wayback **non confirmés** → omis du JSON-LD comme de l'affichage (décisions #61 et #65). | ✅ PASS |
| **II. Statique et simple par défaut** | Aucune dépendance ajoutée, aucun backend, aucune base. Le sitemap est un endpoint de 30 lignes dérivé d'une constante existante. Seule dérogation discutée : l'endpoint est rendu à la demande plutôt que prérendu — justifiée en `research.md` R2 (maîtrise du `Content-Type`, cohérence avec le reste du site qui est intégralement SSR). | ✅ PASS |
| **III. Performance et SEO non négociables** | C'est l'objet même de l'issue : données structurées + sitemap + robots.txt, soit exactement les trois manques que le principe nomme. Zéro octet de JS ajouté. | ✅ PASS |
| **IV. Accessibilité et responsive** | Aucun changement de rendu : pas de surface d'impact. La description et le titre restent en français typographié. | ✅ PASS (non concerné) |
| **V. Cohérence de la stack** | Le JSON-LD suit le patron déjà en place sur les 6 autres pages (`content.jsonLd`, objet littéral dans le frontmatter). L'endpoint suit l'API `APIRoute` standard d'Astro. `eslint` + `astro check` + `astro build` verts exigés. | ✅ PASS |

**Re-check post-Phase 1** : aucune violation introduite par le design. Pas d'entrée dans « Complexity Tracking ».

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/issues/63-seo/
├── plan.md              # Ce fichier
├── spec.md              # Spécification de l'issue
├── research.md          # Phase 0 — décisions techniques
├── data-model.md        # Phase 1 — entités et champs publiés
├── quickstart.md        # Phase 1 — procédure de validation
├── contracts/
│   ├── jsonld-brewery.md   # Forme exacte du bloc de données structurées
│   └── sitemap-robots.md   # Contrat des réponses /sitemap.xml et /robots.txt
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── la-sibra.astro        # MODIFIÉ — description, image OG, jsonLd Brewery
│   └── sitemap.xml.ts        # CRÉÉ — endpoint XML des pages publiques
├── utils/
│   └── constants.ts          # MODIFIÉ — ajout de PATH.CONTACT
└── layouts/
    └── main.astro            # INCHANGÉ — consomme déjà content.jsonLd et content.image

public/
└── robots.txt                # CRÉÉ
```

**Structure Decision**: structure existante du dépôt, aucune arborescence nouvelle. Le JSON-LD reste dans le frontmatter de la page (patron des 6 autres pages de lieux) plutôt que dans un module `src/features/sibra/` : les autres pages ne le font pas, et un module partagé serait de la généralisation prématurée (YAGNI, principe II).

## Hors périmètre explicite

- `header.astro`, `footer.astro`, `home-places-section.astro`, `la-carte-postale-what-section.astro` → issue #62, en cours par un autre contributeur.
- Polish final et revue design → issue #66.
- Publication du téléphone et de l'e-mail → gate humain #67.
- Retrait de la dépendance inutilisée `@astrojs/sitemap` de `package.json` → touche le lockfile, à décider par l'humain (cf. `research.md` R1).

## Complexity Tracking

> Aucune violation de la constitution à justifier.
