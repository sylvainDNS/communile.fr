---
description: "Task list — Issue #63 : découvrabilité moteurs de La Sibra"
---

# Tasks: Découvrabilité moteurs de La Sibra (JSON-LD, sitemap, robots.txt)

**Input**: Design documents from `specs/001-page-brasserie/issues/63-seo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: aucun framework de test dans le dépôt — pas de tâches de test automatisé. Les vérifications sont les gates lint/check/build et la procédure manuelle de `quickstart.md`.

**Organization**: tâches groupées par user story de `spec.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: parallélisable (fichiers distincts, aucune dépendance inachevée)
- **[Story]**: user story concernée (US1, US2, US3)

## Path Conventions

Site Astro : `src/pages/`, `src/features/<lieu>/`, `src/utils/`, `public/`. Chemins donnés depuis la racine du dépôt.

---

## Phase 1: Setup

- [X] T001 Vérifier que la branche `001-page-brasserie-seo` part bien de `origin/001-page-brasserie` et que `./node_modules/.bin/astro --version` répond

---

## Phase 2: Foundational (prérequis bloquant)

**Purpose**: la source de vérité des routes doit être complète avant que le sitemap puisse en dériver.

- [X] T002 Ajouter `CONTACT: '/contact'` à l'objet `PATH` de `src/utils/constants.ts`, en fin du groupe des pages (juste après `LA_SIBRA`, avant les entrées à ancre) — cf. `research.md` R3

**Checkpoint**: `Object.values(PATH).filter(p => !p.includes('#'))` renvoie exactement les 8 pages publiques.

---

## Phase 3: User Story 1 — Retrouver la brasserie via un moteur de recherche (Priority: P1) 🎯 MVP

**Goal**: `/la-sibra` expose des données structurées `Brewery` exactes et valides, sans aucune coordonnée non confirmée.

**Independent Test**: lire le bloc `application/ld+json` dans le code source de `/la-sibra`, le passer au validateur schema.org → 0 erreur ; vérifier l'absence de téléphone et d'e-mail.

- [X] T003 [US1] Dans le frontmatter de `src/pages/la-sibra.astro`, construire la constante `brewerySchema` conforme à `contracts/jsonld-brewery.md` : `@type: 'Brewery'`, `name`, `alternateName`, `description` (la constante `description` de la page, pas une copie), `url` composée de `SITE_URL` et `PATH.LA_SIBRA`, `address` (`PostalAddress` — 121 rue du Général Buat, 44000 Nantes, FR), `geo` (`GeoCoordinates` — 47.225406 / −1.543878, en nombres), `openingHoursSpecification` (vendredi 16:00–20:00, samedi 11:00–20:00), `sameAs` Instagram `bieresdecharlotte`
- [X] T004 [US1] **Ne pas** inclure `telephone` ni `email` dans `brewerySchema` ; ajouter un commentaire court renvoyant au gate #67 pour que l'omission soit lisible comme intentionnelle et non comme un oubli (`research.md` R6, constitution principe I)
- [X] T005 [US1] Passer `jsonLd: brewerySchema` dans la prop `content` du `<Layout>` de `src/pages/la-sibra.astro` (patron de `src/pages/a-la-carte-postale.astro`)
- [X] T006 [US1] Vérifier la cohérence des faits publiés avec ce qu'affiche déjà la page : adresse identique à `src/features/sibra/sections/sibra-infos-section.astro`, coordonnées identiques à la carte de cette même section, horaires identiques au tableau de `src/features/sibra/sections/sibra-boutique-section.astro` (invariant C4)
- [X] T007 [US1] Valider le bloc sur https://validator.schema.org → **0 erreur** (FR-007 / SC-001) et vérifier `JSON.parse` du contenu rendu (invariants C1–C7 de `contracts/jsonld-brewery.md`)

**Checkpoint**: données structurées valides et exactes — la page est exploitable par un moteur.

---

## Phase 4: User Story 2 — Partager le lien de la page (Priority: P2)

**Goal**: aperçu de partage complet et description définitive.

**Independent Test**: inspecter `<title>`, `<meta name="description">`, `og:*` et `twitter:*` de `/la-sibra`.

- [X] T008 [US2] Remplacer la constante `description` de `src/pages/la-sibra.astro` par la formulation définitive de `research.md` R8 (151 caractères, « anciennement Les Bières de Charlotte » + les deux plages de la boutique, typographie `16 h – 20 h` reprise de `sibra-boutique-section.astro:13`) ; vérifier la longueur ≤ 160 (FR-008 / SC-004)
- [X] T009 [US2] Importer `src/features/sibra/images/sibra-boutique.webp` dans `src/pages/la-sibra.astro` et le passer en `image` dans la prop `content` du layout (patron des autres pages de lieux) ; vérifier que `og:image` ne pointe plus vers `communile-logo.webp`
- [X] T010 [US2] Renseigner le champ `image` de `brewerySchema` avec l'URL absolue de cette même photo optimisée à 1200 px (`getImage` d'`astro:assets`), cohérente avec `og:image`

**Checkpoint**: partage social correct, description conforme au contrat.

---

## Phase 5: User Story 3 — Explorer l'ensemble du site (Priority: P2)

**Goal**: le site expose enfin un sitemap et un robots.txt.

**Independent Test**: `curl` sur `/sitemap.xml` et `/robots.txt` — statuts, types de contenu et contenus conformes à `contracts/sitemap-robots.md`.

