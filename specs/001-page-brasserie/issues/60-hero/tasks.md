# Tasks: Découvrir La Sibra — hero, « c'est quoi ? », Instagram (issue #60)

**Input**: Design documents from `/specs/001-page-brasserie/issues/60-hero/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/sections.md](./contracts/sections.md), [quickstart.md](./quickstart.md)

**Parent**: epic [`specs/001-page-brasserie/`](../../tasks.md) — ces tâches déroulent T008–T012 de l'epic. En cas de divergence, **les artefacts de l'epic priment**.

**Tests**: aucun framework de test dans le dépôt — pas de tâches de tests automatisés. La validation repose sur `astro check` + `astro build`, `eslint` et la **vérification visuelle mobile + desktop**.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, pas de dépendance sur une tâche inachevée)
- **[Story]** : US1–US3, mappé sur [spec.md](./spec.md)

## Git Workflow

- Branche : `001-page-brasserie-hero` (schéma **plat**, depuis `001-page-brasserie-lint-baseline` qui contient l'epic + le correctif de lint).
- PR → branche epic `001-page-brasserie`, **jamais `main`**. Corps contenant `Closes #60`.
- Conventional Commits. Les artefacts de specs sont commités avec le code.
- **Le merge est réservé à l'humain.**

---

## Phase 1: Setup

- [X] T001 Créer le dossier `src/features/sibra/sections/` (dossier de sections de la feature, absent à ce stade — le socle #59 n'a livré que `images/`)

---

## Phase 2: Foundational

Aucune tâche bloquante : le socle (#59) a déjà livré la route, le thème, les photos et les décorations. Les trois sections peuvent être écrites en parallèle.

---

## Phase 3: User Story 1 — Identifier le lieu dès l'ouverture (Priority: P1)

**Goal**: un visiteur reconnaît le lieu dès le premier écran (nom, accroche, identité visuelle), sans décoration qui gêne la lecture.

**Independent Test**: ouvrir la page à 375 px et à ≥ 1280 px → nom et accroche lisibles, décorations masquées en mobile, visuel provisoire non annoncé aux lecteurs d'écran.

- [X] T002 [US1] Créer `src/features/sibra/sections/sibra-hero-section.astro` sur le patron `src/features/la-carte-postale/sections/la-carte-postale-hero-section.astro` : `<Section class="relative overflow-hidden bg-white">`, deux `SibraHeroDeco` importés de `@/features/sibra/images/sibra-hero-decoration.svg` (`absolute top-0 left-0 hidden w-[300px] md:block text-secondary-accent` et `absolute bottom-0 right-0 hidden w-[300px] rotate-180 md:block text-primary-accent`, tous deux `aria-hidden="true"`), un `<Container>` central
- [X] T003 [US1] Dans `sibra-hero-section.astro`, ajouter le bloc **placeholder logo** précédé du commentaire `TODO logo : remplacer par le logo de La Sibra dès réception` : SVG inline `aria-hidden="true" focusable="false"` à trois cercles en classes `fill-tertiary` / `fill-secondary` / `fill-primary` (géométrie reprise de `src/features/sibra/images/sibra-what-ornament.svg`), surmontant le nom « La Sibra » rendu par un `<p>` en `font-pally` gras centré — **pas** un élément de titre (research R60-4)
- [X] T004 [US1] Dans `sibra-hero-section.astro`, ajouter le `h1` « De l’houblon à la pression » en `text-center font-pally text-4xl font-bold md:text-5xl` (unique `h1` de la page, FR-001)

**Checkpoint**: le hero se rend seul, à l'identique du patron, sans texte recouvert.

---

## Phase 4: User Story 2 — Comprendre ce qu'est le lieu (Priority: P1)

**Goal**: un inconnu comprend le quartier, l'ancien nom, ce qui distingue la bière et le sens du projet pour la coopérative.

**Independent Test**: lire la section → les quatre informations sont restituables sans naviguer ailleurs.

- [X] T005 [P] [US2] Créer `src/features/sibra/sections/sibra-what-section.astro` sur le patron `la-carte-postale-what-section.astro` : `<Section variant="primary" class="overflow-hidden">`, ornement `SibraWhatOrnament` (`absolute bottom-0 left-0 text-primary-accent`, `aria-hidden="true"`), `<Container class="relative z-20 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">`
- [X] T006 [US2] Dans `sibra-what-section.astro`, intégrer les textes **exacts** de [data-model.md](./data-model.md) : `Heading as="h2" color="white"` « La Sibra, c’est quoi ? », `Text size="xl" weight="semibold" color="white"` « Le tout nouveau lieu de la coopérative ! », paragraphe de présentation en `Text size="base"` **sans `color="white"`**, paragraphe « À l’image du lien… » en `Text font="pally" size="xl" weight="semibold"` — le conteneur de colonne ne porte **pas** `text-white` (research R60-2)
- [X] T007 [US2] Dans `sibra-what-section.astro`, ajouter la mention de disponibilité avec deux `Link` vers `PATH.HOME` (« les autres lieux de la coopérative ») et `PATH.LES_LANDES_FERTILES` (« la ferme des Landes Fertiles »), importés de `@/utils/constants` — aucune URL en dur (FR-005)
- [X] T008 [US2] Dans `sibra-what-section.astro`, ajouter la photo `@/features/sibra/images/sibra-boutique.webp` via `<Image widths={[640, 960, 1280, …]} class="w-full rounded-2xl object-cover">` avec l'alt FR descriptif de [data-model.md](./data-model.md) (FR-006)

**Checkpoint**: la section se rend seule, contrastes conformes, liens internes fonctionnels.

---

## Phase 5: User Story 3 — Prolonger la découverte sur Instagram (Priority: P2)

**Goal**: le visiteur retrouve l'actualité du lieu en bas de page.

**Independent Test**: dérouler jusqu'en bas → titre de section + fil du compte de la brasserie.

- [X] T009 [P] [US3] Créer `src/features/sibra/sections/sibra-instagram-section.astro` sur le patron `la-carte-postale-instagram-section.astro` : `h2` « Retrouvez-nous sur Instagram » + `<InstagramFeed username="bieresdecharlotte" />` (FR-008)

---

## Phase 6: Assemblage

- [X] T010 Modifier `src/pages/la-sibra.astro` : supprimer le bloc annoté `TODO #60` et les imports de SVG devenus inutiles, importer et rendre `SibraHeroSection` → `SibraWhatSection` → `SibraInstagramSection` ; `Layout theme="sibra"` et `content` inchangés (métadonnées définitives = issue #63) (FR-009)

---

## Phase 7: Polish & vérifications

- [X] T011 Lancer `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css` puis `./node_modules/.bin/astro check` et `./node_modules/.bin/astro build` — tous verts (SC-006)
- [X] T012 **Vérification visuelle mobile (375 px) + desktop (≥ 1280 px)** selon la check-list de [quickstart.md](./quickstart.md) : bulles et trois disques sans chevauchement, masquage mobile propre, pas de défilement horizontal, contrastes conformes — ajuster positions/tailles **dans les sections**, jamais les teintes de `src/styles/global.css` (SC-002, SC-003)
- [X] T013 Vérifier sur le HTML produit : un seul `h1` (SC-004) et **aucune** coordonnée (`tel:`, `mailto:`, `@gmail`, numéro) (SC-005, FR-012)
- [X] T014 Corriger dans `specs/001-page-brasserie/tasks.md` la mention de l'ancien schéma de branche à slash (`001-page-brasserie/T008-hero-section`) : git interdit qu'une référence soit à la fois une branche et le préfixe d'une autre, le schéma retenu est plat (`001-page-brasserie-<suffixe>`)

---

## Dependencies

- T001 précède toutes les créations de fichiers de section.
- T002 → T003 → T004 : même fichier, séquentiel.
- T005 → T006 → T007 → T008 : même fichier, séquentiel.
- T009 : indépendant.
- T010 dépend de T004, T008, T009.
- T011–T013 dépendent de T010. T014 est indépendant de tout le reste.

## Parallel Example

```text
# Après T001, trois fichiers distincts :
Task: "Créer sibra-hero-section.astro (T002→T004)"
Task: "Créer sibra-what-section.astro (T005→T008)"
Task: "Créer sibra-instagram-section.astro (T009)"
# Puis séquentiellement : T010 (assemblage) → T011–T013 (vérifications)
```

## Implementation Strategy

MVP = US1 + US2 (le hero et la présentation suffisent au test indépendant de la story P1 de l'epic) ; US3 (Instagram) est un fichier de neuf lignes calqué sur l'existant et est livré dans le même incrément. L'ensemble tient en une PR vers la branche epic.