- [X] T011 [P] [US3] Créer `src/pages/sitemap.xml.ts` : `APIRoute` `GET` qui dérive les URLs de `Object.values(PATH).filter(...)` en écartant les entrées contenant `#`, construit chaque URL absolue par `new URL(path, SITE_URL).href` (cf. `research.md` R4), échappe les caractères XML (`research.md` R5) et renvoie le `urlset` avec `Content-Type: application/xml; charset=utf-8` (pas de `prerender`, cf. `research.md` R2)
- [X] T012 [P] [US3] Créer `public/robots.txt` : `User-agent: *`, `Allow: /`, ligne vide, `Sitemap: https://communile.fr/sitemap.xml`
- [X] T013 [US3] Vérifier les invariants S1–S7 et R1–R3 de `contracts/sitemap-robots.md` sur le serveur de développement : 8 `<loc>`, aucune ancre, pas de 404, type de contenu XML, et concordance caractère pour caractère entre chaque `<loc>` et le `<link rel="canonical">` de la page correspondante (FR-013)

**Checkpoint**: robots et sitemap servis et cohérents avec les canonicals.

---

## Phase 6: Polish & gates

- [X] T014 `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css` → exit 0
- [X] T015 `./node_modules/.bin/astro check` puis `./node_modules/.bin/astro build` → verts
- [X] T016 Vérifier la non-régression visuelle de `/la-sibra` (mobile 375 px + desktop) : seul le `<head>` doit avoir changé (constitution principe IV)
- [X] T017 Vérifier qu'aucun fichier hors périmètre n'a été modifié : `src/components/header.astro`, `src/components/footer.astro`, `src/features/home/sections/home-places-section.astro`, `src/features/la-carte-postale/sections/la-carte-postale-what-section.astro`, `.claude/`, `pnpm-workspace.yaml`, `astro.config.mjs`, `package.json`

---

## Dependencies & Execution Order

- **T001** (setup) → tout le reste
- **T002** (foundational) bloque **T011** uniquement — US1 et US2 n'en dépendent pas
- **US1 (T003–T007)** : indépendante ; T003 → T004 → T005 → T006 → T007
- **US2 (T008–T010)** : T008 et T009 indépendantes entre elles ; T010 requiert T009 (même image) et T003 (l'objet existe) ; T003 consomme la constante `description`, donc faire T008 **avant ou en même temps** que T003 évite une double édition
- **US3 (T011–T013)** : T011 et T012 en parallèle, puis T013
- **Polish (T014–T017)** : après toutes les stories

**Contention de fichier** : `src/pages/la-sibra.astro` est touché par T003, T004, T005, T008, T009, T010 — à sérialiser (un seul intervenant), de préférence en une seule passe d'édition.

## Parallel Opportunities

- T011 et T012 (fichiers distincts, US3)
- US3 entière en parallèle de US1/US2 une fois T002 faite
- T008 en parallèle de T011/T012

## Implementation Strategy

**MVP** : Phase 1 + Phase 2 + US1 — les données structurées sont le cœur de l'issue. US2 (3 tâches) et US3 (3 tâches) sont de petits incréments indépendants ; l'issue n'est close que lorsque les trois sont livrées, T019–T021 étant indissociables dans le découpage de l'epic.

**Livraison** : une seule PR vers l'epic `001-page-brasserie`, corps contenant `Closes #63`, Conventional Commits, artefacts de specs inclus.

## Journal de vérification (au moment de la livraison)

| Vérification | Méthode réelle | Résultat |
|---|---|---|
| Lint | `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css` | exit 0 (seul un avis informatif `baseline-browser-mapping`, sans rapport avec le diff) |
| Types | `./node_modules/.bin/astro check` | 101 fichiers, 0 erreur / 0 warning / 0 hint |
| Build | `./node_modules/.bin/astro build` | vert |
| `/sitemap.xml` | `curl` sur `astro dev` | 200, `application/xml; charset=utf-8`, 8 `<loc>`, aucune ancre, aucun 404 |
| `/robots.txt` | `curl` | 200, `Allow: /` + ligne `Sitemap:` absolue |
| Canonical ↔ sitemap | `curl` sur `/la-sibra` et `/` | `https://communile.fr/la-sibra` et `https://communile.fr/` — identiques aux `<loc>` caractère pour caractère |
| JSON-LD parsable | extraction du `<script>` rendu + `JSON.parse` | OK |
| **Validateur schema.org** | **POST de la page rendue sur `validator.schema.org/validate`** | **`numObjects=1`, `totalNumErrors=0`, `totalNumWarnings=0`, `type=Brewery`** |
| Coordonnées sous gate #67 | `grep -E 'telephone|bce\.brasserie|0633015663'` sur le HTML rendu | aucune occurrence |
| Description | mesure sur le HTML rendu | 151 caractères, identique au `description` du JSON-LD |
| Image de partage | comparaison `og:image` / `image` du JSON-LD | même transformation `w=1200`, origine canonique pour le JSON-LD (cf. `research.md` R9) |

**Réserve assumée sur T016** : la non-régression visuelle n'a pas été constatée par capture d'écran. La preuve retenue est statique et vérifiable : dans `src/pages/la-sibra.astro` seuls le frontmatter et les props `content` du `<Layout>` sont modifiés — la liste des sections du corps est inchangée — et aucun fichier de `src/features/sibra/` n'apparaît au `git status`. Le rendu visible ne peut donc pas avoir changé. Un coup d'œil humain avant merge reste souhaitable (constitution principe IV).

## Notes

- Jamais `git add -A` ni `git add .` : ajouter les fichiers explicitement.
- Ne pas toucher `.claude/`, `pnpm-workspace.yaml`, ni les fichiers de l'issue #62.
- `pnpm` est cassé sur le poste : utiliser les binaires de `node_modules/.bin`.
- Téléphone et e-mail restent interdits de publication jusqu'à levée du gate #67.
